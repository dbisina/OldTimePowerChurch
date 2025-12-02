import { useState, useEffect } from "react";
import { ArrowRight, Megaphone, Calendar, Pin, Image as ImageIcon, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnnouncementCard } from "./AnnouncementCard";
import { Link } from "wouter";
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

export function AnnouncementsPreview() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/announcements?limit=2")
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement({
      ...announcement,
      publishedAt: new Date(announcement.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
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

  // Don't show section if no announcements
  if (!loading && announcements.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#efc64e]/20">
              <Megaphone className="h-6 w-6 text-[#b5621b]" />
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-1">
                Announcements
              </h2>
              <p className="text-muted-foreground">
                Stay updated with what's happening in our community.
              </p>
            </div>
          </div>
          <Link href="/announcements">
            <Button variant="ghost" className="text-primary" data-testid="button-view-all-announcements">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {announcements.map((announcement) => (
              <AnnouncementCard 
                key={announcement.id} 
                id={announcement.id}
                title={announcement.title}
                content={announcement.contentHtml || ""}
                type={announcement.type}
                graphicUrl={announcement.graphicUrl}
                publishedAt={new Date(announcement.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                pinned={announcement.pinned}
                onClick={() => handleAnnouncementClick(announcement)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Announcement Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          {selectedAnnouncement && (
            <>
              {/* Graphic Image - Full uncropped view */}
              {selectedAnnouncement.type === "graphic" && selectedAnnouncement.graphicUrl && (
                <div className="w-full bg-black/50 flex items-center justify-center relative">
                  <img
                    src={selectedAnnouncement.graphicUrl}
                    alt={selectedAnnouncement.title}
                    className="max-h-[60vh] w-auto mx-auto object-contain"
                    onClick={() => window.open(selectedAnnouncement.graphicUrl!, '_blank')}
                    style={{ cursor: 'pointer' }}
                    title="Click to view full size"
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
                  <p className="absolute bottom-2 right-2 text-xs text-white/60">Click image to view full size</p>
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
    </section>
  );
}
