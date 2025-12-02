import { Pin, Calendar, ArrowRight, Image as ImageIcon, FileText } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface AnnouncementCardProps {
  id: string;
  title: string;
  content: string;
  type: "graphic" | "non_graphic";
  graphicUrl?: string;
  publishedAt: string;
  pinned?: boolean;
  onClick?: () => void;
}

export function AnnouncementCard({
  id,
  title,
  content,
  type,
  graphicUrl,
  publishedAt,
  pinned,
  onClick,
}: AnnouncementCardProps) {
  // Graphic announcement with image
  if (type === "graphic" && graphicUrl) {
    return (
      <SpotlightCard
        glowColor={pinned ? "golden" : "indigo"}
        customSize
        className="w-full h-full overflow-hidden flex flex-col group cursor-pointer"
        data-testid={`card-announcement-${id}`}
        onClick={onClick}
      >
        {/* Large graphic image */}
        <div className="aspect-[16/9] overflow-hidden rounded-xl -m-6 mb-4 relative">
          <img
            src={graphicUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {pinned && (
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
        <CardContent className="p-0 flex-1 flex flex-col pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3" />
            <span>{publishedAt}</span>
          </div>
          <h3 className="font-serif font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          {content && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{content}</p>
          )}
          <Button variant="ghost" size="sm" className="text-primary -ml-2 w-fit group-hover:translate-x-1 transition-transform" data-testid={`button-read-more-${id}`}>
            View Announcement <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </SpotlightCard>
    );
  }

  // Text-only announcement (non_graphic)
  return (
    <SpotlightCard
      glowColor={pinned ? "golden" : "indigo"}
      customSize
      className="w-full h-full overflow-hidden flex flex-col group cursor-pointer"
      data-testid={`card-announcement-${id}`}
      onClick={onClick}
    >
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Header with badges */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {pinned && (
              <Badge className="bg-[#efc64e]/20 text-[#b5621b] border-0">
                <Pin className="h-3 w-3 mr-1" />
                Pinned
              </Badge>
            )}
            <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
              <FileText className="h-3 w-3 mr-1" />
              Text
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
            <Calendar className="h-3 w-3" />
            <span>{publishedAt}</span>
          </div>
        </div>
        
        {/* Decorative element for text announcements */}
        <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/30 rounded-full mb-4" />
        
        <h3 className="font-serif font-semibold text-xl mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-4 flex-1 leading-relaxed">{content}</p>
        <Button variant="ghost" size="sm" className="text-primary -ml-2 w-fit group-hover:translate-x-1 transition-transform" data-testid={`button-read-more-${id}`}>
          Read More <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </SpotlightCard>
  );
}
