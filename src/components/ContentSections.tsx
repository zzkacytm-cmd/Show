import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { PortfolioItem, Skill, Certificate, Experience, Education, OperationType } from "../types";
import { handleFirestoreError } from "../utils/error-handler";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Award, Calendar, MapPin, Briefcase, GraduationCap, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import Section from "./Section";

export function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
      setItems(data);
    }, (error) => {
      console.error("Projects LIST failed:", error);
      handleFirestoreError(error, OperationType.LIST, "projects");
    });
  }, []);

  if (items.length === 0) {
    return (
      <Section id="projects" title="Works" bgColor="bg-bento-cyan/10">
        <div className="bg-white brutal-border brutal-shadow p-12 rounded-[40px] text-center">
          <p className="text-2xl font-bold opacity-50 italic uppercase italic">Nothing shared yet. Administrator is currently curating works.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="projects" title="Works" bgColor="bg-bento-cyan/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {items.map((item, idx) => (
          <PortfolioCard key={item.id} item={item} idx={idx} />
        ))}
      </div>
    </Section>
  );
}

function PortfolioCard({ item, idx }: { item: PortfolioItem, idx: number }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const images = item.imageUrls || [];

  const nextImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImg(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImg(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsLightboxOpen(false);
        if (e.key === "ArrowRight") nextImg();
        if (e.key === "ArrowLeft") prevImg();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "auto";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isLightboxOpen, images.length]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1 }}
        className="group"
      >
        <div className="bg-white brutal-border brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all rounded-[40px] overflow-hidden h-full flex flex-col">
          <div 
            className="relative aspect-video overflow-hidden border-b-4 border-bento-dark bg-slate-100 cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImg}
                src={images[currentImg]} 
                alt={`${item.title} ${currentImg + 1}`} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <button 
                    onClick={prevImg}
                    className="w-10 h-10 bg-white rounded-full brutal-border flex items-center justify-center hover:bg-bento-cyan transition-colors pointer-events-auto shadow-[2px_2px_0px_0px_rgba(45,48,71,1)]"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImg}
                    className="w-10 h-10 bg-white rounded-full brutal-border flex items-center justify-center hover:bg-bento-cyan transition-colors pointer-events-auto shadow-[2px_2px_0px_0px_rgba(45,48,71,1)]"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-full transition-all border border-bento-dark ${i === currentImg ? "w-6 bg-bento-rose" : "w-2 bg-white"}`}
                    />
                  ))}
                </div>
              </>
            )}

            {item.category && (
              <div className="absolute top-6 left-6 bg-bento-rose text-white px-4 py-1 text-sm font-black border-2 border-bento-dark rounded-full -rotate-2 shadow-[2px_2px_0px_0px_rgba(45,48,71,1)]">
                {item.category}
              </div>
            )}
          </div>
          <div className="p-10 flex-grow">
            <h3 className="text-3xl font-display mb-4 uppercase italic">{item.title}</h3>
            <p className="font-sans font-bold text-lg text-bento-dark/70 mb-8">{item.description}</p>
            <div className="flex items-center justify-between">
              {item.link && (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-bento-rose font-black hover:gap-4 transition-all uppercase italic"
                >
                  View Project <ExternalLink className="w-5 h-5" />
                </a>
              )}
              <button 
                onClick={() => setIsLightboxOpen(true)}
                className="text-xs font-black uppercase italic bg-bento-dark text-white px-4 py-2 rounded-full hover:bg-bento-rose transition-colors"
              >
                Expand View
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bento-dark/95 flex flex-col items-center justify-center p-4 md:p-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-bento-rose transition-colors z-[110]"
              onClick={() => setIsLightboxOpen(false)}
            >
              <LayoutGrid size={40} className="rotate-45" />
            </button>

            <div className="relative w-full max-w-6xl h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImg}
                  src={images[currentImg]}
                  alt={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="max-w-full max-h-[80vh] brutal-border bg-white object-contain"
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImg}
                    className="absolute left-0 md:-left-20 text-white hover:text-bento-cyan transition-colors"
                  >
                    <ChevronLeft size={60} strokeWidth={3} />
                  </button>
                  <button 
                    onClick={nextImg}
                    className="absolute right-0 md:-right-20 text-white hover:text-bento-cyan transition-colors"
                  >
                    <ChevronRight size={60} strokeWidth={3} />
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 text-center text-white max-w-2xl px-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-4xl font-display uppercase italic mb-2">{item.title}</h2>
              <div className="flex items-center justify-center gap-4 text-sm font-black uppercase italic">
                {images.length > 1 && <span>{currentImg + 1} / {images.length}</span>}
                {item.category && <span className="text-bento-cyan">{item.category}</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    const qSkills = query(collection(db, "skills"), orderBy("order", "asc"));
    const unsubscribeSkills = onSnapshot(qSkills, (snapshot) => {
      setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill)));
    });

    const qCerts = query(collection(db, "certificates"), orderBy("order", "asc"));
    const unsubscribeCerts = onSnapshot(qCerts, (snapshot) => {
      setCerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate)));
    });

    return () => {
      unsubscribeSkills();
      unsubscribeCerts();
    };
  }, []);

  return (
    <Section id="skills" title="Abilities" bgColor="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
          <h3 className="text-4xl font-black mb-12 text-bento-rose italic">HARD SKILLS</h3>
          <div className="flex flex-wrap gap-4">
            {skills.map((skill) => (
              <div 
                key={skill.id}
                className="px-6 py-4 bg-bento-cyan font-black text-xl rounded-2xl border-4 border-bento-dark shadow-[4px_4px_0px_0px_rgba(45,48,71,1)] hover:-translate-y-1 hover:bg-bento-yellow transition-all flex items-center gap-3"
              >
                {skill.name} <span className="text-[10px] bg-white px-2 py-0.5 border-2 border-black rounded-full uppercase">{skill.level}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-4xl font-black mb-12 text-bento-dark italic">CERTIFICATES</h3>
          <div className="grid grid-cols-1 gap-6">
            {certs.map((cert) => (
              <div key={cert.id} className="flex gap-4 items-center bg-bento-yellow/20 p-8 rounded-[30px] border-4 border-bento-dark border-dashed">
                <div className="w-16 h-16 bg-bento-yellow rounded-2xl flex items-center justify-center shrink-0 border-4 border-bento-dark rotate-3">
                  <Award className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase">{cert.name}</h4>
                  <p className="font-bold opacity-60 italic">{cert.issuer} • {cert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ExperienceSection() {
  const [items, setItems] = useState<Experience[]>([]);

  useEffect(() => {
    const q = query(collection(db, "experience"), orderBy("order", "asc"));
    return onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "experience"));
  }, []);

  return (
    <Section id="experience" title="Career" bgColor="bg-bento-lime/20">
      <div className="grid grid-cols-1 gap-10">
        {items.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`flex flex-col lg:flex-row gap-12 items-start p-12 bg-white brutal-border brutal-shadow rounded-[50px] relative overflow-hidden`}
          >
            <div className="lg:w-1/3 relative z-10">
              <div className="bg-bento-lime text-bento-dark px-4 py-1 rounded-full font-black text-sm border-2 border-bento-dark inline-block mb-6 shadow-[2px_2px_0px_0px_rgba(45,48,71,1)]">
                {exp.period}
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-4 uppercase italic leading-tight">{exp.jobTitle}</h3>
              <div className="flex items-center gap-2 font-black text-2xl text-bento-rose underline decoration-4 underline-offset-4">
                {exp.company}
              </div>
            </div>
            <div className="lg:w-2/3 relative z-10">
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-bento-dark/80 whitespace-pre-wrap">
                {exp.description}
              </p>
            </div>
            {/* Background number */}
            <div className="absolute top-0 right-0 p-12 text-[120px] font-black opacity-5 italic select-none pointer-events-none">
              0{idx + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function EducationSection() {
  const [items, setItems] = useState<Education[]>([]);

  useEffect(() => {
    const q = query(collection(db, "education"), orderBy("order", "asc"));
    return onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Education)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "education"));
  }, []);

  return (
    <Section id="education" title="Studies" bgColor="bg-bento-cyan/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {items.map((edu, idx) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, rotate: idx % 2 === 0 ? -2 : 2 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 brutal-border brutal-shadow rounded-[40px] flex gap-8 items-start"
          >
            <div className="w-20 h-20 bg-bento-rose rounded-2xl flex items-center justify-center shrink-0 border-4 border-bento-dark text-white rotate-6 hover:rotate-0 transition-transform">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div>
              <div className="text-sm font-black text-bento-rose uppercase mb-2 tracking-widest">{edu.period}</div>
              <h3 className="text-3xl font-black mb-2 uppercase italic">{edu.school}</h3>
              <p className="text-xl font-bold text-bento-dark underline decoration-bento-cyan decoration-4 mb-4">{edu.degree} in {edu.field}</p>
              <p className="font-bold opacity-70 leading-relaxed">{edu.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

