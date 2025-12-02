import { HeroCarousel } from "@/components/HeroCarousel";
import { ServicesSection } from "@/components/ServicesSection";
import { FeaturedSermons } from "@/components/FeaturedSermons";
import { AnnouncementsPreview } from "@/components/AnnouncementsPreview";
import { NewsletterCTA } from "@/components/NewsletterCTA";

interface HomePageProps {
  onConnectClick: () => void;
}

export default function HomePage({ onConnectClick }: HomePageProps) {
  return (
    <main>
      <HeroCarousel onConnectClick={onConnectClick} />
      <ServicesSection />
      <FeaturedSermons />
      <AnnouncementsPreview />
      <NewsletterCTA />
    </main>
  );
}
