import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase";
import { Button } from "@/components/ui/button";
import QRCodeComponent from "../components/QRCodeComponent";
import StudentsComponent from "../components/StudentsComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black border-b border-yellow-500/30 py-4 px-6 shadow-md shadow-yellow-500/10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="bg-yellow-500/20 p-2 rounded-full">
                <User className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-gray-300">{user?.displayName || user?.email}</span>
            </div>
            <Button 
              onClick={logout} 
              variant="destructive" 
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 gap-8">
          {/* Welcome Card */}
          <Card className="bg-black border-yellow-500 border-2 text-white shadow-lg shadow-yellow-500/20">
            <CardHeader className="border-b border-yellow-500/30">
              <CardTitle className="text-2xl font-bold text-yellow-400">
                Welcome, {user?.displayName || "User"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-300">
                You are successfully logged into the student management portal. 
                Use the tools below to manage students and access your QR code.
              </p>
            </CardContent>
          </Card>

          {/* Two-column layout for larger screens, single column for mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* QR Code Section - Takes 2/5 width on large screens */}
            <div className="lg:col-span-2">
              <QRCodeComponent />
            </div>

            {/* Students Component - Takes 3/5 width on large screens */}
            <div className="lg:col-span-3">
              <StudentsComponent />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-yellow-500/30 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 Student Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;