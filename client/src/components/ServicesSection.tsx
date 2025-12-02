import { Sun, BookOpen, Flame } from "lucide-react";
import { ServiceCard } from "./ServiceCard";

const services = [
  {
    id: "sun",
    name: "Saviour's Exaltation Service",
    day: "Sunday",
    time: "8:00 AM",
    icon: <Sun className="h-6 w-6" />,
    highlight: true,
  },
  {
    id: "tue",
    name: "Scripture Expository Service",
    day: "Tuesday",
    time: "5:00 PM",
    icon: <BookOpen className="h-6 w-6" />,
    highlight: false,
  },
  {
    id: "fri",
    name: "Spirit Empowerment Service",
    day: "Friday",
    time: "5:00 PM",
    icon: <Flame className="h-6 w-6" />,
    highlight: false,
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Join Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the power of God through our weekly gatherings focused on worship, teaching, and spiritual renewal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              day={service.day}
              time={service.time}
              icon={service.icon}
              highlight={service.highlight}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
