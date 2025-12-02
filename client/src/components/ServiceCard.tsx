import { Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  name: string;
  day: string;
  time: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export function ServiceCard({ name, day, time, icon, highlight }: ServiceCardProps) {
  return (
    <Card
      className={`overflow-visible transition-all duration-300 hover:translate-y-[-4px] ${
        highlight
          ? "bg-gradient-to-br from-[#b5621b]/10 to-[#efc64e]/10 border-[#efc64e]/30 shadow-lg shadow-[#efc64e]/10"
          : "bg-card/60 backdrop-blur-md"
      }`}
      data-testid={`card-service-${day.toLowerCase()}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg ${
              highlight
                ? "bg-gradient-to-br from-[#b5621b] to-[#efc64e] text-white"
                : "bg-primary/10 text-primary"
            }`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-serif font-semibold text-lg mb-2">{name}</h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{day}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
