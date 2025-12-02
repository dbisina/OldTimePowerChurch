import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SermonCard } from "./SermonCard";
import { Link } from "wouter";

interface Sermon {
  id: string;
  slug?: string;
  title: string;
  preacher: string;
  serviceDay: string;
  date: string;
  excerpt?: string;
  duration?: string;
  featured: boolean;
}

const serviceDayMap: Record<string, string> = {
  sun: "Sunday",
  tue: "Tuesday", 
  fri: "Friday",
};

export function FeaturedSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const res = await fetch("/api/sermons?limit=3");
      if (res.ok) {
        const data = await res.json();
        setSermons(data.slice(0, 3).map((s: any) => ({
          ...s,
          serviceDay: serviceDayMap[s.serviceDay] || s.serviceDay,
          date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        })));
      }
    } catch (error) {
      console.error("Failed to fetch sermons:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading sermons...</p>
          </div>
        </div>
      </section>
    );
  }

  if (sermons.length === 0) {
    return null; // Don't show section if no sermons
  }

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              Recent Sermons
            </h2>
            <p className="text-muted-foreground">
              Watch our latest messages and be encouraged in your faith.
            </p>
          </div>
          <Link href="/sermons">
            <Button variant="ghost" className="text-primary" data-testid="button-view-all-sermons">
              View All Sermons
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <SermonCard key={sermon.id} {...sermon} slug={sermon.slug} excerpt={sermon.excerpt ?? ""} duration={sermon.duration ?? ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
