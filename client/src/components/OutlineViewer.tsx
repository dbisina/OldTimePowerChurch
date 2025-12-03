import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface OutlineViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  preacher: string;
  date: string;
  serviceDay: string;
  content: string;
}

export function OutlineViewer({
  isOpen,
  onClose,
  title,
  preacher,
  date,
  serviceDay,
  content,
}: OutlineViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="mb-2">
            <Badge variant="outline" className="text-primary border-primary/50">
              {serviceDay}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-serif text-[#b5621b]">
            {title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {preacher}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {date}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 mt-4 p-4 border rounded-md bg-muted/30">
          <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert whitespace-pre-wrap font-serif leading-relaxed">
            {content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
