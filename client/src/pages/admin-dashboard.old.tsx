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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  X,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  youtubeUrl: string;
  startTime: string;
  endTime: string;
  views: number;
}

interface Announcement {
  id: string;
  title: string;
  type: "text" | "graphic";
  date: string;
  status: "active" | "scheduled" | "archived";
  content?: string;
  imageUrl?: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string;
  joinedDate: string;
  status: "active" | "unsubscribed";
}

// Helper function to extract YouTube video ID
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [adminEmail, setAdminEmail] = useState("");
  
  // State for sermons
  const [sermons, setSermons] = useState<Sermon[]>([
    {
      id: "1",
      title: "The Power of Persistent Prayer",
      preacher: "Pastor John",
      date: "Nov 24, 2024",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      startTime: "0:15",
      endTime: "45:30",
      views: 1240,
    },
    {
      id: "2",
      title: "Walking in the Spirit",
      preacher: "Pastor John",
      date: "Nov 22, 2024",
      youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      startTime: "2:30",
      endTime: "38:15",
      views: 892,
    },
    {
      id: "3",
      title: "Understanding the Book of Romans",
      preacher: "Elder James",
      date: "Nov 19, 2024",
      youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      startTime: "0:00",
      endTime: "52:00",
      views: 756,
    },
  ]);

  // State for announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Holiday Service Schedule",
      type: "text",
      date: "Nov 20, 2024",
      status: "active",
      content: "Join us for our holiday services",
    },
    {
      id: "2",
      title: "Prayer Meeting Announcement",
      type: "graphic",
      date: "Nov 18, 2024",
      status: "active",
      content: "Special prayer meeting this week",
    },
    {
      id: "3",
      title: "Thanksgiving Celebration",
      type: "graphic",
      date: "Nov 15, 2024",
      status: "archived",
      content: "Thanksgiving celebration event",
    },
  ]);

  // Dialog states
  const [sermonDialogOpen, setSermonDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Form states
  const [sermonForm, setSermonForm] = useState({
    title: "",
    preacher: "",
    date: "",
    youtubeUrl: "",
    startTime: "",
    endTime: "",
    views: "0",
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    type: "text" as "text" | "graphic",
    date: "",
    status: "active" as "active" | "scheduled" | "archived",
    imageUrl: "",
  });

  // State for newsletter subscribers
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([
    {
      id: "1",
      email: "john@example.com",
      name: "John Doe",
      joinedDate: "Dec 01, 2024",
      status: "active",
    },
    {
      id: "2",
      email: "jane@example.com",
      name: "Jane Smith",
      joinedDate: "Nov 28, 2024",
      status: "active",
    },
    {
      id: "3",
      email: "michael@example.com",
      name: "Michael Johnson",
      joinedDate: "Nov 20, 2024",
      status: "active",
    },
    {
      id: "4",
      email: "sarah@example.com",
      name: "Sarah Williams",
      joinedDate: "Nov 15, 2024",
      status: "active",
    },
    {
      id: "5",
      email: "david@example.com",
      name: "David Brown",
      joinedDate: "Nov 10, 2024",
      status: "unsubscribed",
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

  // Sermon handlers
  const openAddSermonDialog = () => {
    setEditingSermon(null);
    setSermonForm({ title: "", preacher: "", date: "", youtubeUrl: "", startTime: "", endTime: "", views: "0" });
    setSermonDialogOpen(true);
  };

  const openEditSermonDialog = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setSermonForm({
      title: sermon.title,
      preacher: sermon.preacher,
      date: sermon.date,
      youtubeUrl: sermon.youtubeUrl,
      startTime: sermon.startTime,
      endTime: sermon.endTime,
      views: sermon.views.toString(),
    });
    setSermonDialogOpen(true);
  };

  const handleSaveSermon = () => {
    if (!sermonForm.title || !sermonForm.preacher || !sermonForm.date || !sermonForm.youtubeUrl || !sermonForm.startTime || !sermonForm.endTime) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (editingSermon) {
      setSermons(
        sermons.map((s) =>
          s.id === editingSermon.id
            ? {
                ...s,
                title: sermonForm.title,
                preacher: sermonForm.preacher,
                date: sermonForm.date,
                youtubeUrl: sermonForm.youtubeUrl,
                startTime: sermonForm.startTime,
                endTime: sermonForm.endTime,
                views: parseInt(sermonForm.views) || s.views,
              }
            : s
        )
      );
      toast({ title: "Success", description: "Sermon updated successfully" });
    } else {
      const newSermon: Sermon = {
        id: Date.now().toString(),
        title: sermonForm.title,
        preacher: sermonForm.preacher,
        date: sermonForm.date,
        youtubeUrl: sermonForm.youtubeUrl,
        startTime: sermonForm.startTime,
        endTime: sermonForm.endTime,
        views: parseInt(sermonForm.views) || 0,
      };
      setSermons([newSermon, ...sermons]);
      toast({ title: "Success", description: "Sermon added successfully" });
    }

    setSermonDialogOpen(false);
  };

  const handleDeleteSermon = (id: string) => {
    setSermons(sermons.filter((s) => s.id !== id));
    toast({ title: "Sermon deleted successfully" });
  };

  // Announcement handlers
  const openAddAnnouncementDialog = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm({ title: "", content: "", type: "text", date: "", status: "active", imageUrl: "" });
    setAnnouncementDialogOpen(true);
  };

  const openEditAnnouncementDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content || "",
      type: announcement.type,
      date: announcement.date,
      status: announcement.status,
      imageUrl: announcement.imageUrl || "",
    });
    setAnnouncementDialogOpen(true);
  };

  const handleSaveAnnouncement = () => {
    if (!announcementForm.title || !announcementForm.date) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (editingAnnouncement) {
      setAnnouncements(
        announcements.map((a) =>
          a.id === editingAnnouncement.id
            ? {
                ...a,
                title: announcementForm.title,
                content: announcementForm.content,
                type: announcementForm.type,
                date: announcementForm.date,
                status: announcementForm.status,
                imageUrl: announcementForm.imageUrl,
              }
            : a
        )
      );
      toast({ title: "Success", description: "Announcement updated successfully" });
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: announcementForm.title,
        content: announcementForm.content,
        type: announcementForm.type,
        date: announcementForm.date,
        status: announcementForm.status,
        imageUrl: announcementForm.imageUrl,
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      toast({ title: "Success", description: "Announcement created successfully" });
    }

    setAnnouncementDialogOpen(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    toast({ title: "Announcement deleted successfully" });
  };

  const totalViews = sermons.reduce((sum, s) => sum + s.views, 0);
  const avgViews = sermons.length > 0 ? Math.round(totalViews / sermons.length) : 0;

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
              value="subscribers"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-admin-subscribers"
            >
              <Mail className="h-4 w-4" />
              <span>Newsletter</span>
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
              <Dialog open={sermonDialogOpen} onOpenChange={setSermonDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0"
                    onClick={openAddSermonDialog}
                    data-testid="button-add-sermon"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sermon
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                  <DialogHeader>
                    <DialogTitle>{editingSermon ? "Edit Sermon" : "Add New Sermon"}</DialogTitle>
                    <DialogDescription>
                      {editingSermon ? "Update sermon details" : "Create a new sermon entry"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Title</label>
                      <Input
                        value={sermonForm.title}
                        onChange={(e) => setSermonForm({ ...sermonForm, title: e.target.value })}
                        placeholder="Sermon title"
                        className="bg-background/50 border-primary/20"
                        data-testid="input-sermon-title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Preacher</label>
                      <Input
                        value={sermonForm.preacher}
                        onChange={(e) => setSermonForm({ ...sermonForm, preacher: e.target.value })}
                        placeholder="Preacher name"
                        className="bg-background/50 border-primary/20"
                        data-testid="input-sermon-preacher"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">YouTube URL</label>
                      <Input
                        value={sermonForm.youtubeUrl}
                        onChange={(e) => setSermonForm({ ...sermonForm, youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="bg-background/50 border-primary/20"
                        data-testid="input-sermon-youtube"
                      />
                    </div>
                    {sermonForm.youtubeUrl && extractYouTubeVideoId(sermonForm.youtubeUrl) && (
                      <div className="rounded-lg overflow-hidden border border-primary/20">
                        <iframe
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${extractYouTubeVideoId(sermonForm.youtubeUrl)}`}
                          title="YouTube video preview"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          data-testid="preview-youtube-video"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Date</label>
                        <Input
                          value={sermonForm.date}
                          onChange={(e) => setSermonForm({ ...sermonForm, date: e.target.value })}
                          placeholder="Nov 24, 2024"
                          className="bg-background/50 border-primary/20"
                          data-testid="input-sermon-date"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Start Time</label>
                        <Input
                          value={sermonForm.startTime}
                          onChange={(e) => setSermonForm({ ...sermonForm, startTime: e.target.value })}
                          placeholder="0:00"
                          className="bg-background/50 border-primary/20"
                          data-testid="input-sermon-start-time"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">End Time</label>
                        <Input
                          value={sermonForm.endTime}
                          onChange={(e) => setSermonForm({ ...sermonForm, endTime: e.target.value })}
                          placeholder="45:30"
                          className="bg-background/50 border-primary/20"
                          data-testid="input-sermon-end-time"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Views</label>
                      <Input
                        type="number"
                        value={sermonForm.views}
                        onChange={(e) => setSermonForm({ ...sermonForm, views: e.target.value })}
                        placeholder="0"
                        className="bg-background/50 border-primary/20"
                        data-testid="input-sermon-views"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSaveSermon}
                        className="flex-1 bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0"
                        data-testid="button-save-sermon"
                      >
                        {editingSermon ? "Update" : "Add"} Sermon
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSermonDialogOpen(false)}
                        className="border-primary/20"
                        data-testid="button-cancel-sermon"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/20 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary/10">
                      <TableHead>Title</TableHead>
                      <TableHead>Preacher</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time Range</TableHead>
                      <TableHead>YouTube</TableHead>
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
                        <TableCell className="text-sm">
                          {sermon.startTime} - {sermon.endTime}
                        </TableCell>
                        <TableCell>
                          <a
                            href={sermon.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm truncate max-w-xs"
                            data-testid={`link-youtube-${sermon.id}`}
                          >
                            Watch Video
                          </a>
                        </TableCell>
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
                              onClick={() => openEditSermonDialog(sermon)}
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
              <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0"
                    onClick={openAddAnnouncementDialog}
                    data-testid="button-add-announcement"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 backdrop-blur-sm border-primary/20 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingAnnouncement ? "Update announcement details" : "Create a new church announcement"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Title</label>
                      <Input
                        value={announcementForm.title}
                        onChange={(e) =>
                          setAnnouncementForm({ ...announcementForm, title: e.target.value })
                        }
                        placeholder="Announcement title"
                        className="bg-background/50 border-primary/20"
                        data-testid="input-announcement-title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Content</label>
                      <textarea
                        value={announcementForm.content}
                        onChange={(e) =>
                          setAnnouncementForm({ ...announcementForm, content: e.target.value })
                        }
                        placeholder="Announcement content..."
                        className="w-full p-2 rounded-md bg-background/50 border border-primary/20 text-sm"
                        rows={4}
                        data-testid="input-announcement-content"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Type</label>
                        <select
                          value={announcementForm.type}
                          onChange={(e) =>
                            setAnnouncementForm({
                              ...announcementForm,
                              type: e.target.value as "text" | "graphic",
                            })
                          }
                          className="w-full p-2 rounded-md bg-background/50 border border-primary/20 text-sm"
                          data-testid="select-announcement-type"
                        >
                          <option value="text">Text Only</option>
                          <option value="graphic">Graphic</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Status</label>
                        <select
                          value={announcementForm.status}
                          onChange={(e) =>
                            setAnnouncementForm({
                              ...announcementForm,
                              status: e.target.value as "active" | "scheduled" | "archived",
                            })
                          }
                          className="w-full p-2 rounded-md bg-background/50 border border-primary/20 text-sm"
                          data-testid="select-announcement-status"
                        >
                          <option value="active">Active</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Date</label>
                      <Input
                        value={announcementForm.date}
                        onChange={(e) =>
                          setAnnouncementForm({ ...announcementForm, date: e.target.value })
                        }
                        placeholder="Nov 20, 2024"
                        className="bg-background/50 border-primary/20"
                        data-testid="input-announcement-date"
                      />
                    </div>
                    {announcementForm.type === "graphic" && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Upload Image (1:1 ratio)</label>
                          <div className="border border-dashed border-primary/30 rounded-lg p-4 text-center bg-background/30 hover:bg-background/50 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    if (typeof event.target?.result === "string") {
                                      setAnnouncementForm({
                                        ...announcementForm,
                                        imageUrl: event.target.result,
                                      });
                                    }
                                  };
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                              }}
                              className="hidden"
                              id="image-upload"
                              data-testid="input-announcement-image"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer block">
                              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                            </label>
                          </div>
                        </div>
                        {announcementForm.imageUrl && (
                          <div className="rounded-lg overflow-hidden border border-primary/20">
                            <img
                              src={announcementForm.imageUrl}
                              alt="Announcement preview"
                              className="w-full aspect-square object-cover"
                              data-testid="preview-announcement-image"
                            />
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSaveAnnouncement}
                        className="flex-1 bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0"
                        data-testid="button-save-announcement"
                      >
                        {editingAnnouncement ? "Update" : "Create"} Announcement
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setAnnouncementDialogOpen(false)}
                        className="border-primary/20"
                        data-testid="button-cancel-announcement"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all flex flex-col"
                  data-testid={`card-announcement-admin-${announcement.id}`}
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
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">{announcement.date}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-primary/20"
                        onClick={() => openEditAnnouncementDialog(announcement)}
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

          {/* Newsletter Subscribers Tab */}
          <TabsContent value="subscribers" className="mt-0 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
                <p className="text-muted-foreground">People who joined the mailing list</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-primary/20" data-testid="button-export-subscribers">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Subscriber Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#efc64e]">{subscribers.length}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">
                        {subscribers.filter((s) => s.status === "active").length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Unsubscribed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-500">
                        {subscribers.filter((s) => s.status === "unsubscribed").length}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/20 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary/10">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id} className="border-primary/10">
                        <TableCell className="font-medium">{subscriber.name}</TableCell>
                        <TableCell>{subscriber.email}</TableCell>
                        <TableCell>{subscriber.joinedDate}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              subscriber.status === "active"
                                ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                : "bg-red-500/20 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {subscriber.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
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
