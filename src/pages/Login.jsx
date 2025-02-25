import { useEffect } from "react";
import { signInWithGoogle } from "../firebase";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Button onClick={signInWithGoogle} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Sign in with Google
      </Button>
    </div>
  );
};

export default Login;