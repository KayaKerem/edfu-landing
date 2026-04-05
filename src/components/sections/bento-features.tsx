"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { FileText, Image as ImageIcon, Upload, CheckCircle2, Loader2 } from "lucide-react";
import NextImage from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import type { Dictionary } from "@/dictionaries";
import { Notion } from "@/components/ui/svgs/notion";
import { Slack } from "@/components/ui/svgs/slack";
import { Figma } from "@/components/ui/svgs/figma";
import { Drive } from "@/components/ui/svgs/drive";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { Discord } from "@/components/ui/svgs/discord";
import { Linear } from "@/components/ui/svgs/linear";
import { Stripe } from "@/components/ui/svgs/stripe";
import { Vercel } from "@/components/ui/svgs/vercel";
import { Openai } from "@/components/ui/svgs/openai";

/* ------------------------------------------------------------------ */
/*  Card 1 – Chat Mockup with streaming animation                     */
/* ------------------------------------------------------------------ */
function ChatMockup({ response }: { response: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer - start animation when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  const [isThinking, setIsThinking] = useState(false);

  const startStreaming = useCallback(() => {
    setShowResponse(true);
    setIsThinking(true);
    setDisplayedText("");
    // Thinking dots for a moment, then start typing
    setTimeout(() => {
      setIsThinking(false);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayedText(response.slice(0, i));
        if (i >= response.length) {
          clearInterval(interval);
          setTimeout(() => {
            setDisplayedText("");
            setShowResponse(false);
            setIsThinking(false);
            setTimeout(() => startStreaming(), 1000);
          }, 5000);
        }
      }, 35);
    }, 1500);
  }, [response]);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => startStreaming(), 1000);
    return () => clearTimeout(timer);
  }, [isVisible, startStreaming]);

  return (
    <div ref={containerRef} className="relative flex h-full w-full flex-col items-center justify-center p-4">
      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-8 w-full bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto flex w-full max-w-md flex-col gap-3" style={{ transform: "translateY(-15px)" }}>
        {/* User message */}
        <div className="flex items-end justify-end gap-3">
          <div className="ml-auto max-w-[280px] rounded-2xl bg-primary p-4 text-sm text-primary-foreground shadow-[0_0_10px_rgba(0,0,0,0.05)]">
            <p>Geçen yıl Bursa projesinde hangi yazılım ekibiyle çalışmıştık, memnun kalmış mıydık?</p>
          </div>
          <div className="flex shrink-0 items-center rounded-full border border-border bg-background">
            <NextImage
              src="https://randomuser.me/api/portraits/women/79.jpg"
              alt="Edfu kullanıcısı profil fotoğrafı"
              width={32}
              height={32}
              className="size-8 rounded-full"
            />
          </div>
        </div>

        {/* AI response */}
        {showResponse && (
          <div className="flex items-start gap-2 animate-slide-up">
            {/* AI icon */}
            <img src="/ai-icon.svg" alt="Edfu AI Asistan" className="size-10 shrink-0 rounded-full" />
            {/* Response bubble with streaming text */}
            <div className="max-w-[280px] rounded-xl border border-border bg-white dark:bg-card shadow-[0_0_10px_rgba(0,0,0,0.05)] transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" style={{ padding: isThinking || displayedText ? "1rem" : "0.75rem 1rem" }}>
              {isThinking ? (
                <div className="flex gap-1 py-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{displayedText}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card 2 – Orbiting Circles Integration                             */
/* ------------------------------------------------------------------ */
function IntegrationOrbits() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = orbitRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={orbitRef} className="relative h-full w-full overflow-hidden">
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[35%] scale-[0.85] sm:scale-[0.9] md:scale-100 origin-bottom">
        {/* Background gradient circles - ripple in from center */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-black/[0.02] dark:bg-[#1F2023]/40 transition-all duration-[1200ms] ease-out ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} style={{ transitionDelay: "800ms" }} />
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[390px] rounded-full bg-black/[0.03] dark:bg-[#1F2023]/60 transition-all duration-1000 ease-out ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} style={{ transitionDelay: "400ms" }} />
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[240px] rounded-full bg-black/[0.03] dark:bg-[#1F2023]/80 transition-all duration-700 ease-out ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} style={{ transitionDelay: "100ms" }} />

        {/* Orbiting container - appears after gradient circles */}
        <div className={`relative flex items-center justify-center transition-all duration-[1200ms] ease-out ${isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} style={{ width: 500, height: 500, transitionDelay: "1200ms" }}>
          <img src="/ai-icon-filled.svg" alt="Edfu platform logosu" className="relative z-10 size-16 rounded-xl" />

          {/* Inner orbit - 2 icons, most space */}
          <OrbitingCircles iconSize={48} radius={120} speed={0.8}>
            <div className="flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2.5">
              <Slack className="size-7" />
            </div>
            <div className="flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2.5">
              <Figma className="size-7" />
            </div>
          </OrbitingCircles>

          {/* Middle orbit - 3 icons */}
          <OrbitingCircles iconSize={44} radius={195} speed={0.6} reverse>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <Notion className="size-6" />
            </div>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <Drive className="size-6" />
            </div>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <Openai className="size-6" />
            </div>
          </OrbitingCircles>

          {/* Outer orbit - 3 icons */}
          <OrbitingCircles iconSize={40} radius={250} speed={0.5}>
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <GithubDark className="size-5" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <Vercel className="size-5" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm p-2">
              <Stripe className="size-5" />
            </div>
          </OrbitingCircles>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card 3 – Drive Folder Drag & Drop Mockup                          */
/* ------------------------------------------------------------------ */
type DragPhase = "idle" | "dragging" | "dropping" | "uploading" | "done";

const uploadedFiles: { name: string; icon: typeof FileText; size: string; color: string; status: "ready" | "processing" }[] = [
  { name: "Tedarikçi_Sözleşme.pdf", icon: FileText, size: "2.4 MB", color: "text-red-500", status: "ready" },
  { name: "KVKK_Politikası.pdf", icon: FileText, size: "890 KB", color: "text-red-500", status: "ready" },
  { name: "Ürün_Kataloğu.docx", icon: FileText, size: "1.8 MB", color: "text-blue-600", status: "ready" },
  { name: "Bütçe_2025_Q1.xlsx", icon: FileText, size: "3.2 MB", color: "text-emerald-600", status: "processing" },
  { name: "İK_El_Kitabı.pdf", icon: FileText, size: "1.5 MB", color: "text-red-500", status: "ready" },
  { name: "Satış_Raporu.xlsx", icon: FileText, size: "540 KB", color: "text-emerald-600", status: "ready" },
  { name: "Müşteri_Brifingi.docx", icon: FileText, size: "420 KB", color: "text-blue-600", status: "processing" },
  { name: "ISO_27001_Prosedür.pdf", icon: FileText, size: "7.6 MB", color: "text-red-500", status: "ready" },
  { name: "Organizasyon_Şeması.pdf", icon: FileText, size: "220 KB", color: "text-red-500", status: "ready" },
  { name: "Yıllık_Faaliyet.pdf", icon: FileText, size: "12 MB", color: "text-red-500", status: "processing" },
  { name: "Toplantı_Tutanağı.docx", icon: FileText, size: "380 KB", color: "text-blue-600", status: "ready" },
  { name: "Fiyat_Listesi_2025.xlsx", icon: FileText, size: "1.1 MB", color: "text-emerald-600", status: "ready" },
];

function DriveUploadMockup({ indexing, indexed, fileProcessed, fileProcessing }: { indexing: string; indexed: string; fileProcessed: string; fileProcessing: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState<DragPhase>("idle");
  const [folderOpen, setFolderOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showFiles, setShowFiles] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !isVisible) setIsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
    return t;
  }, []);

  const runCycle = useCallback(() => {
    // Reset
    setPhase("idle");
    setFolderOpen(false);
    setUploadProgress(0);
    setShowFiles(false);

    // 1. Cursor + file appear, start dragging
    schedule(() => setPhase("dragging"), 800);

    // 2. File reaches folder, folder opens
    schedule(() => {
      setPhase("dropping");
      setFolderOpen(true);
    }, 2600);

    // 3. File drops in, start upload
    schedule(() => {
      setPhase("uploading");
      setFolderOpen(false);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 4;
        setUploadProgress(Math.min(progress, 100));
        if (progress >= 100) {
          clearInterval(interval);
          schedule(() => setPhase("done"), 300);
        }
      }, 50);
    }, 3200);

    // 4. Show uploaded files
    schedule(() => setShowFiles(true), 5000);

    // 5. Restart cycle
    schedule(() => runCycle(), 13000);
  }, [schedule]);

  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(runCycle, 600);
    return () => {
      clearTimeout(t);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [isVisible, runCycle]);

  // Cursor + file card positions
  const cursorStart = { x: 180, y: 220 };
  const cursorEnd = { x: 80, y: 60 };

  const cursorPos = phase === "dragging" || phase === "dropping"
    ? (phase === "dragging" ? cursorEnd : cursorEnd)
    : cursorStart;

  return (
    <div ref={containerRef} className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* Folder */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <FolderIcon color="#3b82f6" size={1.8} open={folderOpen} />
      </motion.div>

      {/* Cursor + dragged file */}
      <AnimatePresence>
        {(phase === "dragging" || phase === "dropping") && (
          <motion.div
            className="pointer-events-none absolute z-20"
            initial={{ x: cursorStart.x, y: cursorStart.y, opacity: 0 }}
            animate={{
              x: cursorPos.x,
              y: cursorPos.y,
              opacity: phase === "dropping" ? 0 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              x: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] },
              y: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.3 },
            }}
          >
            {/* Cursor SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
              <path d="M5.65 5.65L12.64 19.21L14.49 13.97L19.73 12.12L5.65 5.65Z" fill="currentColor" className="text-foreground" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>

            {/* Dragged file card */}
            <motion.div
              className="ml-3 -mt-1 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 shadow-lg"
              animate={{ rotate: [0, -2, 1, -1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <FileText className="size-4 text-blue-600 shrink-0" />
              <span className="text-xs font-medium text-foreground whitespace-nowrap">Tedarikçi_Anlaşması_2025.pdf</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload progress overlay */}
      <AnimatePresence>
        {(phase === "uploading" || phase === "done") && !showFiles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              {phase === "uploading" ? (
                <>
                  <div className="relative flex size-14 items-center justify-center">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
                      <circle
                        cx="28" cy="28" r="24" fill="none" stroke="currentColor" className="text-primary"
                        strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - uploadProgress / 100)}`}
                        style={{ transition: "stroke-dashoffset 0.1s ease" }}
                      />
                    </svg>
                    <Upload className="size-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{indexing}</p>
                    <p className="text-xs text-muted-foreground">Tedarikçi_Anlaşması_2025.pdf · {uploadProgress}%</p>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle2 className="size-14 text-emerald-500" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{indexed}</p>
                    <p className="text-xs text-muted-foreground">Tedarikçi_Anlaşması_2025.pdf · 1.8 MB</p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded files list - fills the card */}
      <AnimatePresence>
        {showFiles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 overflow-hidden bg-background/70 backdrop-blur-[3px]"
          >
            <div className="flex flex-col gap-1.5 px-5 pt-4">
              {uploadedFiles.map((file, i) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, delay: i * 0.07 }}
                  className="flex items-center gap-3 rounded-lg border border-border bg-white dark:bg-card px-3 py-2 shadow-sm"
                >
                  <file.icon className={`size-4 shrink-0 ${file.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-foreground">{file.name}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-[10px] text-muted-foreground">{file.size}</p>
                      <span className="text-[9px] text-muted-foreground">·</span>
                      <span className={`text-[10px] font-medium ${file.status === "ready" ? "text-emerald-500" : "text-orange-500"}`}>
                        {file.status === "ready" ? fileProcessed : fileProcessing}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.07 + 0.2, type: "spring", stiffness: 500, damping: 20 }}
                  >
                    {file.status === "ready" ? (
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    ) : (
                      <Loader2 className="size-3.5 shrink-0 animate-spin text-orange-500" />
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Inline Folder Icon (based on reactbits.dev/components/folder) */
function FolderIcon({ color = "#5227FF", size = 1, open = false }: { color?: string; size?: number; open?: boolean }) {
  const darken = (hex: string, pct: number) => {
    let c = hex.startsWith("#") ? hex.slice(1) : hex;
    if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
    const n = parseInt(c, 16);
    const r = Math.max(0, Math.floor(((n >> 16) & 0xff) * (1 - pct)));
    const g = Math.max(0, Math.floor(((n >> 8) & 0xff) * (1 - pct)));
    const b = Math.max(0, Math.floor((n & 0xff) * (1 - pct)));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const backColor = darken(color, 0.08);
  const papers = [darken("#ffffff", 0.1), darken("#ffffff", 0.05), "#ffffff"];
  const widths = ["70%", "80%", "90%"];
  const heights = ["80%", "70%", "60%"];
  const openTransforms = [
    "translate(-120%, -70%) rotateZ(-15deg)",
    "translate(10%, -70%) rotateZ(15deg)",
    "translate(-50%, -100%) rotateZ(5deg)",
  ];

  return (
    <div style={{ transform: `scale(${size})` }}>
      <div style={{ transition: "all 0.2s ease-in", transform: open ? "translateY(-8px)" : undefined }}>
        <div style={{ position: "relative", width: 100, height: 80, background: backColor, borderRadius: "0px 10px 10px 10px" }}>
          <div style={{ position: "absolute", zIndex: 0, bottom: "98%", left: 0, width: 30, height: 10, background: backColor, borderRadius: "5px 5px 0 0" }} />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute", zIndex: 2, bottom: "10%", left: "50%",
                transform: open ? openTransforms[i] : "translate(-50%, 10%)",
                width: widths[i], height: open && i > 0 ? "80%" : heights[i],
                background: papers[i], borderRadius: 10,
                transition: "all 0.3s ease-in-out",
              }}
            />
          ))}
          <div style={{ position: "absolute", zIndex: 3, width: "100%", height: "100%", background: color, borderRadius: "5px 10px 10px 10px", transformOrigin: "bottom", transform: open ? "skew(15deg) scaleY(0.6)" : undefined, transition: "all 0.3s ease-in-out" }} />
          <div style={{ position: "absolute", zIndex: 3, width: "100%", height: "100%", background: color, borderRadius: "5px 10px 10px 10px", transformOrigin: "bottom", transform: open ? "skew(-15deg) scaleY(0.6)" : undefined, transition: "all 0.3s ease-in-out" }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card 4 – AI Notes Mockup                                           */
/* ------------------------------------------------------------------ */
const NOTE_CONTENT = "Müşteri görüşmelerinde fiyat itirazları öne çıktı. Rakip ürünlerle karşılaştırma yapılıyor. Satış ekibi yeni teklif şablonu istiyor — önümüzdeki hafta hazırlanacak.";

function NotesMockup({ noteTitle, noteTags, saved }: { noteTitle: string; noteTags: string[]; saved: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");
  const [typedContent, setTypedContent] = useState("");
  const [phase, setPhase] = useState<"idle" | "title" | "content" | "tags" | "saved">("idle");
  const [visibleTags, setVisibleTags] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !isVisible) setIsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
    return t;
  }, []);

  const runCycle = useCallback(() => {
    setTypedTitle("");
    setTypedContent("");
    setVisibleTags(0);
    setPhase("idle");

    // 1. Type title
    schedule(() => {
      setPhase("title");
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setTypedTitle(noteTitle.slice(0, i));
        if (i >= noteTitle.length) clearInterval(interval);
      }, 60);
    }, 800);

    // 2. Type content
    schedule(() => {
      setPhase("content");
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setTypedContent(NOTE_CONTENT.slice(0, i));
        if (i >= NOTE_CONTENT.length) clearInterval(interval);
      }, 25);
    }, 2000);

    // 3. Show tags one by one
    schedule(() => {
      setPhase("tags");
      setVisibleTags(1);
    }, 6500);
    schedule(() => setVisibleTags(2), 6800);
    schedule(() => setVisibleTags(3), 7100);

    // 4. Saved
    schedule(() => setPhase("saved"), 7600);

    // 5. Restart
    schedule(() => runCycle(), 11000);
  }, [schedule, noteTitle]);

  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(runCycle, 600);
    return () => {
      clearTimeout(t);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [isVisible, runCycle]);

  return (
    <div ref={containerRef} className="flex h-full w-full flex-col p-5 pt-6 pb-16">
      {/* Note editor mockup */}
      <div className="flex flex-1 flex-col rounded-xl border border-border bg-white dark:bg-card shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-border px-3 py-2">
          <div className="flex items-center gap-0.5">
            {["B", "I", "U"].map((btn) => (
              <span key={btn} className="flex size-6 items-center justify-center rounded text-[11px] font-semibold text-muted-foreground/60">{btn}</span>
            ))}
          </div>
          <div className="mx-1.5 h-3.5 w-px bg-border" />
          <div className="flex items-center gap-0.5">
            {[
              <svg key="list" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3" cy="6" r="1" fill="currentColor" /><circle cx="3" cy="12" r="1" fill="currentColor" /><circle cx="3" cy="18" r="1" fill="currentColor" /></svg>,
              <svg key="check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="6" height="6" rx="1" /><line x1="12" y1="8" x2="21" y2="8" /><rect x="3" y="14" width="6" height="6" rx="1" /><line x1="12" y1="17" x2="21" y2="17" /></svg>,
            ].map((icon, i) => (
              <span key={i} className="flex size-6 items-center justify-center rounded text-muted-foreground/60">{icon}</span>
            ))}
          </div>
          {/* AI badge */}
          <div className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-[10px] font-medium text-primary">AI</span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 px-4 py-3">
          {/* Title */}
          <div className="mb-2 min-h-[24px]">
            {typedTitle && (
              <h4 className="text-base font-semibold text-foreground tracking-tight">{typedTitle}
                {phase === "title" && <span className="inline-block w-px h-4 ml-0.5 bg-primary animate-pulse" />}
              </h4>
            )}
            {!typedTitle && phase === "idle" && (
              <div className="h-5 w-32 rounded bg-muted/50" />
            )}
          </div>

          {/* Content */}
          <div className="min-h-[60px]">
            {typedContent && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {typedContent}
                {phase === "content" && <span className="inline-block w-px h-3 ml-0.5 bg-primary animate-pulse" />}
              </p>
            )}
            {!typedContent && phase !== "idle" && null}
            {phase === "idle" && (
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-muted/30" />
                <div className="h-3 w-4/5 rounded bg-muted/30" />
                <div className="h-3 w-3/5 rounded bg-muted/30" />
              </div>
            )}
          </div>
        </div>

        {/* Tags + saved indicator */}
        <div className="flex items-center gap-2 border-t border-border px-4 py-2.5">
          <div className="flex flex-1 items-center gap-1.5 overflow-hidden">
            {noteTags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={visibleTags > i ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="inline-flex shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <AnimatePresence>
            {phase === "saved" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex shrink-0 items-center gap-1 text-emerald-500"
              >
                <CheckCircle2 className="size-3" />
                <span className="text-[10px] font-medium">{saved}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hatched pattern for between inner & outer lines                    */
/* ------------------------------------------------------------------ */
function HatchedEdge({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`absolute top-0 ${side === "left" ? "-left-4 md:-left-14" : "-right-4 md:-right-14"} h-full hidden md:block w-14 text-foreground/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]`}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Section Component                                                  */
/* ------------------------------------------------------------------ */
interface BentoFeaturesProps {
  dict: Dictionary["features"];
}

export function BentoFeatures({ dict }: BentoFeaturesProps) {
  const visuals = [
    <ChatMockup key="chat" response={dict.chatResponse} />,
    <IntegrationOrbits key="orbits" />,
    <DriveUploadMockup key="upload" indexing={dict.indexing} indexed={dict.indexed} fileProcessed={dict.fileProcessed} fileProcessing={dict.fileProcessing} />,
    <NotesMockup key="notes" noteTitle={dict.noteTitle} noteTags={dict.noteTags} saved={dict.saved} />,
  ];
  return (
    <section id="features" className="relative">
      {/* Hatched areas - full section height, positioned at inner line */}
      <div className="pointer-events-none absolute inset-y-0 left-6 hidden md:block w-14 text-foreground/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-6 hidden md:block w-14 text-foreground/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      {/* Vertical lines at grid edges (3rd lines) - full section height */}
      <div className="pointer-events-none absolute inset-y-0 left-4 md:left-20 w-px bg-border" />
      <div className="pointer-events-none absolute inset-y-0 right-4 md:right-20 w-px bg-border" />

      <div className="pt-12">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl px-4 text-center">
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-medium text-balance text-foreground leading-none" style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}>
            {dict.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground font-medium text-balance tracking-tight">
            {dict.description}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="relative mx-4 md:mx-20">

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-x border-border">
          {dict.items.map((feature, i) => (
            <div
              key={feature.title}
              className={`relative flex flex-col overflow-hidden aspect-auto min-h-[420px] sm:min-h-[450px] md:aspect-[554/496] md:min-h-0 ${
                i % 2 === 0 && i < dict.items.length - 1 ? "md:border-r border-border" : ""
              } ${i < dict.items.length - 1 ? "border-b border-border" : ""} ${
                i >= 2 ? "md:border-b-0" : ""
              }`}
            >
              {/* Visual area */}
              <div className="relative flex-1">{visuals[i]}</div>
              {/* Text area */}
              <div className="relative z-20 px-4 sm:px-6 pb-6 sm:pb-8 -mt-4">
                <h3 className="text-lg font-semibold tracking-tighter text-foreground" style={{ fontFamily: "var(--font-geist)" }}>{feature.title}</h3>
                <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
