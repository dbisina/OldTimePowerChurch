import { ArrowRight, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "./AnnouncementCard";
import { Link } from "wouter";

// todo: remove mock functionality
const mockAnnouncements = [
  {
    id: "1",
    title: "Christmas Carol Service",
    content: "Join us for our annual Christmas Carol Service on December 24th at 6:00 PM. A special time of worship, fellowship, and celebrating the birth of our Savior.",
    type: "graphic" as const,
    graphicUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800&q=80",
    publishedAt: "Nov 20, 2024",
    pinned: true,
  },
  {
    id: "2",
    title: "Youth Bible Study - New Series",
    content: "Our youth ministry is starting a new series on 'Faith in Action'. Every Saturday at 4:00 PM. All young people ages 13-25 are welcome!",
    type: "non_graphic" as const,
    publishedAt: "Nov 18, 2024",
    pinned: false,
  },
];

export function AnnouncementsPreview() {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} {...announcement} />
          ))}
        </div>
      </div>
    </section>
  );
}
