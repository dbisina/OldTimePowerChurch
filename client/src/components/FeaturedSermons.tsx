import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SermonCard } from "./SermonCard";
import { Link } from "wouter";

// todo: remove mock functionality
const mockSermons = [
  {
    id: "1",
    title: "The Power of Persistent Prayer",
    preacher: "Pastor John",
    serviceDay: "Sunday",
    date: "Nov 24, 2024",
    excerpt: "Discover how persistent prayer can transform your spiritual life and bring breakthrough in every area.",
    duration: "45:30",
    featured: true,
  },
  {
    id: "2",
    title: "Walking in the Spirit",
    preacher: "Pastor John",
    serviceDay: "Friday",
    date: "Nov 22, 2024",
    excerpt: "Learn what it means to walk in the Spirit daily and experience the fullness of God's power in your life.",
    duration: "38:15",
    featured: false,
  },
  {
    id: "3",
    title: "Understanding the Book of Romans",
    preacher: "Elder James",
    serviceDay: "Tuesday",
    date: "Nov 19, 2024",
    excerpt: "A deep dive into the theological foundations laid out in Paul's letter to the Romans.",
    duration: "52:00",
    featured: false,
  },
];

export function FeaturedSermons() {
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
          {mockSermons.map((sermon) => (
            <SermonCard key={sermon.id} {...sermon} />
          ))}
        </div>
      </div>
    </section>
  );
}
