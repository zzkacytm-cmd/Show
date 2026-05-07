import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

import { Profile } from "../types";

export default function Navbar({ profile }: { profile: Profile | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "主页", href: "/" },
    { name: "作品系列", href: "#projects" },
    { name: "技能证书", href: "#skills" },
    { name: "工作经历", href: "#experience" },
    { name: "简历下载", href: "#resume" },
    { name: "社媒账号", href: "#social" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-4" : "py-8"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`bg-white brutal-border brutal-shadow-sm flex items-center justify-between px-6 py-3 transition-all duration-300 ${scrolled ? "rounded-full" : "rounded-2xl"}`}>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-bento-rose rounded-full flex items-center justify-center brutal-border group-hover:rotate-12 transition-transform">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <span className="font-display font-black text-xl hidden md:block tracking-tighter uppercase italic">{profile?.name || "ALEX"}.DESIGN</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-black uppercase tracking-widest">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`transition-colors relative group ${link.name === '简历下载' ? 'bg-bento-yellow px-3 py-1 -rotate-2 border-2 border-bento-dark hover:rotate-0' : 'hover:text-bento-rose'}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/admin" 
              className="px-4 py-2 bg-bento-cyan font-display font-bold rounded-lg brutal-border shadow-[4px_4px_0px_0px_rgba(45,48,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95"
            >
              ADMIN
            </Link>
            <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-6 right-6 mt-4 lg:hidden"
          >
            <div className="bg-white brutal-border brutal-shadow p-6 rounded-2xl flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-display font-bold hover:text-dopamine-pink"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
