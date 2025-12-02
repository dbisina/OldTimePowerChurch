import { useState } from "react";
import { Filter, Pin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnnouncementCard } from "@/components/AnnouncementCard";

// todo: remove mock functionality
const mockAnnouncements = [
  {
    id: "1",
    title: "Christmas Carol Service",
    content: "Join us for our annual Christmas Carol Service on December 24th at 6:00 PM. A special time of worship, fellowship, and celebrating the birth of our Savior. There will be special music presentations, children's choir, and a candlelight service to conclude the evening.",
    type: "graphic" as const,
    graphicUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800&q=80",
    publishedAt: "Nov 20, 2024",
    pinned: true,
  },
  {
    id: "2",
    title: "Youth Bible Study - New Series",
    content: "Our youth ministry is starting a new series on 'Faith in Action'. Every Saturday at 4:00 PM. All young people ages 13-25 are welcome! Snacks and refreshments will be provided.",
    type: "non_graphic" as const,
    publishedAt: "Nov 18, 2024",
    pinned: false,
  },
  {
    id: "3",
    title: "Church Building Fund Update",
    content: "We are excited to announce that we have reached 75% of our building fund goal! Thank you for your generous contributions. The new fellowship hall construction is scheduled to begin in January 2025.",
    type: "non_graphic" as const,
    publishedAt: "Nov 15, 2024",
    pinned: false,
  },
  {
    id: "4",
    title: "Annual Church Retreat",
    content: "Mark your calendars for our annual church retreat happening February 14-16, 2025. This year's theme is 'Deeper Roots, Higher Branches'. Registration opens December 1st.",
    type: "graphic" as const,
    graphicUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    publishedAt: "Nov 12, 2024",
    pinned: false,
  },
  {
    id: "5",
    title: "Prayer Chain Update",
    content: "Our prayer chain ministry has seen tremendous growth! If you would like to join or have prayer requests, please contact Sister Mary at the church office. Together, we lift each other up in prayer.",
    type: "non_graphic" as const,
    publishedAt: "Nov 10, 2024",
    pinned: false,
  },
];

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState<"all" | "pinned" | "graphic">("all");

  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    if (filter === "pinned") return announcement.pinned;
    if (filter === "graphic") return announcement.type === "graphic";
    return true;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.pinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.pinned);

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Announcements</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Stay updated with the latest news, events, and happenings at Old Time Power Church.
          </p>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            data-testid="button-filter-all"
          >
            All
          </Button>
          <Button
            variant={filter === "pinned" ? "default" : "outline"}
            onClick={() => setFilter("pinned")}
            data-testid="button-filter-pinned"
          >
            <Pin className="h-4 w-4 mr-2" />
            Pinned
          </Button>
          <Button
            variant={filter === "graphic" ? "default" : "outline"}
            onClick={() => setFilter("graphic")}
            data-testid="button-filter-graphic"
          >
            <Filter className="h-4 w-4 mr-2" />
            With Images
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
                <AnnouncementCard key={announcement.id} {...announcement} />
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
                <AnnouncementCard key={announcement.id} {...announcement} />
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
    </main>
  );
}
