import { Play, User, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface SermonCardProps {
  id: string;
  slug?: string;
  title: string;
  preacher: string;
  serviceDay: string;
  date: string;
  excerpt: string;
  duration: string;
  thumbnail?: string;
  featured?: boolean;
}

export function SermonCard({
  id,
  slug,
  title,
  preacher,
  serviceDay,
  date,
  excerpt,
  duration,
  thumbnail,
  featured,
}: SermonCardProps) {
  // Use slug if available, fallback to id
  const sermonPath = slug || id;
  
  return (
    <Link href={`/sermons/${sermonPath}`}>
      <Card
        className={`overflow-hidden group cursor-pointer transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl ${
          featured ? "ring-2 ring-[#efc64e]/50 shadow-lg shadow-[#efc64e]/20" : ""
        }`}
        data-testid={`card-sermon-${id}`}
      >
        <div className="relative aspect-video bg-muted overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#221672] to-[#583922] flex items-center justify-center">
              <Play className="h-12 w-12 text-white/50" />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
          {featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0">
              Featured
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-[#b5621b] ml-1" />
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2 text-xs">
            {serviceDay}
          </Badge>
          <h3 className="font-serif font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{excerpt}</p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{preacher}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{date}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
