import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SermonCard } from "@/components/SermonCard";

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
  {
    id: "4",
    title: "Faith That Moves Mountains",
    preacher: "Pastor John",
    serviceDay: "Sunday",
    date: "Nov 17, 2024",
    excerpt: "Jesus taught that with faith as small as a mustard seed, nothing would be impossible.",
    duration: "41:20",
    featured: false,
  },
  {
    id: "5",
    title: "The Armor of God",
    preacher: "Elder James",
    serviceDay: "Friday",
    date: "Nov 15, 2024",
    excerpt: "Exploring each piece of the spiritual armor that God has given us for our daily battles.",
    duration: "48:45",
    featured: false,
  },
  {
    id: "6",
    title: "Grace Upon Grace",
    preacher: "Pastor John",
    serviceDay: "Sunday",
    date: "Nov 10, 2024",
    excerpt: "Understanding the depths of God's grace and how it transforms our lives completely.",
    duration: "44:00",
    featured: true,
  },
];

const serviceDays = ["All", "Sunday", "Tuesday", "Friday"];

export default function SermonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const filteredSermons = mockSermons.filter((sermon) => {
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = selectedDay === "All" || sermon.serviceDay === selectedDay;
    const matchesFeatured = !showFeaturedOnly || sermon.featured;
    return matchesSearch && matchesDay && matchesFeatured;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDay("All");
    setShowFeaturedOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedDay !== "All" || showFeaturedOnly;

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Sermons</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our collection of sermons from our Sunday, Tuesday, and Friday services.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sermons by title, preacher, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-sermon-search"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-[160px]" data-testid="select-sermon-day">
                <SelectValue placeholder="Service day" />
              </SelectTrigger>
              <SelectContent>
                {serviceDays.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day === "All" ? "All Services" : day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              data-testid="button-featured-filter"
            >
              <Filter className="h-4 w-4 mr-2" />
              Featured
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedDay !== "All" && (
              <Badge variant="secondary" className="gap-1">
                {selectedDay}
                <button onClick={() => setSelectedDay("All")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {showFeaturedOnly && (
              <Badge variant="secondary" className="gap-1">
                Featured only
                <button onClick={() => setShowFeaturedOnly(false)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
              Clear all
            </Button>
          </div>
        )}

        {filteredSermons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map((sermon) => (
              <SermonCard key={sermon.id} {...sermon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No sermons found matching your criteria.</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
