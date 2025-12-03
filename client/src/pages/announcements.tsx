import { useState, useEffect } from "react";
import { Image as ImageIcon, FileText, Pin, Calendar, X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  contentHtml?: string;
  type: "graphic" | "non_graphic";
  graphicUrl?: string;
  publishedAt: string;
  pinned: boolean;
}

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState<"all" | "pinned" | "graphic" | "text">("all");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.map((a: any) => ({
          ...a,
          content: a.contentHtml,
          publishedAt: new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        })));
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (filter === "pinned") return announcement.pinned;
    if (filter === "graphic") return announcement.type === "graphic";
    if (filter === "text") return announcement.type === "non_graphic";
    return true;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.pinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.pinned);

  // Count announcements by type
  const graphicCount = announcements.filter(a => a.type === "graphic").length;
  const textCount = announcements.filter(a => a.type === "non_graphic").length;
  const pinnedCount = announcements.filter(a => a.pinned).length;

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDialogOpen(true);
  };

  const handleShare = async () => {
    if (!selectedAnnouncement) return;
    const shareUrl = `${window.location.origin}/announcements#${selectedAnnouncement.id}`;
    
    if (navigator.share) {
      await navigator.share({
        title: selectedAnnouncement.title,
        text: selectedAnnouncement.contentHtml || "",
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Announcement link copied to clipboard",
      });
    }
  };

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">Announcements</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Stay updated with the latest news, events, and happenings at Old Time Power Church.
          </p>
        </div>

        {/* Filter buttons with counts */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            data-testid="button-filter-all"
          >
            All ({announcements.length})
          </Button>
          <Button
            variant={filter === "pinned" ? "default" : "outline"}
            onClick={() => setFilter("pinned")}
            data-testid="button-filter-pinned"
          >
            <Pin className="h-4 w-4 mr-2" />
            Pinned ({pinnedCount})
          </Button>
          <Button
            variant={filter === "graphic" ? "default" : "outline"}
            onClick={() => setFilter("graphic")}
            data-testid="button-filter-graphic"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            With Graphics ({graphicCount})
          </Button>
          <Button
            variant={filter === "text" ? "default" : "outline"}
            onClick={() => setFilter("text")}
            data-testid="button-filter-text"
          >
            <FileText className="h-4 w-4 mr-2" />
            Text Only ({textCount})
          </Button>
        </div>

        {pinnedAnnouncements.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Pin className="h-5 w-5 text-[#efc64e]" />
              <h2 className="font-serif text-xl font-semibold">Pinned</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pinnedAnnouncements.map((announcement) => (
                <AnnouncementCard 
                  key={announcement.id} 
                  {...announcement} 
                  content={announcement.contentHtml || ""}
                  onClick={() => handleAnnouncementClick(announcement)}
                />
              ))}
            </div>
          </div>
        )}

        {regularAnnouncements.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-serif text-xl font-semibold">Recent</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {regularAnnouncements.map((announcement) => (
                <AnnouncementCard 
                  key={announcement.id} 
                  {...announcement} 
                  content={announcement.contentHtml || ""}
                  onClick={() => handleAnnouncementClick(announcement)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No announcements found.</p>
          </div>
        )}
      </div>

      {/* Announcement Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          {selectedAnnouncement && (
            <>
              {/* Graphic Image - Full size, not cropped */}
              {selectedAnnouncement.type === "graphic" && selectedAnnouncement.graphicUrl && (
                <div className="w-full overflow-hidden relative bg-black/10">
                  <img
                    src={selectedAnnouncement.graphicUrl}
                    alt={selectedAnnouncement.title}
                    className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                  />
                  {/* Badges overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    {selectedAnnouncement.pinned && (
                      <Badge className="bg-[#efc64e] text-[#0b0a13] border-0 shadow-lg">
                        <Pin className="h-3 w-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-black/60 text-white border-0 backdrop-blur-sm">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      Graphic
                    </Badge>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                <DialogHeader className="mb-4">
                  {/* Non-graphic badges */}
                  {selectedAnnouncement.type === "non_graphic" && (
                    <div className="flex items-center gap-2 mb-3">
                      {selectedAnnouncement.pinned && (
                        <Badge className="bg-[#efc64e]/20 text-[#b5621b] border-0">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
                        <FileText className="h-3 w-3 mr-1" />
                        Text Announcement
                      </Badge>
                    </div>
                  )}
                  <DialogTitle className="font-serif text-2xl md:text-3xl leading-tight">
                    {selectedAnnouncement.title}
                  </DialogTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>{selectedAnnouncement.publishedAt}</span>
                  </div>
                </DialogHeader>

                {/* Announcement Content */}
                {selectedAnnouncement.contentHtml && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {selectedAnnouncement.contentHtml}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="border-t p-4 flex items-center justify-between bg-muted/30">
                <p className="text-xs text-muted-foreground">Old Time Power Church</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
