import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── COLOUR TOKENS ───────────────────────────────────────────────────────────
// ─── COLOUR TOKENS ───────────────────────────────────────────────────────────
const GOLD   = "#C9A84C";
const GOLD2  = "#FFD980";
const SILVER = "#A8B8C8";
const SILV2  = "#D8E8F0";
const BG     = "#050505";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --gold: ${GOLD};
      --gold2: ${GOLD2};
      --silver: ${SILVER};
      --silv2: ${SILV2};
      --bg: ${BG};
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: #e0e0e0;
      font-family: 'Rajdhani', sans-serif;
      overflow-x: hidden;
      cursor: none;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0a0a0a; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, var(--gold), var(--silver)); border-radius: 2px; }

    .orbitron { font-family: 'Orbitron', monospace; }
    .rajdhani { font-family: 'Rajdhani', sans-serif; }

    .glow-gold { text-shadow: 0 0 20px ${GOLD}88, 0 0 40px ${GOLD}44; }
    .glow-silver { text-shadow: 0 0 20px ${SILVER}88, 0 0 40px ${SILVER}44; }
    .box-glow-gold { box-shadow: 0 0 20px ${GOLD}44, 0 0 60px ${GOLD}22, inset 0 0 20px ${GOLD}11; }
    .box-glow-silver { box-shadow: 0 0 20px ${SILVER}44, 0 0 60px ${SILVER}22, inset 0 0 20px ${SILVER}11; }

    .glass {
      background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(201,168,76,0.15);
    }
    .glass-silver {
      background: linear-gradient(135deg, rgba(168,184,200,0.06) 0%, rgba(168,184,200,0.02) 100%);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(168,184,200,0.15);
    }

    .grad-gold {
      background: linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .grad-silver {
      background: linear-gradient(135deg, ${SILVER} 0%, ${SILV2} 50%, ${SILVER} 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .grad-mix {
      background: linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 30%, ${SILV2} 70%, ${SILVER} 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }

    .scanlines::after {
      content: '';
      position: absolute; inset: 0;
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
      pointer-events: none;
    }

    @keyframes float-up {
      0%   { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.6; }
      100% { transform: translateY(-100vh) translateX(var(--drift)) scale(0.5); opacity: 0; }
    }
    .particle { animation: float-up var(--dur, 8s) var(--delay, 0s) infinite linear; }

    .accordion-content {
      max-height: 0; overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    .accordion-content.open { max-height: 300px; }

    .pricing-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .pricing-card:hover { transform: translateY(-8px); }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, ${GOLD}66, ${SILVER}66, transparent);
    }

    .nav-blur {
      background: rgba(5,5,5,0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(201,168,76,0.12);
    }

    .btn-gold {
      background: linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%);
      color: #050505;
      font-family: 'Orbitron', monospace;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border: none; cursor: pointer;
      transition: all 0.3s ease;
      position: relative; overflow: hidden;
    }
    .btn-gold::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, ${GOLD2} 0%, ${GOLD} 100%);
      opacity: 0; transition: opacity 0.3s;
    }
    .btn-gold:hover::after { opacity: 1; }
    .btn-gold:hover { box-shadow: 0 0 30px ${GOLD}88, 0 0 60px ${GOLD}44; }

    .btn-outline {
      background: transparent;
      color: ${SILVER};
      font-family: 'Orbitron', monospace;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border: 1px solid ${SILVER}66;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-outline:hover {
      border-color: ${SILVER};
      color: #fff;
      box-shadow: 0 0 20px ${SILVER}44;
      background: rgba(168,184,200,0.06);
    }

    .service-card {
      transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
      position: relative; overflow: hidden;
    }
    .service-card::before {
      content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 1px;
      background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
      transition: left 0.5s ease;
    }
    .service-card:hover::before { left: 100%; }
    .service-card:hover {
      transform: translateY(-6px);
      border-color: rgba(201,168,76,0.4) !important;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${GOLD}22;
    }

    .port-card { overflow: hidden; position: relative; cursor: pointer; }
    .port-card .overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.3) 60%, transparent 100%);
      opacity: 0; transition: opacity 0.4s ease;
    }
    .port-card:hover .overlay { opacity: 1; }
    .port-card .port-info {
      position: absolute; bottom: -60px; left: 0; right: 0; padding: 24px;
      transition: bottom 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    .port-card:hover .port-info { bottom: 0; }
    .port-card img, .port-card .mock-img {
      transition: transform 0.5s ease;
    }
    .port-card:hover img, .port-card:hover .mock-img { transform: scale(1.06); }

    .testi-card { transition: all 0.3s ease; }
    .testi-card:hover { transform: translateY(-4px); border-color: rgba(201,168,76,0.3) !important; }

    .faq-item { transition: all 0.3s ease; }
    .faq-item:hover { border-color: rgba(201,168,76,0.3) !important; }

    #cursor-dot { pointer-events: none; position: fixed; z-index: 9999; mix-blend-mode: screen; }
    #cursor-ring { pointer-events: none; position: fixed; z-index: 9998; mix-blend-mode: normal; }

    .wa-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 1000;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #25D366, #128C7E);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(37,211,102,0.4);
      cursor: pointer; transition: all 0.3s ease;
      text-decoration: none;
    }
    .wa-btn:hover { transform: scale(1.1); box-shadow: 0 6px 30px rgba(37,211,102,0.6); }

    .loading-bar {
      height: 2px;
      background: linear-gradient(90deg, ${GOLD}, ${GOLD2}, ${SILVER});
      animation: load-progress 2s ease-out forwards;
    }
    @keyframes load-progress { from { width: 0; } to { width: 100%; } }

    .grid-bg {
      background-image:
        linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    @keyframes dash-flow {
      to { stroke-dashoffset: -1000; }
    }
    .infinity-path { animation: dash-flow 8s linear infinite; }
  `}</style>
);

// ─── CUSTOM CURSOR ─────────────────────────────────────────────────────────────
const Cursor = () => {
  const dot  = useRef(null);
  const ring = useRef(null);
  const pos  = useRef({ x: 0, y: 0 });
  const rPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left  = e.clientX + "px";
        dot.current.style.top   = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      rPos.current.x = lerp(rPos.current.x, pos.current.x, 0.12);
      rPos.current.y = lerp(rPos.current.y, pos.current.y, 0.12);
      if (ring.current) {
        ring.current.style.left = rPos.current.x + "px";
        ring.current.style.top  = rPos.current.y + "px";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dot} style={{
        width: 8, height: 8,
        background: GOLD,
        borderRadius: "50%",
        transform: "translate(-50%,-50%)",
        boxShadow: `0 0 12px ${GOLD}`,
      }} />
      <div id="cursor-ring" ref={ring} style={{
        width: 32, height: 32,
        border: `1px solid ${GOLD}88`,
        borderRadius: "50%",
        transform: "translate(-50%,-50%)",
        transition: "none",
      }} />
    </>
  );
};

// ─── LOADING SCREEN ────────────────────────────────────────────────────────────
const Loading = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      style={{
        position: "fixed", inset: 0, background: BG, zIndex: 9997,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}
    >
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
        <svg width="160" height="80" viewBox="0 0 200 100">
          <defs>
            <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={GOLD} /><stop offset="100%" stopColor={SILVER} />
            </linearGradient>
          </defs>
          <path
            d="M 100 50 C 100 20, 60 0, 30 20 C 0 40, 0 60, 30 80 C 60 100, 100 80, 100 50 C 100 20, 140 0, 170 20 C 200 40, 200 60, 170 80 C 140 100, 100 80, 100 50"
            fill="none" stroke="url(#lg1)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray="60 20" className="infinity-path"
          />
        </svg>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="orbitron"
        style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.4em", marginTop: 24, marginBottom: 40 }}
      >
        THE ORIZON
      </motion.p>
      <div style={{ width: 200, height: 2, background: "#111", borderRadius: 2, overflow: "hidden" }}>
        <div className="loading-bar" style={{ width: 0, borderRadius: 2 }} />
      </div>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        style={{ color: "#444", fontSize: "0.65rem", letterSpacing: "0.2em", marginTop: 16, fontFamily: "Rajdhani, sans-serif" }}
      >
        INITIALIZING DIGITAL FUTURE
      </motion.p>
    </motion.div>
  );
};

// ─── FLOATING PARTICLES ────────────────────────────────────────────────────────
// রেন্ডারিংয়ের সময় purity বজায় রাখতে Math.random() লজিক কম্পোনেন্টের বাইরে নিয়ে আসা হলো
const staticParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  dur: `${Math.random() * 12 + 8}s`,
  delay: `${Math.random() * 10}s`,
  drift: `${(Math.random() - 0.5) * 120}px`,
  color: Math.random() > 0.5 ? GOLD : SILVER,
}));

const Particles = () => {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {staticParticles.map(p => (
        <div key={p.id} className="particle" style={{
          position: "absolute", bottom: "-10px", left: p.left,
          width: p.size, height: p.size,
          borderRadius: "50%",
          background: p.color,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          "--dur": p.dur, "--delay": p.delay, "--drift": p.drift,
        }} />
      ))}
    </div>
  );
};

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["About","Services","Portfolio","Pricing","Contact"];
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };
  return (
    <motion.nav
      initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 2.9 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5%", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
      className={scrolled ? "nav-blur" : ""}
    >
      <div className="orbitron" style={{ cursor: "pointer" }} onClick={() => scrollTo("hero")}>
        <span className="grad-gold" style={{ fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.25em" }}>
          THE ORIZON
        </span>
      </div>

      <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="desktop-nav">
        {NAV_LINKS.map(l => (
          <button key={l} onClick={() => scrollTo(l.toLowerCase())}
            className="orbitron"
            style={{
              background: "none", border: "none", color: SILVER, fontSize: "0.58rem",
              letterSpacing: "0.18em", cursor: "pointer", fontWeight: 600,
              textTransform: "uppercase", transition: "color 0.3s",
            }}
            onMouseEnter={e => e.target.style.color = GOLD}
            onMouseLeave={e => e.target.style.color = SILVER}
          >{l}</button>
        ))}
        <button className="btn-gold" style={{ padding: "10px 22px", borderRadius: 4 }}
          onClick={() => scrollTo("contact")}>
          Get Started
        </button>
      </div>

      <button onClick={() => setMenu(!menu)} style={{
        display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5,
      }} id="hamburger">
        {[0,1,2].map(i => <div key={i} style={{ width: 24, height: 2, background: GOLD }} />)}
      </button>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: "absolute", top: 70, left: 0, right: 0,
              background: "rgba(5,5,5,0.97)", backdropFilter: "blur(20px)",
              padding: "24px 5%", borderBottom: `1px solid ${GOLD}33`,
              display: "flex", flexDirection: "column", gap: 20,
            }}
          >
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}
                className="orbitron" style={{
                  background: "none", border: "none", color: SILVER, fontSize: "0.7rem",
                  letterSpacing: "0.18em", cursor: "pointer", fontWeight: 600,
                  textTransform: "uppercase", textAlign: "left",
                }}>{l}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          #hamburger { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  );
};

// ─── INFINITY HERO BG ──────────────────────────────────────────────────────────
const InfinityBg = () => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    {[1, 0.7, 0.5].map((scale, i) => (
      <svg key={i} width={700 * scale} height={350 * scale}
        viewBox="0 0 700 350"
        style={{ position: "absolute", opacity: 0.06 - i * 0.015 }}>
        <defs>
          <linearGradient id={`ig${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GOLD} />
            <stop offset="50%" stopColor={GOLD2} />
            <stop offset="100%" stopColor={SILVER} />
          </linearGradient>
        </defs>
        <path
          d="M 350 175 C 350 70, 210 0, 105 70 C 0 140, 0 210, 105 280 C 210 350, 350 280, 350 175 C 350 70, 490 0, 595 70 C 700 140, 700 210, 595 280 C 490 350, 350 280, 350 175"
          fill="none" stroke={`url(#ig${i})`} strokeWidth={8 + i * 4}
          strokeDasharray={i === 0 ? "80 30" : "none"}
          className={i === 0 ? "infinity-path" : ""}
        />
      </svg>
    ))}
    <div style={{
      position: "absolute", width: 400, height: 400, borderRadius: "50%",
      background: `radial-gradient(circle, ${GOLD}18 0%, transparent 70%)`,
      left: "20%", top: "50%", transform: "translate(-50%,-50%)",
    }} />
    <div style={{
      position: "absolute", width: 400, height: 400, borderRadius: "50%",
      background: `radial-gradient(circle, ${SILVER}12 0%, transparent 70%)`,
      right: "20%", top: "50%", transform: "translate(50%,-50%)",
    }} />
  </div>
);

