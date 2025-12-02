import { useState } from "react";
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
    outline: [
      "Introduction: The Foundation of Prayer",
      "Luke 18:1-8 - The Parable of the Persistent Widow",
      "Three Keys to Effective Prayer",
      "Practical Application: Building a Prayer Life",
    ],
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
    outline: [
      "Galatians 5:16-25 - The Fruit of the Spirit",
      "Understanding Spiritual Warfare",
      "Daily Practices for Spirit-Led Living",
      "Testimony: Lives Transformed by the Spirit",
    ],
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
    outline: [
      "Romans 1:16-17 - The Gospel's Power",
      "Justification by Faith Explained",
      "The Role of Grace in Salvation",
      "Living as New Creations in Christ",
    ],
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
    outline: [
      "Matthew 17:20 - Mustard Seed Faith",
      "Biblical Examples of Mountain-Moving Faith",
      "Overcoming Doubt and Unbelief",
      "Activating Your Faith Today",
    ],
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
    outline: [
      "Ephesians 6:10-18 - The Full Armor",
      "Belt of Truth and Breastplate of Righteousness",
      "Shield of Faith and Helmet of Salvation",
      "The Sword of the Spirit: God's Word",
    ],
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
    outline: [
      "John 1:16 - Grace Upon Grace",
      "The Difference Between Law and Grace",
      "How Grace Empowers Righteous Living",
      "Extending Grace to Others",
    ],
  },
];

const mockWorshipPrayers = [
  {
    id: "1",
    title: "Morning Devotional - Entering His Courts",
    type: "Worship",
    date: "Nov 24, 2024",
    duration: "12:30",
    description: "Begin your day entering into God's presence with praise and thanksgiving.",
  },
  {
    id: "2",
    title: "Intercessory Prayer for Revival",
    type: "Prayer",
    date: "Nov 23, 2024",
    duration: "25:00",
    description: "Join us in fervent prayer for spiritual awakening in our nation and communities.",
  },
  {
    id: "3",
    title: "Hymns of the Faith - Amazing Grace Collection",
    type: "Worship",
    date: "Nov 20, 2024",
    duration: "18:45",
    description: "Traditional hymns that have strengthened the faith of believers for generations.",
  },
  {
    id: "4",
    title: "Prayer of Consecration",
    type: "Prayer",
    date: "Nov 18, 2024",
    duration: "15:20",
    description: "A guided prayer for dedicating your life fully to God's purposes.",
  },
  {
    id: "5",
    title: "Praise & Worship Night Highlights",
    type: "Worship",
    date: "Nov 15, 2024",
    duration: "32:00",
    description: "Powerful moments of worship from our monthly praise night gathering.",
  },
];

const serviceDays = ["All", "Sunday", "Tuesday", "Friday"];

export default function SermonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("sermons");

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
          </TabsContent>

          <TabsContent value="worship" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockWorshipPrayers.map((item) => (
                <Card 
                  key={item.id} 
                  className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all group cursor-pointer"
                  data-testid={`card-worship-${item.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Badge 
                          variant="outline" 
                          className={item.type === "Worship" 
                            ? "border-[#efc64e]/50 text-[#efc64e] mb-2" 
                            : "border-[#221672]/50 text-[#221672] dark:text-indigo-400 mb-2"
                          }
                        >
                          {item.type === "Worship" ? <Music className="h-3 w-3 mr-1" /> : null}
                          {item.type}
                        </Badge>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                      </div>
                      <Button 
                        size="icon" 
                        className="shrink-0 bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{item.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.duration}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scriptures" className="mt-0">
            <div className="mb-8">
              <p className="text-muted-foreground">
                A compilation of sermon outlines and scripture studies from our teaching ministry.
              </p>
            </div>
            <div className="space-y-6">
              {mockSermons.map((sermon) => (
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
                    <div className="bg-background/30 rounded-lg p-4 border border-primary/10">
                      <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                        <ScrollText className="h-4 w-4" />
                        Sermon Outline
                      </h4>
                      <ul className="space-y-2">
                        {sermon.outline.map((point, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="text-foreground/80 pt-0.5">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
