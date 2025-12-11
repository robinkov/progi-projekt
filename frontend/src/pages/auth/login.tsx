import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthController from "@/controllers/authController";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    AuthController.loginWithEmailAndPassword(email, password)
      .catch((error: Error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

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
        <h1 className="text-lg font-semibold">Log Into Your Account</h1>
      </div>
      <form className="flex flex-col w-[250px] gap-4 items-center" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoadingButton loading={loading}>
          Login
        </LoadingButton>
      </form>
      <div className="h-12 w-[350px] text-center">
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}
