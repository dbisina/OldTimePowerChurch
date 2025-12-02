import { Clock, Calendar } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface ServiceCardProps {
  name: string;
  day: string;
  time: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export function ServiceCard({ name, day, time, icon, highlight }: ServiceCardProps) {
  return (
    <SpotlightCard
      glowColor={highlight ? "golden" : "indigo"}
      customSize
      className="w-full transition-all duration-300 hover:translate-y-[-4px]"
      data-testid={`card-service-${day.toLowerCase()}`}
    >
      <CardContent className="p-0">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg flex-shrink-0 ${
              highlight
                ? "bg-gradient-to-br from-[#b5621b] to-[#efc64e] text-white"
                : "bg-primary/10 text-primary"
            }`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-lg mb-2">{name}</h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{day}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </SpotlightCard>
  );
}
