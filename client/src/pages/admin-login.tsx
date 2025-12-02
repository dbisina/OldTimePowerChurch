import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [hasExistingAdmin, setHasExistingAdmin] = useState(true);
  const { toast } = useToast();

  // Check if any admin exists (for initial setup)
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.status === 404 || response.status === 500) {
          // No admin exists yet, allow registration
          setHasExistingAdmin(false);
          setIsRegisterMode(true);
        }
      } catch {
        // Assume no admin exists if we can't check
        setHasExistingAdmin(false);
        setIsRegisterMode(true);
      }
    };
    checkAdminExists();

    // Auto-redirect if already logged in
    const token = localStorage.getItem("adminToken");
    if (token) {
      setLocation("/dashboard");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        toast({ title: "Success", description: "Logged in successfully" });
        setLocation("/dashboard");
      } else {
        toast({
          title: "Error",
          description: data.error || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role: "admin" }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        toast({ title: "Success", description: "Admin account created successfully!" });
        setLocation("/dashboard");
      } else {
        toast({
          title: "Error",
          description: data.error || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent mb-2">
            {isRegisterMode ? "Create Admin Account" : "Admin Login"}
          </h1>
          <p className="text-muted-foreground">Old Time Power Church Management</p>
        </div>

        <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isRegisterMode ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              {isRegisterMode ? "Register" : "Sign In"}
            </CardTitle>
            <CardDescription>
              {isRegisterMode 
                ? "Create your admin account to manage the church website"
                : "Enter your admin credentials to access the dashboard"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
              {isRegisterMode && (
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="bg-background/50 border-primary/20"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@yourchurch.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-admin-email"
                  className="bg-background/50 border-primary/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-admin-password"
                  className="bg-background/50 border-primary/20"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0"
                data-testid="button-admin-login"
              >
                {isLoading 
                  ? (isRegisterMode ? "Creating account..." : "Signing in...") 
                  : (isRegisterMode ? "Create Admin Account" : "Sign In")
                }
              </Button>
            </form>

            {hasExistingAdmin && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-sm text-primary hover:underline"
                >
                  {isRegisterMode 
                    ? "Already have an account? Sign in" 
                    : "Need to create an account? Register"
                  }
                </button>
              </div>
            )}

            {!hasExistingAdmin && (
              <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>First Time Setup:</strong>
                  <br />
                  No admin account exists yet. Please create one to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
