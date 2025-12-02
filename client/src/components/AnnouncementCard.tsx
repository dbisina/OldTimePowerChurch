import { Pin, Calendar, ArrowRight } from "lucide-react";
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
}

export function AnnouncementCard({
  id,
  title,
  content,
  type,
  graphicUrl,
  publishedAt,
  pinned,
}: AnnouncementCardProps) {
  return (
    <SpotlightCard
      glowColor={pinned ? "golden" : "indigo"}
      customSize
      className="w-full h-full overflow-hidden flex flex-col"
      data-testid={`card-announcement-${id}`}
    >
      {type === "graphic" && graphicUrl && (
        <div className="aspect-[2/1] overflow-hidden rounded-lg mb-4 -m-6 mb-4">
          <img
            src={graphicUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {pinned && (
              <Badge className="bg-[#efc64e]/20 text-[#b5621b] border-0">
                <Pin className="h-3 w-3 mr-1" />
                Pinned
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{publishedAt}</span>
          </div>
        </div>
        <h3 className="font-serif font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{content}</p>
        <Button variant="ghost" size="sm" className="text-primary -ml-2 w-fit" data-testid={`button-read-more-${id}`}>
          Read More <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </SpotlightCard>
  );
}
