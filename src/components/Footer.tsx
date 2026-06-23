import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Linkedin, Instagram, Mail, FileText, MessageSquare, Copy, Check, ExternalLink } from "lucide-react";
import { Profile } from "../types";

interface FooterProps {
  profile: Profile | null;
}

export default function Footer({ profile }: FooterProps) {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
              {profile?.socialLinks && Object.entries(profile.socialLinks).map(([platform, url]) => {
                if (!url) return null;

                const isDialogPlatform = platform === "wechat" || platform === "email";

                if (isDialogPlatform) {
                  return (
                    <div key={platform} className="relative">
                      <button 
                        onClick={() => {
                          if (activePopover === platform) {
                            setActivePopover(null);
                          } else {
                            setActivePopover(platform);
                            setCopied(false);
                          }
                        }}
                        className="w-14 h-14 bg-white border-2 border-bento-dark rounded-xl flex items-center justify-center text-bento-dark hover:bg-bento-yellow hover:-translate-y-2 transition-all shadow-[4px_4px_0px_0px_rgba(45,48,71,1)] cursor-pointer"
                        title={platform === "wechat" ? "WeChat Info" : "Email Info"}
                      >
                        {socialIcons[platform as keyof typeof socialIcons] || platform}
                      </button>

                      <AnimatePresence>
                        {activePopover === platform && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 w-72 bg-white border-4 border-bento-dark p-5 rounded-2xl text-bento-dark shadow-[6px_6px_0px_0px_rgba(45,48,71,1)] flex flex-col gap-3 font-sans text-left"
                          >
                            {/* Rotated square for carets */}
                            <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-4 border-l-4 border-bento-dark rotate-45 z-10" />

                            {platform === "wechat" ? (
                              <div className="relative z-20">
                                <span className="block font-display font-black text-xs text-bento-rose uppercase tracking-wider mb-1">
                                  WeChat ID
                                </span>
                                <p className="font-display font-bold text-lg text-bento-dark mb-3 break-all bg-slate-50 p-3 border-2 border-bento-dark rounded-xl shadow-[2px_2px_0px_0px_rgba(45,48,71,1)]">
                                  {url}
                                </p>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(url);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                  }}
                                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-bento-cyan hover:bg-bento-yellow font-black text-sm uppercase italic rounded-xl border-2 border-bento-dark shadow-[3px_3px_0px_0px_rgba(45,48,71,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(45,48,71,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer text-bento-dark"
                                >
                                  {copied ? (
                                    <>
                                      <Check size={16} /> COPIED!
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={16} /> COPY WECHAT ID
                                    </>
                                  )}
                                </button>
                                <p className="text-[11px] font-medium text-slate-500 mt-2 text-center italic">
                                  Add this ID on WeChat to connect
                                </p>
                              </div>
                            ) : (
                              <div className="relative z-20">
                                <span className="block font-display font-black text-xs text-bento-rose uppercase tracking-wider mb-1">
                                  Email Address
                                </span>
                                <p className="font-display font-bold text-lg text-bento-dark mb-4 break-all bg-slate-50 p-3 border-2 border-bento-dark rounded-xl shadow-[2px_2px_0px_0px_rgba(45,48,71,1)]">
                                  {url}
                                </p>
                                
                                <div className="flex flex-col gap-2">
                                  <a
                                    href={`mailto:${url}`}
                                    className="w-full flex items-center justify-center gap-2 py-2 bg-bento-cyan hover:bg-bento-yellow font-black text-sm uppercase italic rounded-xl border-2 border-bento-dark shadow-[3px_3px_0px_0px_rgba(45,48,71,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(45,48,71,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-bento-dark text-center"
                                  >
                                    <ExternalLink size={16} /> SEND EMAIL
                                  </a>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(url);
                                      setCopied(true);
                                      setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2 bg-white hover:bg-bento-yellow font-black text-sm uppercase italic rounded-xl border-2 border-bento-dark shadow-[3px_3px_0px_0px_rgba(45,48,71,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(45,48,71,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer text-bento-dark"
                                  >
                                    {copied ? (
                                      <>
                                        <Check size={16} /> COPIED!
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={16} /> COPY EMAIL
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <a 
                    key={platform} 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-14 h-14 bg-white border-2 border-bento-dark rounded-xl flex items-center justify-center text-bento-dark hover:bg-bento-yellow hover:-translate-y-2 transition-all shadow-[4px_4px_0px_0px_rgba(45,48,71,1)]"
                  >
                    {socialIcons[platform as keyof typeof socialIcons] || platform}
                  </a>
                );
              })}
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
