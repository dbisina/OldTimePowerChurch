import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import logoImage from "@assets/OTPC-removebg-preview_1764645088059.png";

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

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home-logo">
          <img src={logoImage} alt="Old Time Power Church" className="h-12 w-12 object-contain" />
          <span className="font-serif font-bold text-lg hidden sm:block">Old Time Power</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                size="sm"
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
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
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 animate-in slide-in-from-top-2">
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
