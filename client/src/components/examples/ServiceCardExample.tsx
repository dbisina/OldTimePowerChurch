import { Sun, BookOpen, Flame } from "lucide-react";
import { ServiceCard } from "../ServiceCard";

export default function ServiceCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <ServiceCard
        name="Saviour's Exaltation Service"
        day="Sunday"
        time="8:00 AM"
        icon={<Sun className="h-6 w-6" />}
        highlight={true}
      />
      <ServiceCard
        name="Scripture Expository Service"
        day="Tuesday"
        time="5:00 PM"
        icon={<BookOpen className="h-6 w-6" />}
      />
      <ServiceCard
        name="Spirit Empowerment Service"
        day="Friday"
        time="5:00 PM"
        icon={<Flame className="h-6 w-6" />}
      />
    </div>
  );
}
