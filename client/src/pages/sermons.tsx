import { useState, useEffect } from "react";
import { Search, Filter, X, BookOpen, Music, ScrollText, Play, Clock, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SermonCard } from "@/components/SermonCard";

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
  outline?: string[];
}

const serviceDays = ["All", "Sunday", "Tuesday", "Friday"];
const serviceDayMap: Record<string, string> = {
  sun: "Sunday",
  tue: "Tuesday", 
  fri: "Friday",
};

export default function SermonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("sermons");
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const res = await fetch("/api/sermons");
      if (res.ok) {
        const data = await res.json();
        setSermons(data.map((s: any) => ({
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

  const filteredSermons = sermons.filter((sermon) => {
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sermon.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
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
    <main className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent">
            Spiritual Resources
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore sermons, worship content, and scripture studies from our services.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto bg-background/50 backdrop-blur-sm border border-primary/20 p-1 mb-8">
            <TabsTrigger
              value="sermons"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-sermons"
            >
              <BookOpen className="h-4 w-4" />
              <span>Sermons</span>
            </TabsTrigger>
            <TabsTrigger
              value="worship"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-worship"
            >
              <Music className="h-4 w-4" />
              <span>Worship & Prayers</span>
            </TabsTrigger>
            <TabsTrigger
              value="scriptures"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#b5621b] data-[state=active]:to-[#efc64e] data-[state=active]:text-white"
              data-testid="tab-scriptures"
            >
              <ScrollText className="h-4 w-4" />
              <span>Scriptures</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sermons" className="mt-0">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sermons by title, preacher, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20"
                  data-testid="input-sermon-search"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="w-[160px] bg-background/50 backdrop-blur-sm border-primary/20" data-testid="select-sermon-day">
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
                  className={showFeaturedOnly ? "bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0" : "border-primary/20"}
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
                    <button onClick={() => setSearchQuery("")} title="Clear search">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedDay !== "All" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedDay}
                    <button onClick={() => setSelectedDay("All")} title="Clear day filter">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {showFeaturedOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Featured only
                    <button onClick={() => setShowFeaturedOnly(false)} title="Clear featured filter">
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
                  <SermonCard key={sermon.id} {...sermon} slug={sermon.slug} excerpt={sermon.excerpt ?? ""} duration={sermon.duration ?? ""} />
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
          </TabsContent>

          <TabsContent value="worship" className="mt-0">
            <div className="text-center py-16">
              <Music className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg mb-2">Worship & Prayer content coming soon</p>
              <p className="text-muted-foreground text-sm">Check back later for worship recordings and prayer sessions.</p>
            </div>
          </TabsContent>

          <TabsContent value="scriptures" className="mt-0">
            <div className="mb-8">
              <p className="text-muted-foreground">
                A compilation of sermon outlines and scripture studies from our teaching ministry.
              </p>
            </div>
            {sermons.length > 0 ? (
              <div className="space-y-6">
                {sermons.map((sermon) => (
                  <Card 
                    key={sermon.id}
                    className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all"
                    data-testid={`card-scripture-${sermon.id}`}
                  >
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <Badge variant="outline" className="border-primary/50 text-primary mb-2">
                            {sermon.serviceDay} Service
                          </Badge>
                          <CardTitle className="text-xl bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent">
                            {sermon.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {sermon.preacher}
                          <span className="mx-2">|</span>
                          <Calendar className="h-4 w-4" />
                          {sermon.date}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {sermon.excerpt && (
                        <p className="text-muted-foreground">{sermon.excerpt}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ScrollText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-lg">No scripture studies available yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
