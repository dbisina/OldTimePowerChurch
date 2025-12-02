import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Download,
  Share2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Play,
  Eye,
  Tag,
  Video,
  ExternalLink,
  Book,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Sermon {
  id: string;
  slug?: string;
  title: string;
  preacher: string;
  serviceDay: string;
  date: string;
  videoUrl?: string;
  startSec?: number;
  endSec?: number;
  excerpt?: string;
  outline?: string;
  scriptures?: string[];
  tags?: string[];
  featured: boolean;
}

const serviceDayMap: Record<string, string> = {
  sun: "Sunday",
  tue: "Tuesday", 
  fri: "Friday",
};

const serviceDayFullNames: Record<string, string> = {
  sun: "Saviour's Exaltation Service",
  tue: "Scripture Expository Service",
  fri: "Spirit Empowerment Service",
};

export default function SermonDetailPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [outlineOpen, setOutlineOpen] = useState(true);
  const [scripturesOpen, setScripturesOpen] = useState(true);
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [rawSermon, setRawSermon] = useState<any>(null);
  const [relatedSermons, setRelatedSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [scriptureDialogOpen, setScriptureDialogOpen] = useState(false);
  const [selectedScripture, setSelectedScripture] = useState("");
  const [scriptureContent, setScriptureContent] = useState("");
  const [scriptureLoading, setScriptureLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchSermon();
      fetchRelatedSermons();
    }
  }, [slug]);

  const fetchSermon = async () => {
    try {
      const res = await fetch(`/api/sermons/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setRawSermon(data);
        setSermon({
          ...data,
          serviceDay: data.serviceDay,
          date: new Date(data.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        });
      }
    } catch (error) {
      console.error("Failed to fetch sermon:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch scripture text from Bible API
  const fetchScriptureText = async (reference: string) => {
    setScriptureLoading(true);
    setSelectedScripture(reference);
    setScriptureDialogOpen(true);
    
    try {
      // Use Bible API to fetch scripture - using ESV API or Bible.org
      const encodedRef = encodeURIComponent(reference);
      const response = await fetch(`https://bible-api.com/${encodedRef}`);
      
      if (response.ok) {
        const data = await response.json();
        setScriptureContent(data.text || "Scripture text not available.");
      } else {
        setScriptureContent("Unable to load scripture. Please try searching online.");
      }
    } catch (error) {
      console.error("Failed to fetch scripture:", error);
      setScriptureContent("Unable to load scripture. Please try searching online.");
    } finally {
      setScriptureLoading(false);
    }
  };

  const fetchRelatedSermons = async () => {
    try {
      const res = await fetch("/api/sermons?limit=2");
      if (res.ok) {
        const data = await res.json();
        setRelatedSermons(data.filter((s: any) => s.slug !== slug && s.id !== slug).slice(0, 2).map((s: any) => ({
          ...s,
          serviceDay: serviceDayMap[s.serviceDay] || s.serviceDay,
          date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        })));
      }
    } catch (error) {
      console.error("Failed to fetch related sermons:", error);
    }
  };

  const handleShare = async () => {
    if (!sermon) return;
    if (navigator.share) {
      await navigator.share({
        title: sermon.title,
        text: sermon.excerpt || "",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Sermon link copied to clipboard",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Downloading...",
      description: "Sermon outline is being prepared for download",
    });
  };

  // Format seconds to readable duration
  const formatDuration = (startSec?: number, endSec?: number) => {
    if (!endSec && !startSec) return null;
    const totalSec = endSec ? endSec - (startSec || 0) : 0;
    if (totalSec <= 0) return null;
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (url?: string) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return null;
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back button skeleton */}
          <div className="mb-6">
            <Skeleton className="h-10 w-40" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!sermon) {
    return (
      <main className="min-h-screen pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 text-center py-20">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sermon not found</h1>
          <p className="text-muted-foreground mb-6">The sermon you're looking for doesn't exist or has been removed.</p>
          <Link href="/sermons">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse All Sermons
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // Build YouTube embed URL with time range
  const getYouTubeEmbedUrl = () => {
    if (!sermon.videoUrl) return null;
    let videoId = "";
    
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = sermon.videoUrl.match(pattern);
      if (match) {
        videoId = match[1];
        break;
      }
    }
    
    if (!videoId) return null;
    
    let url = `https://www.youtube.com/embed/${videoId}`;
    const params = new URLSearchParams();
    if (sermon.startSec) params.set("start", sermon.startSec.toString());
    if (sermon.endSec) params.set("end", sermon.endSec.toString());
    params.set("rel", "0");
    return `${url}?${params.toString()}`;
  };

  const embedUrl = getYouTubeEmbedUrl();
  const duration = formatDuration(sermon.startSec, sermon.endSec);
  const serviceDayKey = rawSermon?.serviceDay || "sun";

  return (
    <main className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Improved Back Button */}
        <div className="mb-8">
          <Link href="/sermons">
            <Button 
              variant="outline" 
              className="group border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
              data-testid="button-back-to-sermons"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Sermons
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {embedUrl ? (
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <iframe
                  src={embedUrl}
                  title={sermon.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No video available</p>
                </div>
              </div>
            )}

            {/* Sermon Info Card */}
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Featured Badge & Title */}
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div className="flex-1">
                    {sermon.featured && (
                      <Badge className="mb-3 bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0 shadow-md">
                        ⭐ Featured Sermon
                      </Badge>
                    )}
                    <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                      {sermon.title}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleShare} 
                      className="hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                      data-testid="button-share"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {sermon.outline && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleDownload}
                        className="hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                        data-testid="button-download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Preacher</p>
                      <p className="font-medium text-sm">{sermon.preacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium text-sm">{sermon.date}</p>
                    </div>
                  </div>
                  {duration && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-medium text-sm">{duration}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-secondary/30">
                      <BookOpen className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Service</p>
                      <p className="font-medium text-sm">{serviceDayMap[serviceDayKey]}</p>
                    </div>
                  </div>
                </div>

                {/* Service Type Banner */}
                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                  <p className="text-sm text-center font-medium text-primary">
                    {serviceDayFullNames[serviceDayKey]}
                  </p>
                </div>

                {/* Excerpt */}
                {sermon.excerpt && (
                  <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                    {sermon.excerpt}
                  </p>
                )}

                {/* Tags */}
                {sermon.tags && sermon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {sermon.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sermon Outline */}
            {/* Sermon Outline */}
            {sermon.outline && (
            <Card className="border-0 shadow-lg overflow-hidden">
              <Collapsible open={outlineOpen} onOpenChange={setOutlineOpen}>
                <CollapsibleTrigger asChild>
                  <button 
                    className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                    data-testid="button-toggle-outline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-serif text-xl font-semibold">Sermon Outline</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${outlineOpen ? 'rotate-180' : ''}`} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Separator />
                  <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                      {sermon.outline.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) {
                          return <h2 key={i} className="font-serif text-2xl font-bold mt-6 mb-3 text-primary">{line.replace('## ', '')}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={i} className="font-serif text-xl font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('- ')) {
                          return <p key={i} className="ml-4 mb-1 flex items-start gap-2"><span className="text-primary">•</span>{line.replace('- ', '')}</p>;
                        }
                        if (line.match(/^\d+\./)) {
                          return <p key={i} className="ml-4 mb-1">{line}</p>;
                        }
                        return line.trim() ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
                      })}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            )}

            {/* Scripture References */}
            {sermon.scriptures && sermon.scriptures.length > 0 && (
            <Card className="border-0 shadow-lg overflow-hidden">
              <Collapsible open={scripturesOpen} onOpenChange={setScripturesOpen}>
                <CollapsibleTrigger asChild>
                  <button 
                    className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                    data-testid="button-toggle-scriptures"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-secondary/30">
                        <Book className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xl font-semibold">Scripture References</span>
                        <Badge variant="secondary" className="text-xs">{sermon.scriptures.length}</Badge>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${scripturesOpen ? 'rotate-180' : ''}`} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Separator />
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-4">Tap on any scripture to read the passage</p>
                    <div className="flex flex-wrap gap-3">
                      {sermon.scriptures.map((scripture) => (
                        <Button
                          key={scripture}
                          variant="outline"
                          className="h-auto py-3 px-4 font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group"
                          onClick={() => fetchScriptureText(scripture)}
                        >
                          <Book className="h-4 w-4 mr-2 opacity-60 group-hover:opacity-100" />
                          {scripture}
                          <ExternalLink className="h-3 w-3 ml-2 opacity-40 group-hover:opacity-100" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Sermons Card */}
            <Card className="border-0 shadow-lg sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" />
                  Related Sermons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedSermons.length > 0 ? (
                  relatedSermons.map((relSermon) => (
                    <Link key={relSermon.id} href={`/sermons/${relSermon.slug || relSermon.id}`}>
                      <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-primary/20">
                        <div className="w-20 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <Play className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{relSermon.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {relSermon.date}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No related sermons found</p>
                )}
                
                <Separator className="my-3" />
                
                <Link href="/sermons">
                  <Button variant="outline" className="w-full group">
                    View All Sermons
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Sermon
                </Button>
                {sermon.outline && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Outline
                  </Button>
                )}
                {sermon.videoUrl && (
                  <a 
                    href={sermon.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Watch on YouTube
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Scripture Reading Dialog */}
      <Dialog open={scriptureDialogOpen} onOpenChange={setScriptureDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="font-serif text-2xl flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Book className="h-5 w-5 text-primary" />
              </div>
              {selectedScripture}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4">
            {scriptureLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-wrap font-serif">
                  {scriptureContent}
                </p>
              </div>
            )}
          </div>
          <div className="border-t pt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Source: Bible API (World English Bible)</p>
            <div className="flex gap-2">
              <a 
                href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(selectedScripture)}&version=NIV`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Read on BibleGateway
                </Button>
              </a>
              <Button size="sm" onClick={() => setScriptureDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
