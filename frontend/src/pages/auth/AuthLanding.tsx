import BackgroundImageLarge from "@/assets/svgs/BackgroundImageLarge";
import GitHubLogo from "@/assets/svgs/GitHubLogo";
import GoogleLogo from "@/assets/svgs/GoogleLogo";
import { Button } from "@/components/ui/button";
import AuthController from "@/controllers/authController";
import { useNavigate } from "react-router";

export default function AuthLanding() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-8 h-[400px]">
      <div className="absolute overflow-hidden inset-0 -z-10">
        <BackgroundImageLarge className="absolute min-w-[800px] w-full left-1/2 -translate-x-1/2 bottom-0" />
      </div>
      <h1 className="text-xl font-semibold text-center">Choose your authentication method:</h1>
      <div className="flex flex-col w-[200px] gap-4">
        <Button variant="outline" onClick={() => navigate("login")} className="font-semibold cursor-pointer">
          Login
        </Button>
        <Button variant="outline" onClick={() => navigate("register")} className="font-semibold  cursor-pointer">
          Register
        </Button>
        <Button className="cursor-pointer"
          variant="outline"
          onClick={() => AuthController.signInWithGoogle()}
        >
          <GoogleLogo className="size-[none] h-5" />
        </Button>
        <Button className="cursor-pointer" variant="outline" onClick={() => AuthController.signInWithGitHub()}>
          <GitHubLogo className="h-5" />
        </Button>
      </div>
    </div>
  );
}