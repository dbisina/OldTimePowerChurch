import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroSlide1 from "@assets/generated_images/subtle_golden_radial_glow_background.png";
import heroSlide2 from "@assets/generated_images/worship_prayer_blurred_silhouettes.png";
import heroSlide3 from "@assets/generated_images/bible_with_dove_light_ray.png";
import logoImage from "@assets/OTPC-removebg-preview_1764645088059.png";

interface Slide {
  image: string;
  headline: string;
  subheadline: string;
  ctaPrimary: { text: string; href?: string; action?: string };
  ctaSecondary?: { text: string; href?: string };
}

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

interface HeroCarouselProps {
  onConnectClick?: () => void;
}

export function HeroCarousel({ onConnectClick }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section
      className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-live="polite"
      data-testid="hero-carousel"
    >
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <img src={logoImage} alt="" className="w-64 h-64 md:w-96 md:h-96 drop-shadow-2xl" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {slide.headline}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md max-w-2xl mx-auto">
            {slide.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {slide.ctaPrimary.action === "openConnect" ? (
              <Button
                onClick={onConnectClick}
                size="lg"
                className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0 shadow-lg shadow-[#efc64e]/30 hover:shadow-[#efc64e]/50"
                data-testid="button-hero-primary"
              >
                {slide.ctaPrimary.text}
              </Button>
            ) : slide.ctaPrimary.href?.startsWith("#") ? (
              <a href={slide.ctaPrimary.href}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0 shadow-lg shadow-[#efc64e]/30 hover:shadow-[#efc64e]/50"
                  data-testid="button-hero-primary"
                >
                  {slide.ctaPrimary.text}
                </Button>
              </a>
            ) : (
              <Link href={slide.ctaPrimary.href || "/"}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0 shadow-lg shadow-[#efc64e]/30 hover:shadow-[#efc64e]/50"
                  data-testid="button-hero-primary"
                >
                  {slide.ctaPrimary.text}
                </Button>
              </Link>
            )}
            {slide.ctaSecondary && (
              <Link href={slide.ctaSecondary.href || "/"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
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
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        aria-label="Next slide"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide
                ? "bg-[#efc64e] w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
