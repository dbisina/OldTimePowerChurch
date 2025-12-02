import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, BookOpen, Megaphone, Users, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [adminEmail, setAdminEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const email = localStorage.getItem("adminEmail");

    if (!token) {
      setLocation("/admin/login");
      return;
    }

    setAdminEmail(email || "");
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    toast({ title: "Logged out successfully" });
    setLocation("/");
  };

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Logged in as {adminEmail}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-primary/20"
            data-testid="button-admin-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="sermons" className="w-full">
          <TabsList className="w-full md:w-auto bg-background/50 backdrop-blur-sm border border-primary/20 p-1 mb-8">
            <TabsTrigger
              value="sermons"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-admin-sermons"
            >
              <BookOpen className="h-4 w-4" />
              Sermons
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-admin-announcements"
            >
              <Megaphone className="h-4 w-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-admin-users"
            >
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-admin-settings"
            >
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sermons" className="mt-0 space-y-4">
            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Sermon Management</CardTitle>
                <CardDescription>Add, edit, and manage sermons</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Sermon management system coming soon...</p>
                <Button className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0">
                  Add New Sermon
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="mt-0 space-y-4">
            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Announcement Management</CardTitle>
                <CardDescription>Create and manage church announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Announcement management system coming soon...</p>
                <Button className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0">
                  Create Announcement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-0 space-y-4">
            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage admin users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">User management system coming soon...</p>
                <Button className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0">
                  Add User
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-0 space-y-4">
            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure church site settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
