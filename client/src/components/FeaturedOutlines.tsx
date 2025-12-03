import { useState, useEffect } from "react";
import { ScrollText, ArrowRight, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { OutlineViewer } from "./OutlineViewer";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  serviceDay: string;
  date: string;
  excerpt?: string;
  outline?: string;
  featured: boolean;
}

const serviceDayMap: Record<string, string> = {
  sun: "Sunday",
  tue: "Tuesday", 
  fri: "Friday",
};

export function FeaturedOutlines() {
  const [outlines, setOutlines] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOutline, setSelectedOutline] = useState<Sermon | null>(null);

  useEffect(() => {
    fetchOutlines();
  }, []);

  const fetchOutlines = async () => {
    try {
      // Fetch all sermons and filter for those with outlines and are featured
      // Ideally backend should support filtering by "hasOutline"
      const res = await fetch("/api/sermons?featured=true");
      if (res.ok) {
        const data = await res.json();
        const outlinesData = data
          .filter((s: any) => s.outline) // Only those with outlines
          .slice(0, 3)
          .map((s: any) => ({
            ...s,
            serviceDay: serviceDayMap[s.serviceDay] || s.serviceDay,
            date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          }));
        setOutlines(outlinesData);
      }
    } catch (error) {
      console.error("Failed to fetch outlines:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || outlines.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              Featured Study Materials
            </h2>
            <p className="text-muted-foreground">
              Deep dive into scripture with our latest teaching outlines.
            </p>
          </div>
          <Link href="/sermons?tab=scriptures">
            <Button variant="ghost" className="text-primary">
              View All Studies
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {outlines.map((outline) => (
            <Card 
              key={outline.id}
              className="cursor-pointer hover:shadow-lg transition-all border-primary/20 hover:border-primary/50 group"
              onClick={() => setSelectedOutline(outline)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">
                    {outline.serviceDay}
                  </Badge>
                  <ScrollText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="font-serif text-xl line-clamp-2 group-hover:text-[#b5621b] transition-colors">
                  {outline.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {outline.excerpt || "Click to read the full study outline..."}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{outline.preacher}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{outline.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedOutline && (
        <OutlineViewer
          isOpen={!!selectedOutline}
          onClose={() => setSelectedOutline(null)}
          title={selectedOutline.title}
          preacher={selectedOutline.preacher}
          date={selectedOutline.date}
          serviceDay={selectedOutline.serviceDay}
          content={selectedOutline.outline || ""}
        />
      )}
    </section>
  );
}
