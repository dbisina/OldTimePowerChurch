import { Sun, BookOpen, Flame, Heart, Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logoImage from "@assets/OTPC-removebg-preview_1764645088059.png";

const coreBeliefs = [
  {
    title: "The Holy Bible",
    description: "We believe the Bible is the inspired, infallible Word of God and our final authority in all matters of faith and practice.",
  },
  {
    title: "Salvation by Grace",
    description: "We believe that salvation is by grace through faith in Jesus Christ alone, not by works.",
  },
  {
    title: "The Holy Spirit",
    description: "We believe in the baptism and empowerment of the Holy Spirit for every believer.",
  },
  {
    title: "The Second Coming",
    description: "We believe in the literal, physical return of Jesus Christ to establish His kingdom.",
  },
];

const teamMembers = [
  {
    name: "Pastor John",
    role: "Senior Pastor",
    initials: "PJ",
  },
  {
    name: "Elder James",
    role: "Teaching Elder",
    initials: "EJ",
  },
  {
    name: "Sister Mary",
    role: "Women's Ministry Leader",
    initials: "SM",
  },
  {
    name: "Brother David",
    role: "Youth Ministry Leader",
    initials: "BD",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <img src={logoImage} alt="Old Time Power Church" className="h-32 w-32 mx-auto mb-6" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Preparing the Way for the Lord
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-[#efc64e]/20 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-7 w-7 text-[#b5621b]" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Our Vision</h3>
                <p className="text-muted-foreground text-sm">
                  To see a generation awakened to the power of revival and transformed by the presence of God.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-[#efc64e]/20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-7 w-7 text-[#b5621b]" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-muted-foreground text-sm">
                  To make disciples through Scripture-centred teaching, Spirit empowerment, and loving community.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-[#efc64e]/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-[#b5621b]" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Our Community</h3>
                <p className="text-muted-foreground text-sm">
                  A diverse family united by faith, growing together in love and service to one another.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16 md:mb-24">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Our Core Beliefs</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The foundational truths that guide our faith and practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {coreBeliefs.map((belief, index) => (
              <Card key={index} className="overflow-visible">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold mb-2">{belief.title}</h3>
                  <p className="text-muted-foreground text-sm">{belief.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16 md:mb-24">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Our Leadership</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Meet the dedicated team serving our church family
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center overflow-visible">
                <CardContent className="p-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="bg-gradient-to-br from-[#221672] to-[#583922] text-white text-xl font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-serif font-semibold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Service Schedule</h2>
            <p className="text-muted-foreground">
              Join us for our weekly gatherings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-background rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b5621b] to-[#efc64e] flex items-center justify-center mx-auto mb-4">
                <Sun className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-1">Sunday</h3>
              <p className="text-2xl font-bold text-primary mb-2">8:00 AM</p>
              <p className="text-muted-foreground text-sm">Saviour's Exaltation Service</p>
            </div>

            <div className="bg-background rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#221672] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-1">Tuesday</h3>
              <p className="text-2xl font-bold text-primary mb-2">5:00 PM</p>
              <p className="text-muted-foreground text-sm">Scripture Expository Service</p>
            </div>

            <div className="bg-background rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#583922] flex items-center justify-center mx-auto mb-4">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-1">Friday</h3>
              <p className="text-2xl font-bold text-primary mb-2">5:00 PM</p>
              <p className="text-muted-foreground text-sm">Spirit Empowerment Service</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
