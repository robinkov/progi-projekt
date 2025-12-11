import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthController from "@/controllers/authController";
import { cn } from "@/utils/styleUtils";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Register() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const fullName = firstName + " " + lastName;

    if (!firstName || !lastName || !email || !password || !repeatPassword) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError("Password and repeat password must match.");
      setLoading(false);
      return;
    }

    AuthController.signUpWithEmailAndPassword(email, password, fullName)
      .catch((error: Error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (password && repeatPassword) {
      if (password == repeatPassword) {
        setPasswordsMatch(true);
      } else {
        setPasswordsMatch(false);
      }
    } else {
      setPasswordsMatch(null);
    }
  }, [password, repeatPassword]);

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex items-center justify-center w-[400px] relative">
        <Button
          onClick={() => navigate("/auth")}
          variant="ghost"
          className="absolute left-0"
        >
          <ChevronLeft />
        </Button>
        <h1 className="text-lg font-semibold">Create an Account</h1>
      </div>
      <form className="flex flex-col w-[300px] gap-3 items-center" onSubmit={handleSubmit}>
        <div className="flex gap-[inherit]">
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Repeat password"
          value={repeatPassword}
          className={cn(
            passwordsMatch && "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/50",
            passwordsMatch === false && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
          )}
          onChange={(e) => setRepeatPassword(e.target.value)}
          required
        />
        <LoadingButton loading={loading}>
          Register
        </LoadingButton>
      </form>
      <div className="h-12 w-[350px] text-center">
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}
