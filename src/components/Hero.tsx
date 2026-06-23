import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Profile } from "../types";

interface HeroProps {
  profile: Profile | null;
}

export default function Hero({ profile }: HeroProps) {
  return (
    <section className="relative min-h-screen py-24 px-6 md:px-12 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-6 min-h-[700px]">
          
          {/* Main Hero Card (Large Area) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-8 md:row-span-4 bg-bento-cyan brutal-border rounded-[40px] brutal-shadow relative overflow-hidden group"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_white,_transparent)]"></div>
            <div className="p-8 md:p-16 flex flex-col justify-end h-full relative z-10">
              <div className="bg-white text-bento-dark w-fit px-4 py-2 text-sm font-black mb-6 -rotate-1 border-2 border-bento-dark">
                {profile?.name || "CREATIVE PORTFOLIO"}
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-none text-white drop-shadow-[4px_4px_0px_rgba(45,48,71,1)] uppercase">
                {profile?.name || "ALEX"}<br />
                <span className="italic">{profile?.tagline || "DESIGN"}</span>
              </h1>
            </div>
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-10 right-10 w-24 h-24 md:w-32 md:h-32 bg-bento-rose rounded-full border-4 border-bento-dark flex items-center justify-center -rotate-12"
            >
              <Sparkles className="text-white w-12 h-12" />
            </motion.div>
          </motion.div>

          {/* About Me Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 md:row-span-3 bg-bento-rose brutal-border rounded-[40px] brutal-shadow p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 italic uppercase tracking-tight">About Me</h2>
              <p className="text-lg md:text-xl font-bold leading-tight text-white/95 whitespace-pre-wrap">
                {profile?.aboutMe || "I build vibrant digital experiences that spark joy and drive engagement using bold colors and playful interactions."}
              </p>
            </div>
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-bento-yellow border-2 border-bento-dark rounded-full"></div>
                <span className="font-black text-white">Status: Open to Work</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-bento-cyan border-2 border-bento-dark rounded-full"></div>
                <span className="font-black text-white uppercase tracking-wider text-sm opacity-80 italic">Highly Motivated</span>
              </div>
            </div>
          </motion.div>

          {/* Banner Display Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 md:row-span-3 brutal-border rounded-[40px] brutal-shadow relative group overflow-hidden bg-bento-yellow"
          >
            {profile?.bannerUrl ? (
              <>
                <img 
                  src={profile.bannerUrl}
                  alt="My Brand Banner"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 animate-fade-in"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 bg-white text-bento-dark border-2 border-bento-dark px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(45,48,71,1)] z-10">
                  Featured Gallery
                </div>
              </>
            ) : (
              <div className="w-full h-full p-8 md:p-10 flex flex-col justify-between bg-bento-yellow">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase italic tracking-tighter text-bento-dark">Brand Banner</h3>
                  <p className="font-bold text-bento-dark/80 text-sm leading-snug">
                    Set a "Banner Image URL" in the administrator panel to showcase custom branding or your favorite artwork here!
                  </p>
                </div>
                <div className="w-full h-24 bg-white/60 border-2 border-dashed border-bento-dark/40 rounded-2xl flex items-center justify-center text-xs font-black text-bento-dark/50 italic">
                  No banner image configured
                </div>
              </div>
            )}
          </motion.div>

          {/* Quote / Social Banner Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-8 md:row-span-2 bg-bento-lime brutal-border rounded-[40px] brutal-shadow flex flex-col md:flex-row items-center px-10 py-8 gap-8"
          >
              <div className="flex-1">
                <h4 className="text-2xl font-black italic mb-4">Mood Of The Day</h4>
                <div className="flex flex-wrap gap-4">
                  {(profile?.moodEmojis && profile.moodEmojis.length > 0 ? profile.moodEmojis : ['🎨', '⚡', '🌈', '🔮']).map((emoji, i) => (
                    <div key={i} className="w-12 h-12 bg-white border-2 border-bento-dark rounded-xl flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(45,48,71,1)]">
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
             <div className="hidden md:block h-2/3 w-[2px] bg-bento-dark/20"></div>
             <div className="flex-1 flex flex-col items-end text-right">
                <p className="font-bold leading-tight text-xl italic max-w-[300px]">
                  "Design is intelligence made visible."
                </p>
                <p className="text-sm font-black mt-2 opacity-60">— W. Wheeler</p>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