// ─── HERO ──────────────────────────────────────────────────────────────────────
const Hero = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="hero" className="grid-bg scanlines" style={{
      position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "120px 5% 80px", overflow: "hidden",
    }}>
      <InfinityBg />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 900 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 3.2, ease: "easeOut" }}
          style={{ marginBottom: 32 }}
        >
          <svg width="120" height="60" viewBox="0 0 200 100">
            <defs>
              <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={GOLD} />
                <stop offset="100%" stopColor={SILVER} />
              </linearGradient>
            </defs>
            <path
              d="M 100 50 C 100 20, 60 0, 30 20 C 0 40, 0 60, 30 80 C 60 100, 100 80, 100 50 C 100 20, 140 0, 170 20 C 200 40, 200 60, 170 80 C 140 100, 100 80, 100 50"
              fill="none" stroke="url(#hg)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray="50 15" className="infinity-path"
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.4 }}
          className="orbitron"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}
        >
          <span className="grad-gold">Build Your</span>{" "}
          <span style={{ color: "#fff" }}>Digital</span>
          <br />
          <span className="grad-mix">Future With The Orizon</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.7, duration: 0.8 }}
          className="rajdhani"
          style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)", color: SILVER, letterSpacing: "0.2em", marginBottom: 48, fontWeight: 500 }}
        >
          Web Design &nbsp;•&nbsp; Development &nbsp;•&nbsp; Digital Marketing &nbsp;•&nbsp; Branding
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.9, duration: 0.7 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <button className="btn-gold" style={{ padding: "16px 40px", borderRadius: 4, position: "relative", zIndex: 1 }}
            onClick={() => scrollTo("contact")}>
            <span style={{ position: "relative", zIndex: 1 }}>Get Started</span>
          </button>
          <button className="btn-outline" style={{ padding: "16px 40px", borderRadius: 4 }}
            onClick={() => scrollTo("portfolio")}>
            View Portfolio
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5 }}
          style={{ marginTop: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <div style={{ width: 1, height: 60, background: `linear-gradient(180deg, transparent, ${GOLD})` }} />
          <p className="orbitron" style={{ color: `${GOLD}88`, fontSize: "0.5rem", letterSpacing: "0.3em" }}>SCROLL</p>
        </motion.div>
      </div>
    </section>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, direction = "up", ...props }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 40 : direction === "down" ? -40 : 0, x: direction === "left" ? 40 : direction === "right" ? -40 : 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.7, delay, ease: "easeOut" }} {...props}>
      {children}
    </motion.div>
  );
};

