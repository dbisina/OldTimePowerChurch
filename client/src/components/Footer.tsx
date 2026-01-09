import { MapPin, Clock, ExternalLink } from "lucide-react";
import { SiFacebook, SiTelegram } from "react-icons/si";
import { Link } from "wouter";

const CHURCH_FB = "https://www.facebook.com/OLDTIMEPOWERCHURCH/";
const CHURCH_TELEGRAM = "https://t.me/+OTPC_Group";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900/90 via-slate-800/85 to-slate-900/95 backdrop-blur-md border-t border-slate-700/30 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/OTPC-removebg-preview.png" alt="Old Time Power Church" className="h-14 w-14 object-contain" />
              <div>
                <h3 className="font-serif font-bold text-lg">Old Time Power</h3>
                <p className="text-white/70 text-sm">Church</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Preparing the Way for the Lord through revival services, Scripture teaching, and Spirit empowerment.
            </p>
            <div className="flex gap-3">
              <a
                href={CHURCH_FB}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#efc64e] hover:underline"
                data-testid="link-footer-facebook"
              >
                <SiFacebook className="h-5 w-5" />
                <span>Facebook</span>
              </a>
              <a
                href={CHURCH_TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0088cc] hover:underline"
                data-testid="link-footer-telegram"
              >
                <SiTelegram className="h-5 w-5" />
                <span>Telegram</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Sermons", href: "/sermons" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Announcements", href: "/announcements" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-[#efc64e] transition-colors" data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, "-")}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Service Times</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-1 text-[#efc64e]" />
                <div>
                  <p className="font-medium">Sunday 8:00 AM</p>
                  <p className="text-white/70 text-sm">Saviour's Exaltation Service</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-1 text-[#efc64e]" />
                <div>
                  <p className="font-medium">Tuesday 5:00 PM</p>
                  <p className="text-white/70 text-sm">Scripture Expository Service</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-1 text-[#efc64e]" />
                <div>
                  <p className="font-medium">Friday 5:00 PM</p>
                  <p className="text-white/70 text-sm">Spirit Empowerment Service</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Location</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-[#efc64e]" />
                <span className="text-white/70 text-sm">
                  Old Time Power Church<br />
                  Warri, Delta State<br />
                  Nigeria
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 text-center text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Old Time Power Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
