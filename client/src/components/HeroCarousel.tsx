import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroSlide1 from "@assets/generated_images/subtle_golden_radial_glow_background.png";
import heroSlide2 from "@assets/generated_images/worship_prayer_blurred_silhouettes.png";
import heroSlide3 from "@assets/generated_images/bible_with_dove_light_ray.png";

interface Slide {
  image: string;
  headline: string;
  subheadline: string;
  ctaPrimary: { text: string; href?: string; action?: string };
  ctaSecondary?: { text: string; href?: string };
}

interface HeroCarouselProps {
  onConnectClick: () => void;
}

export function HeroCarousel({ onConnectClick }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides: Slide[] = [
    {
      image: heroSlide1,
      headline: "Old Time Revival — Preparing the Way for the Lord",
      subheadline: "Awake the church. Ignite revival. Encounter His presence.",
      ctaPrimary: { text: "Join a Service", href: "#services" },
      ctaSecondary: { text: "Watch Latest Sermon", href: "/sermons" },
    },
    {
      image: heroSlide2,
      headline: "Saviour's Exaltation Service — Sundays 8:00 AM",
      subheadline: "A time of praise, proclamation and revival",
      ctaPrimary: { text: "Plan Your Visit", href: "/contact" },
    },
    {
      image: heroSlide3,
      headline: "Preparing the way for the Lord",
      subheadline: "Scripture-centred teaching, Spirit empowerment and community renewal",
      ctaPrimary: { text: "Subscribe for Sermons", action: "openConnect" },
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-live="polite"
      aria-label="Hero carousel"
      data-testid="hero-carousel"
    >
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s.image})` }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#efc64e]/10 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative h-full flex items-center justify-center px-4">
        <div className="max-w-4xl text-center space-y-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight drop-shadow-lg bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent">
            {slide.headline}
          </h2>
          <p className="text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto">
            {slide.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {slide.ctaPrimary.action === "openConnect" ? (
              <Button
                onClick={onConnectClick}
                size="lg"
                className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white text-lg px-8 shadow-lg shadow-[#efc64e]/30 border-0"
                data-testid="button-hero-primary"
              >
                {slide.ctaPrimary.text}
              </Button>
            ) : slide.ctaPrimary.href?.startsWith("#") ? (
              <a href={slide.ctaPrimary.href}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white text-lg px-8 shadow-lg shadow-[#efc64e]/30 border-0"
                  data-testid="button-hero-primary"
                >
                  {slide.ctaPrimary.text}
                </Button>
              </a>
            ) : (
              <Link href={slide.ctaPrimary.href || "/"}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white text-lg px-8 shadow-lg shadow-[#efc64e]/30 border-0"
                  data-testid="button-hero-primary"
                >
                  {slide.ctaPrimary.text}
                </Button>
              </Link>
            )}
            {slide.ctaSecondary && (
              <Link href={slide.ctaSecondary.href || "/"}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-background/20 backdrop-blur-sm border-primary/30 text-foreground hover:bg-primary/10 text-lg px-8"
                  data-testid="button-hero-secondary"
                >
                  {slide.ctaSecondary.text}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm border border-primary/20 rounded-lg p-3 hover:bg-primary/20 transition-all"
        aria-label="Previous slide"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm border border-primary/20 rounded-lg p-3 hover:bg-primary/20 transition-all"
        aria-label="Next slide"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="w-6 h-6 text-primary" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-12 bg-primary shadow-lg shadow-primary/50"
                : "w-2 bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