const About = () => (
  <section id="about" style={{ padding: "120px 8%", position: "relative" }}>
    <div className="divider" style={{ marginBottom: 80 }} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
      <FadeIn direction="right">
        <div style={{ position: "relative" }}>
          <div style={{
            width: "100%", aspectRatio: "4/3",
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a0a 100%)",
            borderRadius: 4, border: `1px solid ${GOLD}33`,
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            <svg width="300" height="240" viewBox="0 0 300 240">
              <defs>
                <radialGradient id="ag" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={GOLD} stopOpacity="0.3" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <circle cx="150" cy="120" r="80" fill="none" stroke={`${GOLD}44`} strokeWidth="1" />
              <circle cx="150" cy="120" r="55" fill="none" stroke={`${GOLD}33`} strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="150" cy="120" r="30" fill="url(#ag)" />
              {[0,45,90,135,180,225,270,315].map((angle, i) => (
                <line key={i}
                  x1={150} y1={120}
                  x2={150 + 80 * Math.cos(angle * Math.PI / 180)}
                  y2={120 + 80 * Math.sin(angle * Math.PI / 180)}
                  stroke={`${GOLD}22`} strokeWidth="1"
                />
              ))}
              <text x="150" y="125" textAnchor="middle" fill={GOLD} fontFamily="Orbitron" fontSize="11" fontWeight="700">ORIZON</text>
            </svg>
            {["top:0,left:0","top:0,right:0","bottom:0,left:0","bottom:0,right:0"].map((c,i) => {
              const pos = Object.fromEntries(c.split(",").map(x => x.split(":")));
              const isRight = pos.right !== undefined;
              const isBottom = pos.bottom !== undefined;
              return (
                <div key={i} style={{
                  position: "absolute", width: 20, height: 20,
                  borderTop: isBottom ? "none" : `1px solid ${GOLD}`,
                  borderBottom: isBottom ? `1px solid ${GOLD}` : "none",
                  borderLeft: isRight ? "none" : `1px solid ${GOLD}`,
                  borderRight: isRight ? `1px solid ${GOLD}` : "none",
                  top: pos.top ?? "auto", bottom: pos.bottom ?? "auto",
                  left: pos.left ?? "auto", right: pos.right ?? "auto",
                }} />
              );
            })}
          </div>
        </div>
      </FadeIn>

      <FadeIn direction="left" delay={0.2}>
        <p className="orbitron" style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.4em", marginBottom: 16 }}>ABOUT US</p>
        <h2 className="orbitron" style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 24 }}>
          <span className="grad-gold">We Engineer</span>{" "}
          <span style={{ color: "#fff" }}>Digital Excellence</span>
        </h2>
        <p className="rajdhani" style={{ color: "#aaa", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: 20, fontWeight: 400 }}>
          The Orizon is a premier digital agency where creativity meets technology. We transform ambitious brands into powerful digital experiences that captivate, convert, and endure. Our multidisciplinary team of designers, developers, and strategists bring a relentless pursuit of perfection to every project.
        </p>
        <p className="rajdhani" style={{ color: "#888", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: 36, fontWeight: 400 }}>
          From sleek web design to data-driven marketing campaigns, we build the digital infrastructure that powers tomorrow's market leaders. We don't just build websites — we engineer business growth engines.
        </p>
        <div style={{ display: "flex", gap: 40 }}>
          {[["50+","Projects"],["20+","Clients"],["95%","Satisfaction"]].map(([num, label]) => (
            <div key={label}>
              <div className="orbitron grad-gold" style={{ fontSize: "1.8rem", fontWeight: 900 }}>{num}</div>
              <div style={{ color: "#666", fontSize: "0.8rem", letterSpacing: "0.1em", fontFamily: "Rajdhani" }}>{label}</div>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
    <style>{`@media (max-width: 768px) { #about > div > div { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
  </section>
);

// ─── SERVICES ────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: "⬡", title: "Website Design", desc: "Pixel-perfect, conversion-optimised UI/UX that captivates users and communicates your brand story." },
  { icon: "⟨⟩", title: "Website Development", desc: "Blazing-fast, scalable web applications built with modern tech stacks and clean architecture." },
  { icon: "◎", title: "SEO Optimization", desc: "Data-driven SEO strategies that propel your brand to the top of search rankings organically." },
  { icon: "✦", title: "Social Media Marketing", desc: "Compelling content and growth strategies that build communities and drive real engagement." },
  { icon: "▣", title: "Meta Ads", desc: "Precision-targeted ad campaigns across Facebook & Instagram that maximise ROAS and scale revenue." },
  { icon: "◈", title: "Branding & Logo Design", desc: "Iconic brand identities crafted with purpose — visual systems that resonate and endure." },
  { icon: "◉", title: "E-commerce Solutions", desc: "Full-stack online stores with seamless UX, secure payments, and intelligent product experiences." },
  { icon: "⊞", title: "Landing Page Design", desc: "High-converting landing pages engineered to turn visitors into leads and customers." },
];

const Services = () => (
  <section id="services" style={{ padding: "120px 8%", position: "relative", background: "linear-gradient(180deg, #050505 0%, #080808 100%)" }}>
    <div className="divider" style={{ marginBottom: 80 }} />
    <div style={{ textAlign: "center", marginBottom: 70, maxWidth: 700, margin: "0 auto 70px" }}>
      <FadeIn>
        <p className="orbitron" style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.4em", marginBottom: 16 }}>WHAT WE DO</p>
        <h2 className="orbitron" style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)", fontWeight: 800, marginBottom: 20 }}>
          <span className="grad-mix">Our Services</span>
        </h2>
        <p className="rajdhani" style={{ color: "#888", fontSize: "1.05rem", lineHeight: 1.7 }}>
          End-to-end digital solutions engineered to elevate your brand and accelerate your growth.
        </p>
      </FadeIn>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
      {SERVICES.map((s, i) => (
        <FadeIn key={s.title} delay={i * 0.07}>
          <div className="glass service-card" style={{
            padding: "36px 28px", borderRadius: 6, border: `1px solid ${GOLD}18`,
            height: "100%",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: 20, color: i % 2 === 0 ? GOLD : SILVER }}>{s.icon}</div>
            <h3 className="orbitron" style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", marginBottom: 14, letterSpacing: "0.05em" }}>{s.title}</h3>
            <p className="rajdhani" style={{ color: "#888", fontSize: "0.95rem", lineHeight: 1.7, fontWeight: 400 }}>{s.desc}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ─── WHY CHOOSE US ────────────────────────────────────────────────────────────
const WHY = [
  { icon: "⬡", label: "Modern UI/UX",       desc: "Cutting-edge interfaces that wow and convert." },
  { icon: "⚡", label: "Fast Performance",   desc: "Lighthouse 95+ scores, lightning load times." },
  { icon: "◻", label: "Mobile Responsive",  desc: "Flawless across every device and screen size." },
  { icon: "◎", label: "SEO Friendly",       desc: "Built for discoverability from day one." },
  { icon: "◈", label: "Affordable Pricing", desc: "Premium quality at transparent, fair rates." },
  { icon: "◉", label: "24/7 Support",       desc: "Round-the-clock team always ready to assist." },
  { icon: "✦", label: "Creative Strategy",  desc: "Insight-driven campaigns that move markets." },
];

const WhyUs = () => (
  <section style={{ padding: "120px 8%" }}>
    <div className="divider" style={{ marginBottom: 80 }} />
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
      <FadeIn direction="right">
        <p className="orbitron" style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.4em", marginBottom: 16 }}>WHY ORIZON</p>
        <h2 className="orbitron" style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 24 }}>
          <span style={{ color: "#fff" }}>The Orizon</span>{" "}
          <span className="grad-silver">Advantage</span>
        </h2>
        <p className="rajdhani" style={{ color: "#888", fontSize: "1.05rem", lineHeight: 1.8 }}>
          We combine strategic thinking, technical mastery, and creative vision to deliver outcomes that matter. Every project is a partnership built on trust, transparency, and relentless ambition.
        </p>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {WHY.map((w, i) => (
          <FadeIn key={w.label} delay={i * 0.08}>
            <div className="glass" style={{
              padding: "22px 20px", borderRadius: 6, border: `1px solid ${i % 2 === 0 ? GOLD : SILVER}22`,
              transition: "all 0.3s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = (i % 2 === 0 ? GOLD : SILVER) + "66"}
              onMouseLeave={e => e.currentTarget.style.borderColor = (i % 2 === 0 ? GOLD : SILVER) + "22"}
            >
              <div style={{ fontSize: "1.3rem", marginBottom: 10, color: i % 2 === 0 ? GOLD : SILVER }}>{w.icon}</div>
              <div className="orbitron" style={{ fontSize: "0.62rem", fontWeight: 700, color: "#ddd", letterSpacing: "0.05em", marginBottom: 8 }}>{w.label}</div>
              <div className="rajdhani" style={{ color: "#666", fontSize: "0.85rem", fontWeight: 400 }}>{w.desc}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
    <style>{`@media (max-width: 768px) { #about ~ section > div { grid-template-columns: 1fr !important; } }`}</style>
  </section>
);

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
const CATS = ["All", "Websites", "Branding", "Social Media"];
const PROJECTS = [
  { title: "LuxeTech Solutions", cat: "Websites",     color: ["#1a0a00","#2a1500"], accent: GOLD },
  { title: "NovaBrand Identity", cat: "Branding",     color: ["#000a1a","#001525"], accent: SILVER },
  { title: "PulseMedia Socials", cat: "Social Media", color: ["#0a000a","#150015"], accent: "#C84CB4" },
  { title: "Apex Commerce",      cat: "Websites",     color: ["#0a0a00","#151500"], accent: GOLD2 },
  { title: "Stellar Corp Brand", cat: "Branding",     color: ["#001010","#002020"], accent: "#4CB8C4" },
  { title: "Vibe Campaign",      cat: "Social Media", color: ["#100010","#200020"], accent: "#E8A0FF" },
];

const Portfolio = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? PROJECTS : PROJECTS.filter(p => p.cat === active);
  return (
    <section id="portfolio" style={{ padding: "120px 8%", background: "#030303" }}>
      <div className="divider" style={{ marginBottom: 80 }} />
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <FadeIn>
          <p className="orbitron" style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.4em", marginBottom: 16 }}>OUR WORK</p>
          <h2 className="orbitron" style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)", fontWeight: 800, marginBottom: 40 }}>
            <span className="grad-gold">Portfolio</span>
          </h2>
        </FadeIn>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setActive(c)}
              className="orbitron"
              style={{
                padding: "10px 22px", borderRadius: 4, fontSize: "0.6rem", letterSpacing: "0.12em",
                cursor: "pointer", transition: "all 0.3s ease", fontWeight: 700,
                background: active === c ? `linear-gradient(135deg,${GOLD},${GOLD2})` : "transparent",
                color: active === c ? "#050505" : SILVER,
                border: `1px solid ${active === c ? "transparent" : `${SILVER}44`}`,
                boxShadow: active === c ? `0 0 20px ${GOLD}44` : "none",
              }}>{c}</button>
          ))}
        </div>
      </div>

      <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
        <AnimatePresence>
          {filtered.map((p, i) => (
            <motion.div key={p.title} layout
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, delay: i * 0.05 }}
              className="port-card" style={{ borderRadius: 6, border: `1px solid ${p.accent}22` }}
            >
              <div className="mock-img" style={{
                height: 220, borderRadius: 6,
                background: `linear-gradient(135deg, ${p.color[0]} 0%, ${p.color[1]} 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <svg width="120" height="60" viewBox="0 0 200 100" style={{ opacity: 0.6 }}>
                  <path
                    d="M 100 50 C 100 20, 60 0, 30 20 C 0 40, 0 60, 30 80 C 60 100, 100 80, 100 50 C 100 20, 140 0, 170 20 C 200 40, 200 60, 170 80 C 140 100, 100 80, 100 50"
                    fill="none" stroke={p.accent} strokeWidth="6" strokeLinecap="round"
                  />
                </svg>
                <div className="overlay" />
                <div className="port-info">
                  <div className="orbitron" style={{ color: p.accent, fontSize: "0.55rem", letterSpacing: "0.2em", marginBottom: 6 }}>{p.cat.toUpperCase()}</div>
                  <div className="orbitron" style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>{p.title}</div>
                  <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 8, fontFamily: "Rajdhani" }}>View Case Study →</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

// ─── STATS ────────────────────────────────────────────────────────────────────
const Counter = ({ target, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const dur = 2000, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      setCount(Math.floor(p * p * target));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const Stats = () => (
  <section style={{ padding: "100px 8%", background: `linear-gradient(135deg, #0a0800 0%, #050505 50%, #080a00 100%)` }}>
    <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40, textAlign: "center" }}>
      {[["50","+","Projects Delivered"],["20","+","Happy Clients"],["95","%","Client Satisfaction"]].map(([n, s, l]) => (
        <FadeIn key={l}>
          <div>
            <div className="orbitron grad-gold" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1 }}>
              <Counter target={parseInt(n)} suffix={s} />
            </div>
            <div className="rajdhani" style={{ color: SILVER, fontSize: "1rem", letterSpacing: "0.15em", marginTop: 12, textTransform: "uppercase" }}>{l}</div>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const TESTIS = [
  { name: "Rahul Mehta", role: "CEO, TechVentures", text: "The Orizon transformed our online presence completely. Our website traffic tripled within 3 months and the design is absolutely stunning.", stars: 5 },
  { name: "Priya Sharma", role: "Founder, LuxeRetail", text: "Working with The Orizon was a game-changer. Their Meta Ads strategy delivered a 6x ROAS and our e-commerce revenue shot up dramatically.", stars: 5 },
  { name: "Ahmed Al-Rashid", role: "Director, NovaCorp", text: "The branding work was phenomenal. They captured our vision perfectly and delivered an identity that truly represents who we are.", stars: 5 },
  { name: "Sarah Chen", role: "CMO, StartupHub", text: "From SEO to social media, The Orizon manages it all flawlessly. Our organic traffic grew 200% in six months. Absolute professionals.", stars: 5 },
];

const Stars = ({ n }) => (
  <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} style={{ color: GOLD, fontSize: "0.9rem" }}>★</span>
    ))}
  </div>
);

