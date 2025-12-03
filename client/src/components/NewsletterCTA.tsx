import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function NewsletterCTA() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // todo: remove mock functionality
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });

    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#221672] to-[#583922] py-12 md:py-20">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#efc64e] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#b5621b] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#efc64e]/20 mb-6">
          <Mail className="h-8 w-8 text-[#efc64e]" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
          Stay Connected
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          Subscribe to receive weekly sermon summaries, announcements, and spiritual encouragement directly in your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#efc64e]"
            data-testid="input-newsletter-email"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0 shadow-lg shadow-[#efc64e]/20"
            data-testid="button-newsletter-subscribe"
          >
            {isSubmitting ? (
              "Subscribing..."
            ) : (
              <>
                Subscribe
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <p className="text-white/50 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
