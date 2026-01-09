import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Sermons", href: "/sermons" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Announcements", href: "/announcements" },
];

interface NavbarProps {
  onConnectClick: () => void;
}

export function Navbar({ onConnectClick }: NavbarProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out ${
        scrolled
          ? "bg-background/60 backdrop-blur-xl backdrop-saturate-150 border-b border-primary/10 shadow-lg shadow-primary/5"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2 md:gap-4">
        <Link href="/" className="flex items-center gap-2 group min-w-0" data-testid="link-home-logo">
          <div className={`transition-all duration-300 flex-shrink-0 ${scrolled ? "scale-90" : "scale-100"}`}>
            <img src="/images/OTPC-removebg-preview.png" alt="Old Time Power Church" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
          </div>
          <span className={`font-serif font-bold text-lg hidden sm:block truncate transition-all duration-300 ${
            scrolled 
              ? "bg-gradient-to-r from-[#b5621b] to-[#efc64e] bg-clip-text text-transparent" 
              : "text-foreground"
          }`}>
            Old Time Power
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`transition-all duration-300 ${
                  location === item.href
                    ? "bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white hover:opacity-90"
                    : scrolled 
                    ? "hover:bg-primary/10 hover:text-primary"
                    : ""
                }`}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />
          <Button
            onClick={onConnectClick}
            className="hidden sm:flex bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0 shadow-lg shadow-[#efc64e]/20"
            data-testid="button-connect"
          >
            Connect
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/80 backdrop-blur-xl backdrop-saturate-150 border-b border-primary/10 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                onConnectClick();
              }}
              className="w-full bg-gradient-to-r from-[#b5621b] to-[#efc64e] text-white border-0"
              data-testid="button-mobile-connect"
            >
              Connect
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
