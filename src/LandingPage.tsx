import { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./config/firebase";
import { Profile } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { PortfolioSection, SkillsSection, ExperienceSection, EducationSection } from "./components/ContentSections";
import Footer from "./components/Footer";

export default function LandingPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 8000);

    const unsub = onSnapshot(doc(db, "profile", "config"), (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as Profile);
      }
      setLoading(false);
      setErrorStatus(null);
      clearTimeout(timeout);
    }, (error) => {
      console.error("Profile fetch failed:", error);
      setErrorStatus(error.message);
      setLoading(false);
      clearTimeout(timeout);
    });
    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white overflow-hidden">
        <div className="relative flex flex-col items-center">
          <div className="w-20 h-20 border-8 border-bento-cyan border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-8 font-display font-black text-3xl animate-pulse uppercase italic tracking-tighter">
            Portfolio <span className="text-bento-rose">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <Navbar profile={profile} />
      <main>
        <Hero profile={profile} />
        <PortfolioSection />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
      </main>
      {errorStatus && (
        <div className="fixed bottom-4 left-4 bg-red-500 text-white p-4 rounded-xl shadow-lg z-50 animate-bounce font-black text-xs">
          CONNECTION ERROR: {errorStatus}
        </div>
      )}
      <Footer profile={profile} />
    </div>
  );
}
