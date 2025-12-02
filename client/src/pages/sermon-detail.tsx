import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { SermonCard } from "@/components/SermonCard";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockSermon = {
  id: "1",
  title: "The Power of Persistent Prayer",
  preacher: "Pastor John",
  serviceDay: "Sunday",
  date: "November 24, 2024",
  duration: "45:30",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  startSec: 0,
  endSec: 2730,
  excerpt: "Discover how persistent prayer can transform your spiritual life and bring breakthrough in every area.",
  scriptures: ["Luke 18:1-8", "Matthew 7:7-11", "James 5:16"],
  tags: ["Prayer", "Faith", "Persistence", "Breakthrough"],
  featured: true,
  outline: `
## Introduction
- The importance of prayer in the believer's life
- Understanding the parable of the persistent widow

## Main Points

### 1. God Wants Us to Pray Persistently
- Luke 18:1 - "Men ought always to pray, and not to faint"
- Prayer is not about changing God's mind, but aligning our hearts with His will

### 2. Persistence Demonstrates Faith
- The widow's persistence showed her confidence in the judge
- Our persistence in prayer shows our trust in God's faithfulness

### 3. The Promise of Answer
- Matthew 7:7-11 - Ask, seek, knock
- God is more willing to give than we are to receive

## Application
1. Set aside dedicated time for prayer daily
2. Keep a prayer journal to track answered prayers
3. Join a prayer group for accountability

## Conclusion
- Prayer is not just talking to God; it's developing a relationship
- Persistent prayer transforms us even as we wait for answers
  `,
};

const relatedSermons = [
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
    id: "6",
    title: "Grace Upon Grace",
    preacher: "Pastor John",
    serviceDay: "Sunday",
    date: "Nov 10, 2024",
    excerpt: "Understanding the depths of God's grace and how it transforms our lives completely.",
    duration: "44:00",
    featured: false,
  },
];

export default function SermonDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [outlineOpen, setOutlineOpen] = useState(true);
  const [scripturesOpen, setScripturesOpen] = useState(false);

  // todo: replace with actual data fetching
  const sermon = mockSermon;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: sermon.title,
        text: sermon.excerpt,
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
    // todo: implement actual download
    toast({
      title: "Downloading...",
      description: "Sermon outline is being prepared for download",
    });
  };

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/sermons">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-sermons">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sermons
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                src={`${sermon.videoUrl}?start=${sermon.startSec}&end=${sermon.endSec}&autoplay=0`}
                title={sermon.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  {sermon.featured && (
                    <Badge className="mb-2 bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0">
                      Featured Sermon
                    </Badge>
                  )}
                  <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
                    {sermon.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{sermon.preacher}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{sermon.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{sermon.duration}</span>
                    </div>
                    <Badge variant="secondary">{sermon.serviceDay}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare} data-testid="button-share">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleDownload} data-testid="button-download">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mt-4 text-lg">{sermon.excerpt}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {sermon.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <Collapsible open={outlineOpen} onOpenChange={setOutlineOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto" data-testid="button-toggle-outline">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-serif text-xl font-semibold">Sermon Outline</span>
                  </div>
                  {outlineOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-2">
                  <CardContent className="p-6 prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                      {sermon.outline.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) {
                          return <h2 key={i} className="font-serif text-2xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={i} className="font-serif text-xl font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('- ')) {
                          return <p key={i} className="ml-4 mb-1">{line}</p>;
                        }
                        if (line.match(/^\d+\./)) {
                          return <p key={i} className="ml-4 mb-1">{line}</p>;
                        }
                        return line.trim() ? <p key={i} className="mb-2">{line}</p> : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={scripturesOpen} onOpenChange={setScripturesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto" data-testid="button-toggle-scriptures">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-serif text-xl font-semibold">Scripture References</span>
                  </div>
                  {scripturesOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-2">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {sermon.scriptures.map((scripture) => (
                        <Badge
                          key={scripture}
                          variant="secondary"
                          className="text-sm py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {scripture}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Related Sermons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedSermons.map((relSermon) => (
                  <Link key={relSermon.id} href={`/sermons/${relSermon.id}`}>
                    <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="w-24 h-16 bg-gradient-to-br from-[#221672] to-[#583922] rounded flex items-center justify-center flex-shrink-0">
                        <Play className="h-5 w-5 text-white/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{relSermon.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{relSermon.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
