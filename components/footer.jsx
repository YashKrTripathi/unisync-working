import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* University Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-dypiu-navy to-dypiu-navy-light flex items-center justify-center">
                <span className="text-white font-black text-sm">DY</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">DYPIU</span>
                <span className="text-dypiu-gold text-xs font-medium ml-1.5">EventHub</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-md leading-relaxed">
              Dr. D. Y. Patil Institute of Technology, Pimpri, Pune — Event Management System for organizing,
              discovering, and managing campus events seamlessly.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-dypiu-gold/70" />
                <span>Pimpri, Pune, Maharashtra 411018</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-dypiu-gold/70" />
                <span>+91 20 2742 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-dypiu-gold/70" />
                <span>events@dypiu.ac.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Explore Events", href: "/explore" },
                { label: "Past Events", href: "/past-events" },
                { label: "My Tickets", href: "/my-tickets" },
                { label: "My Events", href: "/my-events" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-dypiu-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "DYPIU Website", href: "https://www.dypiu.ac.in", external: true },
                { label: "Contact Us", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-dypiu-gold transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-dypiu-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Dr. D. Y. Patil Institute of Technology, Pimpri. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built with ❤️ by DYPIU Tech Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
