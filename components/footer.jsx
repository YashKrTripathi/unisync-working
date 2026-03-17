import React from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#0a0a0a] min-h-[60vh] flex flex-col justify-end pt-32 pb-8 overflow-hidden border-t border-white/10 mt-20">
      {/* Background Gradient */}
      <div className="absolute bottom-[-20%] right-[0%] w-[80vw] h-[80vh] bg-[#ff6b00] rounded-full blur-[140px] opacity-20 pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-white pb-24 md:pb-32">
          {/* Left Column */}
          <div className="space-y-6 text-[15px] font-sans font-medium text-white/90">
            <p className="leading-snug">
              UniSync Festival | DYPIU EventHub<br />
              © All Rights Reserved
            </p>
            <p className="leading-snug">
              D. Y. Patil International University<br />
              Akurdi, Pune, MH 411018
            </p>
            <p className="leading-snug">
              Copyright © {new Date().getFullYear()} DYPIU<br />
              EventHub
            </p>
            <div className="flex flex-col space-y-3 pt-4">
              <Link href="#" className="underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">Cookie Policy</Link>
              <Link href="#" className="underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">Review your cookie settings</Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-start md:items-end space-y-4">
            <a href="#" className="group flex items-center justify-between w-72 px-6 py-3.5 rounded-full border border-white/60 hover:bg-white hover:text-black transition-colors duration-300 font-sans font-bold text-[15px] tracking-wide">
              Support on Whatsapp
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#" className="group flex items-center justify-between w-72 px-6 py-3.5 rounded-full border border-white/60 hover:bg-white hover:text-black transition-colors duration-300 font-sans font-bold text-[15px] tracking-wide">
              Newsletter
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#" className="group flex items-center justify-between w-72 px-6 py-3.5 rounded-full border border-white/60 hover:bg-white hover:text-black transition-colors duration-300 font-sans font-bold text-[15px] tracking-wide">
              Telegram Group
              <ArrowRight className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-6 pt-4 pr-2">
              <a href="#" className="hover:opacity-70 transition-opacity"><Instagram className="w-6 h-6" strokeWidth={1.5} /></a>
              <a href="#" className="hover:opacity-70 transition-opacity"><Twitter className="w-6 h-6" strokeWidth={1.5} /></a>
              <a href="#" className="hover:opacity-70 transition-opacity"><Facebook className="w-6 h-6" strokeWidth={1.5} /></a>
              <a href="#" className="hover:opacity-70 transition-opacity"><Youtube className="w-6 h-6" strokeWidth={1.5} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a href="#" className="fixed bottom-8 right-8 w-[60px] h-[60px] bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform z-50">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.937 3.112 6.937 6.937 0 3.825-3.113 6.938-6.937 6.938z"/>
        </svg>
      </a>
    </footer>
  );
};

export default Footer;
