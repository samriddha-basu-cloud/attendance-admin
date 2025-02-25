import { useEffect } from "react";
import { signInWithGoogle } from "../firebase";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 bg-black border-b border-yellow-500/30 py-4 px-6 shadow-md shadow-yellow-500/10">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-yellow-400">Student Management System</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-md w-full">
        <Card className="bg-black border-yellow-500 border-2 text-white shadow-lg shadow-yellow-500/20">
          <CardHeader className="border-b border-yellow-500/30">
            <CardTitle className="text-2xl font-bold text-yellow-400">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-300 mb-6">
              Sign in with your Google account to access the student management portal.
            </p>
            
            <div className="flex justify-center">
              <Button 
                onClick={signInWithGoogle} 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full py-6"
              >
                <LogIn className="h-5 w-5" />
                <span className="font-medium">Sign in with Google</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-black border-t border-yellow-500/30 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 Student Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;