const Testimonials = () => (
  <section style={{ padding: "120px 8%" }}>
    <div className="divider" style={{ marginBottom: 80 }} />
    <div style={{ textAlign: "center", marginBottom: 70 }}>
      <FadeIn>
        <p className="orbitron" style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.4em", marginBottom: 16 }}>CLIENT REVIEWS</p>
        <h2 className="orbitron" style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)", fontWeight: 800 }}>
          <span className="grad-silver">Testimonials</span>
        </h2>
      </FadeIn>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
      {TESTIS.map((t, i) => (
        <FadeIn key={t.name} delay={i * 0.1}>
          <div className="glass testi-card" style={{
            padding: "32px", borderRadius: 6, border: `1px solid ${GOLD}15`, height: "100%",
          }}>
            <Stars n={t.stars} />
            <p className="rajdhani" style={{ color: "#bbb", fontSize: "1rem", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic", fontWeight: 400 }}>
              "{t.text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: `linear-gradient(135deg, ${GOLD} 0%, ${SILVER} 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Orbitron", fontWeight: 900, fontSize: "0.8rem", color: "#050505",
              }}>{t.name[0]}</div>
              <div>
                <div className="orbitron" style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>{t.name}</div>
                <div style={{ color: "#666", fontSize: "0.78rem", fontFamily: "Rajdhani", marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ─── PRICING ──────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Starter", price: "$299", period: "/month",
    accent: SILVER, border: `${SILVER}33`,
    features: ["5-Page Website","Basic SEO Setup","Mobile Responsive","1 Revision Round","Email Support","Google Analytics"],
    cta: "Get Started",
  },
  {
    name: "Business", price: "$699", period: "/month",
    accent: GOLD, border: `${GOLD}66`,
    popular: true,
    features: ["10-Page Website","Advanced SEO","Meta Ads Management","Social Media (3 platforms)","3 Revision Rounds","Priority Support","Monthly Report","Custom Animations"],
    cta: "Most Popular",
  },
  {
    name: "Premium", price: "$1,299", period: "/month",
    accent: GOLD2, border: `${GOLD2}44`,
    features: ["Unlimited Pages","Full SEO Suite","Meta + Google Ads","6 Social Platforms","E-commerce Integration","Unlimited Revisions","24/7 Dedicated Support","Custom Branding Kit","Landing Pages","Quarterly Strategy Call"],
    cta: "Go Premium",
  },
];

const Pricing = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="pricing" style={{ padding: "120px 8%", background: "#030303" }}>
      <div className="divider" style={{ marginBottom: 80 }} />
      <div style={{ textAlign: "center", marginBottom: 70 }}>
        <FadeIn>
          <p className="orbitron" style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.4em", marginBottom: 16 }}>INVEST IN GROWTH</p>
          <h2 className="orbitron" style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)", fontWeight: 800 }}>
            <span className="grad-gold">Pricing Plans</span>
          </h2>
        </FadeIn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
        {PLANS.map((p, i) => (
          <FadeIn key={p.name} delay={i * 0.1}>
            <div className="pricing-card" style={{
              padding: "40px 32px", borderRadius: 6, position: "relative",
              background: p.popular
                ? `linear-gradient(135deg, #120e00 0%, #0f0a00 100%)`
                : "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)",
              border: `1px solid ${p.border}`,
              boxShadow: p.popular ? `0 0 40px ${GOLD}22, 0 0 80px ${GOLD}11` : "none",
              height: "100%",
            }}>
              {p.popular && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
                  color: "#050505", fontFamily: "Orbitron", fontSize: "0.5rem", fontWeight: 900,
                  letterSpacing: "0.2em", padding: "5px 20px", borderRadius: 20,
                }}>MOST POPULAR</div>
              )}
              <div className="orbitron" style={{ color: p.accent, fontSize: "0.65rem", letterSpacing: "0.2em", marginBottom: 16, fontWeight: 700 }}>{p.name}</div>
              <div style={{ marginBottom: 32 }}>
                <span className="orbitron" style={{ color: "#fff", fontSize: "2.8rem", fontWeight: 900 }}>{p.price}</span>
                <span style={{ color: "#666", fontSize: "0.9rem", fontFamily: "Rajdhani" }}>{p.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ color: p.accent, fontSize: "0.7rem" }}>◆</span>
                    <span className="rajdhani" style={{ color: "#bbb", fontSize: "0.95rem", fontWeight: 400 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => scrollTo("contact")}
                style={{
                  width: "100%", padding: "14px", borderRadius: 4, cursor: "pointer",
                  fontFamily: "Orbitron", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em",
                  background: p.popular ? `linear-gradient(135deg, ${GOLD}, ${GOLD2})` : "transparent",
                  color: p.popular ? "#050505" : p.accent,
                  border: `1px solid ${p.border}`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => { if (!p.popular) { e.target.style.background = `${p.accent}15`; e.target.style.boxShadow = `0 0 20px ${p.accent}33`; } }}
                onMouseLeave={e => { if (!p.popular) { e.target.style.background = "transparent"; e.target.style.boxShadow = "none"; } }}
              >{p.cta}</button>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "How long does it take to build a website?", a: "Depending on complexity, most websites take 2–6 weeks. Simple landing pages can be completed in under a week, while full e-commerce platforms may take 4–8 weeks." },
  { q: "Do you offer post-launch support?", a: "Absolutely. All our plans include post-launch support. Our Premium plan offers 24/7 dedicated support with guaranteed response times." },
  { q: "Can you redesign my existing website?", a: "Yes, we specialise in redesigns. We analyse your current site's performance, identify opportunities, and deliver a modernised experience that converts better." },
  { q: "How do Meta Ads work with The Orizon?", a: "We handle everything from audience research and creative production to campaign management and optimisation. We provide transparent weekly reporting on performance." },
  { q: "Do you work with international clients?", a: "Yes, we work with clients globally. Our team is available across multiple time zones and we tailor strategies to local markets." },
  { q: "What makes The Orizon different from other agencies?", a: "We combine luxury-grade design aesthetics with performance-driven strategy. Every decision is rooted in data, and every pixel is placed with intention." },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "120px 8%" }}>
      <div className="divider" style={{ marginBottom: 80 }} />
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <FadeIn>
            <p className="orbitron" style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.4em", marginBottom: 16 }}>GOT QUESTIONS?</p>
            <h2 className="orbitron" style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)", fontWeight: 800 }}>
              <span className="grad-mix">FAQ</span>
            </h2>
          </FadeIn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((f, i) => (
            <FadeIn key={f.q} delay={i * 0.06}>
              <div className="faq-item" style={{
                border: `1px solid ${open === i ? GOLD + "44" : GOLD + "15"}`,
                borderRadius: 6, overflow: "hidden",
                background: open === i ? `linear-gradient(135deg, ${GOLD}08, transparent)` : "transparent",
                transition: "all 0.3s ease",
              }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{
                  width: "100%", padding: "22px 24px", background: "none", border: "none",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer",
                }}>
                  <span className="orbitron" style={{ color: open === i ? GOLD : "#ccc", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em", textAlign: "left" }}>{f.q}</span>
                  <span style={{ color: open === i ? GOLD : SILVER, fontSize: "1.2rem", flexShrink: 0, marginLeft: 16, transition: "transform 0.3s", transform: open === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </button>
                <div className={`accordion-content ${open === i ? "open" : ""}`}>
                  <p className="rajdhani" style={{ padding: "0 24px 22px", color: "#888", fontSize: "1rem", lineHeight: 1.7, fontWeight: 400 }}>{f.a}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const submit = () => { setSent(true); setTimeout(() => setSent(false), 4000); };

  const inputStyle = {
    width: "100%", padding: "14px 18px", borderRadius: 4,
    background: "rgba(255,255,255,0.03)", border: `1px solid ${GOLD}22`,
    color: "#ddd", fontFamily: "Rajdhani, sans-serif", fontSize: "1rem",
    outline: "none", transition: "border-color 0.3s",
  };

  return (
    <section id="contact" style={{ padding: "120px 8%", background: "#030303" }}>
      <div className="divider" style={{ marginBottom: 80 }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }}>
        <FadeIn direction="right">
          <p className="orbitron" style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.4em", marginBottom: 16 }}>REACH OUT</p>
          <h2 className="orbitron" style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 32 }}>
            <span className="grad-gold">Let's Build</span><br />
            <span style={{ color: "#fff" }}>Something Extraordinary</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { icon: "✉", label: "Email", val: "hello@theorizon.com" },
              { icon: "✆", label: "Phone", val: "+1 (555) 123-4567" },
              { icon: "⬡", label: "WhatsApp", val: "+1 (555) 987-6543" },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                  background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}08)`, border: `1px solid ${GOLD}33`,
                  fontSize: "1.1rem", color: GOLD,
                }} className="orbitron">{c.icon}</div>
                <div>
                  <div style={{ color: "#666", fontSize: "0.7rem", fontFamily: "Rajdhani", letterSpacing: "0.15em", marginBottom: 2 }}>{c.label}</div>
                  <div style={{ color: "#ddd", fontSize: "0.95rem", fontFamily: "Rajdhani" }}>{c.val}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
            {["IG","FB","TW","LI","YT"].map(s => (
              <div key={s} style={{
                width: 40, height: 40, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${GOLD}33`, color: GOLD, fontFamily: "Orbitron", fontSize: "0.5rem", cursor: "pointer",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${GOLD}22`; e.currentTarget.style.boxShadow = `0 0 15px ${GOLD}33`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
              >{s}</div>
            ))}
          </div>
        </FadeIn>

        <FadeIn direction="left" delay={0.2}>
          <div className="glass" style={{ padding: "48px 40px", borderRadius: 6, border: `1px solid ${GOLD}22` }}>
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: 20 }}>◉</div>
                <div className="orbitron grad-gold" style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12 }}>Message Sent!</div>
                <div className="rajdhani" style={{ color: "#888" }}>We'll get back to you within 24 hours.</div>
              </motion.div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", color: "#666", fontSize: "0.7rem", fontFamily: "Orbitron", letterSpacing: "0.15em", marginBottom: 8 }}>NAME</label>
                    <input name="name" value={form.name} onChange={handle} placeholder="John Doe"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = `${GOLD}66`}
                      onBlur={e => e.target.style.borderColor = `${GOLD}22`}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#666", fontSize: "0.7rem", fontFamily: "Orbitron", letterSpacing: "0.15em", marginBottom: 8 }}>EMAIL</label>
                    <input name="email" value={form.email} onChange={handle} placeholder="john@company.com"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = `${GOLD}66`}
                      onBlur={e => e.target.style.borderColor = `${GOLD}22`}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", color: "#666", fontSize: "0.7rem", fontFamily: "Orbitron", letterSpacing: "0.15em", marginBottom: 8 }}>SERVICE</label>
                  <select name="service" value={form.service} onChange={handle}
                    style={{ ...inputStyle, appearance: "none" }}
                    onFocus={e => e.target.style.borderColor = `${GOLD}66`}
                    onBlur={e => e.target.style.borderColor = `${GOLD}22`}
                  >
                    <option value="" style={{ background: "#0a0a0a" }}>Select a service...</option>
                    {SERVICES.map(s => <option key={s.title} value={s.title} style={{ background: "#0a0a0a" }}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: "#666", fontSize: "0.7rem", fontFamily: "Orbitron", letterSpacing: "0.15em", marginBottom: 8 }}>MESSAGE</label>
                  <textarea name="message" value={form.message} onChange={handle}
                    placeholder="Tell us about your project..."
                    rows={5} style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = `${GOLD}66`}
                    onBlur={e => e.target.style.borderColor = `${GOLD}22`}
                  />
                </div>
                <button className="btn-gold" onClick={submit} style={{ padding: "16px", borderRadius: 4, fontSize: "0.7rem" }}>
                  <span style={{ position: "relative", zIndex: 1 }}>SEND MESSAGE →</span>
                </button>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
      <style>{`@media (max-width: 768px) { #contact > div { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    padding: "60px 8% 30px",
    borderTop: `1px solid ${GOLD}22`,
    background: "#020202",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
      width: 400, height: 1,
      background: `linear-gradient(90deg, transparent, ${GOLD}88, ${SILVER}88, transparent)`,
    }} />
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 60 }}>
        <div>
          <div className="orbitron grad-gold" style={{ fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.25em", marginBottom: 16 }}>THE ORIZON</div>
          <p className="rajdhani" style={{ color: "#666", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 280, fontWeight: 400 }}>
            We engineer digital excellence for brands that refuse to settle for ordinary.
          </p>
        </div>
        {[
          { title: "Services", links: ["Web Design","Development","SEO","Meta Ads","Branding"] },
          { title: "Company",  links: ["About Us","Portfolio","Careers","Blog","Press"] },
          { title: "Connect",  links: ["Instagram","Facebook","Twitter","LinkedIn","YouTube"] },
        ].map(col => (
          <div key={col.title}>
            <div className="orbitron" style={{ color: GOLD, fontSize: "0.55rem", letterSpacing: "0.25em", marginBottom: 20, fontWeight: 700 }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map(l => (
                <span key={l} className="rajdhani" style={{
                  color: "#555", fontSize: "0.9rem", cursor: "pointer", transition: "color 0.2s", fontWeight: 400,
                }}
                  onMouseEnter={e => e.target.style.color = GOLD}
                  onMouseLeave={e => e.target.style.color = "#555"}
                >{l}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="divider" style={{ marginBottom: 24 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span className="rajdhani" style={{ color: "#444", fontSize: "0.85rem" }}>© 2026 The Orizon. All rights reserved.</span>
        <span className="rajdhani" style={{ color: "#333", fontSize: "0.85rem" }}>Engineered for the future.</span>
      </div>
    </div>
    <style>{`@media (max-width: 768px) { footer .footer-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
  </footer>
);

// ─── WHATSAPP FLOAT ───────────────────────────────────────────────────────────
const WAButton = () => (
  <a href="https://wa.me/15559876543" target="_blank" rel="noopener noreferrer" className="wa-btn">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>
);

// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <GlobalStyle />
      <AnimatePresence>
        {!loaded && <Loading onDone={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <>
          <Cursor />
          <Particles />
          <Navbar />
          <main>
            <Hero />
            <About />
            <Services />
            <WhyUs />
            <Portfolio />
            <Stats />
            <Testimonials />
            <Pricing />
            <FAQ />
            <Contact />
          </main>
          <Footer />
          <WAButton />
        </>
      )}
    </>
  );
}