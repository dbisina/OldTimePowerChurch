import { useState } from "react";
import { X, Send } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectModal({ open, onOpenChange }: ConnectModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceDay: "",
    subscribe: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // todo: remove mock functionality
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Welcome to Old Time Power Church!",
      description: "Thank you for connecting with us. We'll be in touch soon.",
    });

    setFormData({ name: "", email: "", serviceDay: "", subscribe: true });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-connect">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Connect With Us</DialogTitle>
          <DialogDescription>
            Join our community and stay updated with sermons, events, and more.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-testid="input-connect-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              data-testid="input-connect-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceDay">Preferred Service</Label>
            <Select
              value={formData.serviceDay}
              onValueChange={(value) => setFormData({ ...formData, serviceDay: value })}
            >
              <SelectTrigger id="serviceDay" data-testid="select-connect-service">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunday">Sunday - Saviour's Exaltation (8:00 AM)</SelectItem>
                <SelectItem value="tuesday">Tuesday - Scripture Expository (5:00 PM)</SelectItem>
                <SelectItem value="friday">Friday - Spirit Empowerment (5:00 PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="subscribe"
              checked={formData.subscribe}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, subscribe: checked as boolean })
              }
              data-testid="checkbox-connect-subscribe"
            />
            <Label htmlFor="subscribe" className="text-sm font-normal">
              Subscribe to our newsletter for sermon updates
            </Label>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0"
              data-testid="button-connect-submit"
            >
              {isSubmitting ? (
                "Connecting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Connect
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                // todo: remove mock functionality
                toast({ title: "Opening Telegram...", description: "Join our community channel" });
              }}
              data-testid="button-connect-telegram"
            >
              <SiTelegram className="h-4 w-4 mr-2 text-[#0088cc]" />
              Join Our Telegram
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
