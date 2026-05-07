import { motion } from "motion/react";
import { Linkedin, Instagram, Mail, FileText, MessageSquare } from "lucide-react";
import { Profile } from "../types";

interface FooterProps {
  profile: Profile | null;
}

export default function Footer({ profile }: FooterProps) {
  const socialIcons = {
    wechat: <MessageSquare />,
    linkedin: <Linkedin />,
    email: <Mail />,
    instagram: <Instagram />,
  };

  return (
    <footer id="contact" className="bg-bento-dark text-white py-32 px-6 md:px-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
          <h2 className="text-6xl md:text-8xl font-display mb-12 uppercase italic leading-none">
            Have a project<br />
            <span className="text-bento-cyan">in mind?</span>
          </h2>
          
          <div className="space-y-8 mb-12">
            <a 
              href={`mailto:${profile?.contactEmail || "hi@alex.design"}`}
              className="flex items-center gap-4 text-2xl md:text-4xl font-display hover:text-bento-rose transition-colors group"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-bento-dark group-hover:bg-bento-rose group-hover:rotate-12 transition-all">
                <Mail />
              </div>
              {profile?.contactEmail || "hi@alex.design"}
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="bg-bento-rose p-10 rounded-[40px] border-4 border-white brutal-shadow-sm mb-12 text-white">
            <p className="text-2xl md:text-3xl font-black italic mb-10 leading-tight">
              {profile?.bio || "Creating expressive and functional visual identities with a passion for vibrant storytelling."}
            </p>
            
            <div id="social" className="flex gap-4">
              {profile?.socialLinks && Object.entries(profile.socialLinks).map(([platform, url]) => (
                url && (
                  <a 
                    key={platform} 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-14 h-14 bg-white border-2 border-bento-dark rounded-xl flex items-center justify-center text-bento-dark hover:bg-bento-yellow hover:-translate-y-2 transition-all shadow-[4px_4px_0px_0px_rgba(45,48,71,1)]"
                  >
                    {socialIcons[platform as keyof typeof socialIcons] || platform}
                  </a>
                )
              ))}
            </div>
          </div>
          
          <div id="resume" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <a 
              href={profile?.resumeUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-4 px-8 py-6 bg-bento-yellow text-bento-dark font-black text-2xl rounded-[40px] border-4 border-bento-dark brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
            >
              <FileText /> DOWNLOAD CV
            </a>
            <div className="flex items-center justify-end text-sm font-black opacity-50 uppercase tracking-widest italic">
              © {new Date().getFullYear()} {profile?.name || "ALEX.DESIGN"}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
