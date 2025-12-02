import { useState } from "react";
import { MapPin, Clock, Send, ExternalLink } from "lucide-react";
import { SiTelegram, SiFacebook } from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Church coordinates: 5.563793905003396, 5.794660028834878
const CHURCH_LAT = 5.563793905003396;
const CHURCH_LNG = 5.794660028834878;
const CHURCH_FB = "https://www.facebook.com/OLDTIMEPOWERCHURCH/";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // For now, just show success - can integrate with backend later
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });

    setFormData({ name: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Reach out with any questions, prayer requests, or just to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      data-testid="input-contact-subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      data-testid="input-contact-message"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0"
                    data-testid="button-contact-submit"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Connect With Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#efc64e]/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-[#b5621b]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-muted-foreground text-sm">
                      Old Time Power Church<br />
                      Warri, Delta State, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1877f2]/20 flex items-center justify-center flex-shrink-0">
                    <SiFacebook className="h-5 w-5 text-[#1877f2]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Facebook</h4>
                    <a 
                      href={CHURCH_FB} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                      Follow us on Facebook
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0088cc]/20 flex items-center justify-center flex-shrink-0">
                    <SiTelegram className="h-5 w-5 text-[#0088cc]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Telegram</h4>
                    <a
                      href="https://t.me/+OTPC_Group"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0088cc] hover:underline text-sm flex items-center gap-1"
                    >
                      Join Our Group
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Service Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="font-medium">Sunday</p>
                      <p className="text-muted-foreground text-sm">Saviour's Exaltation Service</p>
                    </div>
                    <span className="text-primary font-semibold">8:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="font-medium">Tuesday</p>
                      <p className="text-muted-foreground text-sm">Scripture Expository Service</p>
                    </div>
                    <span className="text-primary font-semibold">5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="font-medium">Friday</p>
                      <p className="text-muted-foreground text-sm">Spirit Empowerment Service</p>
                    </div>
                    <span className="text-primary font-semibold">5:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.5!2d${CHURCH_LNG}!3d${CHURCH_LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzMnNDkuNyJOIDXCsDQ3JzQwLjgiRQ!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Church location map"
                />
              </div>
              <CardContent className="p-4">
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${CHURCH_LAT},${CHURCH_LNG}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-get-directions"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
