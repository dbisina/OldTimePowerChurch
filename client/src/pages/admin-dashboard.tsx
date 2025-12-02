import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  BookOpen,
  Megaphone,
  Users,
  Settings,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  Eye,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  duration: string;
  views: number;
}

interface Announcement {
  id: string;
  title: string;
  type: "text" | "graphic";
  date: string;
  status: "active" | "scheduled" | "archived";
}

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [adminEmail, setAdminEmail] = useState("");
  const [sermons, setSermons] = useState<Sermon[]>([
    {
      id: "1",
      title: "The Power of Persistent Prayer",
      preacher: "Pastor John",
      date: "Nov 24, 2024",
      duration: "45:30",
      views: 1240,
    },
    {
      id: "2",
      title: "Walking in the Spirit",
      preacher: "Pastor John",
      date: "Nov 22, 2024",
      duration: "38:15",
      views: 892,
    },
    {
      id: "3",
      title: "Understanding the Book of Romans",
      preacher: "Elder James",
      date: "Nov 19, 2024",
      duration: "52:00",
      views: 756,
    },
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Holiday Service Schedule",
      type: "text",
      date: "Nov 20, 2024",
      status: "active",
    },
    {
      id: "2",
      title: "Prayer Meeting Announcement",
      type: "graphic",
      date: "Nov 18, 2024",
      status: "active",
    },
    {
      id: "3",
      title: "Thanksgiving Celebration",
      type: "graphic",
      date: "Nov 15, 2024",
      status: "archived",
    },
  ]);

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

  const handleDeleteSermon = (id: string) => {
    setSermons(sermons.filter((s) => s.id !== id));
    toast({ title: "Sermon deleted successfully" });
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    toast({ title: "Announcement deleted successfully" });
  };

  const totalViews = sermons.reduce((sum, s) => sum + s.views, 0);
  const avgViews = Math.round(totalViews / sermons.length);

  return (
    <main className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back, {adminEmail}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-primary/20 hover:bg-destructive/10 hover:text-destructive"
            data-testid="button-admin-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Total Sermons</span>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent">
                {sermons.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All time uploads</p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Total Views</span>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent">
                {totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all sermons</p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Avg. Views</span>
                <Eye className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent">
                {avgViews}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per sermon</p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Announcements</span>
                <Megaphone className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent">
                {announcements.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total active</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sermons" className="w-full">
          <TabsList className="w-full md:w-auto bg-background/50 backdrop-blur-sm border border-primary/20 p-1 mb-8 flex flex-wrap">
            <TabsTrigger
              value="sermons"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-admin-sermons"
            >
              <BookOpen className="h-4 w-4" />
              <span>Sermons</span>
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-admin-announcements"
            >
              <Megaphone className="h-4 w-4" />
              <span>Announcements</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-admin-users"
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-admin-settings"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Sermons Tab */}
          <TabsContent value="sermons" className="mt-0 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Sermon Management</h2>
                <p className="text-muted-foreground">Manage your sermon library</p>
              </div>
              <Button className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Sermon
              </Button>
            </div>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/20 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary/10">
                      <TableHead>Title</TableHead>
                      <TableHead>Preacher</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sermons.map((sermon) => (
                      <TableRow key={sermon.id} className="border-primary/10">
                        <TableCell className="font-medium">{sermon.title}</TableCell>
                        <TableCell>{sermon.preacher}</TableCell>
                        <TableCell>{sermon.date}</TableCell>
                        <TableCell>{sermon.duration}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                            <Eye className="h-3 w-3" />
                            {sermon.views}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              data-testid={`button-edit-sermon-${sermon.id}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:text-destructive"
                              onClick={() => handleDeleteSermon(sermon.id)}
                              data-testid={`button-delete-sermon-${sermon.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="mt-0 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Announcement Management</h2>
                <p className="text-muted-foreground">Create and manage church announcements</p>
              </div>
              <Button className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {announcement.type === "text" ? "Text Announcement" : "Graphic Announcement"}
                        </CardDescription>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.status === "active"
                            ? "bg-green-500/20 text-green-700 dark:text-green-400"
                            : announcement.status === "scheduled"
                            ? "bg-blue-500/20 text-blue-700 dark:text-blue-400"
                            : "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {announcement.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{announcement.date}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-primary/20"
                        data-testid={`button-edit-announcement-${announcement.id}`}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-primary/20 hover:text-destructive hover:border-destructive"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        data-testid={`button-delete-announcement-${announcement.id}`}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-0 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground">Manage admin users and permissions</p>
              </div>
              <Button className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Admin User
              </Button>
            </div>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>Currently assigned administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-primary/10">
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-primary/10">
                        <TableCell className="font-medium">{adminEmail}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                            Super Admin
                          </span>
                        </TableCell>
                        <TableCell>2024-10-01</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="border-primary/20">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0 space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-6">Site Settings</h2>

              <div className="space-y-4">
                <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle>Church Information</CardTitle>
                    <CardDescription>Update your church details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Church Name</label>
                        <Input
                          defaultValue="Old Time Power Church"
                          className="bg-background/50 border-primary/20"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email</label>
                        <Input
                          defaultValue="info@otpchurch.org"
                          className="bg-background/50 border-primary/20"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Phone</label>
                        <Input
                          defaultValue="+1 (234) 567-890"
                          className="bg-background/50 border-primary/20"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Location</label>
                        <Input
                          defaultValue="123 Church Street, City, Country"
                          className="bg-background/50 border-primary/20"
                        />
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0">
                      <Download className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle>Newsletter Settings</CardTitle>
                    <CardDescription>Configure newsletter preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Newsletter Email</label>
                      <Input
                        defaultValue="newsletter@otpchurch.org"
                        className="bg-background/50 border-primary/20"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="newsletter" defaultChecked className="w-4 h-4" />
                      <label htmlFor="newsletter" className="text-sm">
                        Enable newsletter subscriptions
                      </label>
                    </div>
                    <Button className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
