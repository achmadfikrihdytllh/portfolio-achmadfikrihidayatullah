import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import bgVideo from "./assets/main1.mp4";
import icon1 from "./assets/icon1.png";
import icon2 from "./assets/icon2.png";
import icon3 from "./assets/icon3.png";
import mainm from "./assets/mainm.jpeg";
import mainm2 from "./assets/mainm2.jpeg";
import mainf from "./assets/mainf.jpeg";
import selectItemSound from "./assets/select_item.wav";
import backSound from "./assets/back_sound.wav";

function playSound(src) {
  const audio = new Audio(src);
  audio.play().catch(() => {});
}

const CHARS = [char1, char2, char3];
const MAIN_IMAGES = [mainm, mainm2, mainf];

const REVEAL_CONTENT = [
  {
    upper: ["ACHMAD FIKRI HIDAYATULLAH", "BACKEND DEVELOPER", "SUMENEP | UNIVERSITAS BRAWIJAYA"],
    lower: "D3 Vokasi Teknologi Informasi •  Web Development • API Integration",
  },
  {
    upper: [
      "ADONISJS • LARAVEL • REACT",
      "POSTGRESQL • MYSQL • TYPESCRIPT",
      "REST API • CMS • POSTMAN",
    ],
    lower: "Backend-first stack for production systems",
  },
  {
    upper: ["BACKEND DEVELOPER INTERN", "BATCH 7", "MAGANGHUB INTERN • BATCH 1 2025"],
    lower: "internship & professional milestones",
  },
];

const ROLES = [
  { text: "BACKEND", color: "#e8c100", bg: "rgba(232,193,0,0.12)", border: "rgba(232,193,0,0.5)" },
  { text: "STACK",  color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
  { text: "CERT",   color: "#e8c100", bg: "rgba(232,193,0,0.12)", border: "rgba(232,193,0,0.5)" },
];

const ITEMS = [
  {
    id: "profile", label: "PROFILE", handle: "@achmadfikrihdytllh", href: "https://github.com/achmadfikrihdytllh", icon: "👤", barIcon: icon1, bars: 1, newBars: [0], counts: ["01"],
    links: ["github.com/achmadfikrihdytllh"],
    stats: [
      { tag: "ROLE", value: "B/E", color: "#9147ff" },
      { tag: "LOC", value: "ID",  color: "#bf94ff" },
    ],
  },
  {
    id: "stack", label: "TECH STACK", handle: "backend / frontend", href: "https://www.linkedin.com/in/achmad-fikri-hidayatullah-380197250/", icon: "⚙️", barIcon: icon2, bars: 1, newBars: [0], counts: ["01"],
    links: ["www.linkedin.com/in/achmad-fikri-hidayatullah-380197250"],
    stats: [
      { tag: "API", value: "REST", color: "#e1306c" },
      { tag: "DB", value: "SQL",  color: "#f77737" },
    ],
  },
  {
    id: "achievements", label: "ACHIEVEMENTS", handle: "internship programs", href: "https://portfolio-p3r-fikuri.vercel.app", icon: "🏆", barIcon: icon3, bars: 1, newBars: [0], counts: ["01"],
    links: ["portfolio-p3r-fikuri.vercel.app"],
    stats: [
      { tag: "INTERN", value: "02", color: "#00f2ea" },
      { tag: "YEAR", value: "25",  color: "#ff0050" },
    ],
  },
];

export default function AboutMe() {
  const [active, setActive]   = useState(0);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") { playSound(selectItemSound); setActive(i => Math.max(0, i - 1)); }
      if (e.key === "ArrowDown") { playSound(selectItemSound); setActive(i => Math.min(ITEMS.length - 1, i + 1)); }
      if (e.key === "Enter") { playSound(selectItemSound); setRevealed(r => !r); }
      if (e.key === "ArrowRight") { playSound(selectItemSound); setRevealed(true); }
      if (e.key === "ArrowLeft") {
        if (revealed) { playSound(backSound); setRevealed(false); }
        else { playSound(backSound); navigate(-1); }
      }
      if (e.key === "Escape" || e.key === "Backspace") { playSound(backSound); navigate(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, revealed]);

  const handleBarActivate = (i) => {
    playSound(selectItemSound);
    if (revealed && active === i) {
      setRevealed(false);
    } else {
      setActive(i);
      setRevealed(true);
    }
  };

  return (
    <div id="menu-screen">
      <video src={bgVideo} autoPlay loop muted playsInline />
      {revealed && <div key={`dim-${active}`} className="sc-dim" />}
      {revealed && (
        <div key={`panel-${active}`} className={`sc-reveal-panel${mounted ? " mounted" : ""}`}>
          <div className="sc-reveal-upper-bar">
            {REVEAL_CONTENT[active].upper.map((line) => (
              <div className="sc-reveal-upper-line" key={line}>{line}</div>
            ))}
          </div>
          <div className="sc-reveal-lower-bar">{REVEAL_CONTENT[active].lower}</div>
        </div>
      )}
      {revealed && (
        <div key={`nav-${active}`} className="sc-right-nav">
          <span className="sc-nav-arrow left">◄</span>
          <span className="sc-nav-btn">LB</span>
          <span className="sc-nav-dot" />
          <span className="sc-nav-btn">RB</span>
          <span className="sc-nav-arrow right">►</span>
        </div>
      )}
      {revealed && (
        <div key={`portrait-${active}`} className={`sc-main-portrait-shell${mounted ? " mounted" : ""}`}>
          <img
            className="sc-main-portrait"
            src={MAIN_IMAGES[active]}
            alt=""
          />
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,700;1,700&family=Montserrat:wght@300&display=swap');

        /* FIX: 100vh di HP asli dihitung termasuk area address bar yang
           collapse/muncul, jadi konten kepotong & area di bawah nggak
           bisa di-tap. 100dvh nyesuain ke tinggi layar yang keliatan
           beneran. overflow-y:auto sebagai fallback biar tetap bisa
           di-scroll kalau ada browser lama yang belum support dvh. */
        #menu-screen {
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sc-root {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 6px;
          padding-left: 0;
        }

        .sc-dim {
          position: absolute;
          inset: 0;
          z-index: 12;
          background: rgba(40, 45, 54, 0.68);
          pointer-events: none;
          animation: sc-dim-in 0.32s ease-out;
        }

        @keyframes sc-dim-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes sc-reveal-bar-in {
          0% {
            opacity: 0;
            transform: translateX(-120px) rotate(-20deg) scaleX(0.72);
          }
          60% {
            opacity: 0.96;
            transform: translateX(18px) rotate(-20deg) scaleX(1.03);
          }
          100% {
            opacity: 0.92;
            transform: translateX(0) rotate(-20deg) scaleX(1);
          }
        }

        @keyframes sc-portrait-in {
          0% {
            opacity: 0;
            transform: translateX(78px) skewX(-8deg) scale(0.94);
            filter: blur(8px);
          }
          55% {
            opacity: 0.9;
            transform: translateX(-8px) skewX(-8deg) scale(1.015);
            filter: blur(0);
          }
          100% {
            opacity: 0.96;
            transform: translateX(0) skewX(-8deg) scale(1);
            filter: blur(0);
          }
        }

        @keyframes sc-arrow-left {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-5px); opacity: 0.4; }
        }

        @keyframes sc-arrow-right {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(5px); opacity: 0.4; }
        }

        .sc-main-portrait-shell {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 13;
          pointer-events: none;
          width: 34vw;
          height: 82vh;
          overflow: hidden;
          opacity: 0;
          transform: translateX(20px) skewX(-8deg) scale(0.98);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .sc-main-portrait-shell.mounted {
          opacity: 0.96;
          transform: translateX(0) skewX(-8deg) scale(1);
          animation: sc-portrait-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sc-reveal-panel {
          position: absolute;
          top: 36vh;
          left: -2vw;
          width: 74vw;
          height: 42vh;
          z-index: 12;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(243,246,252,0.98) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 62px) 100%, 0 100%);
          box-shadow:
            0 0 0 2px rgba(255,255,255,0.18),
            14px 0 0 rgba(215, 13, 44, 0.82),
            22px 0 0 rgba(255,255,255,0.26);
          opacity: 0;
          transform: translateX(-28px) rotate(-16deg);
          transform-origin: left bottom;
          transition: opacity 0.3s ease, transform 0.35s ease;
        }
        .sc-reveal-panel.mounted {
          opacity: 0.92;
          transform: translateX(0) rotate(-16deg);
          animation: sc-reveal-bar-in 0.46s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-reveal-panel::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(180deg, #e03d31 0%, #eb3333 100%);
          clip-path: inherit;
        }
        .sc-reveal-upper-bar {
          position: absolute;
          top: 9%;
          left: 0%;
          width: 100%;
          height: 38%;
          background: rgba(0, 0, 0, 0.92);
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #fff;
          text-align: center;
        }
        .sc-reveal-upper-line {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 15px;
          letter-spacing: 0.5px;
          line-height: 1.15;
        }
        .sc-reveal-lower-bar {
          position: absolute;
          top: 55%;
          right: 0;
          width: 42%;
          height: 18%;
          background: rgba(0, 0, 0, 0.92);
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 16px;
          letter-spacing: 0.4px;
          text-transform: lowercase;
          padding-left: 22px;
        }

        @keyframes sc-right-nav-pop {
          0%   { opacity: 0; transform: scale(0.55) translateY(-10px); }
          65%  { opacity: 1; transform: scale(1.1) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sc-right-nav {
          position: absolute;
          top: 8vh;
          left: 4vw;
          display: flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
          z-index: 14;
          transform: translateX(-40px) rotate(-20deg);
          transform-origin: left bottom;
          animation: sc-right-nav-pop 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sc-right-nav .sc-nav-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px;
          letter-spacing: 3px;
          line-height: 1;
          user-select: none;
          color: #fff;
          -webkit-text-stroke: 2px #000;
          paint-order: stroke fill;
          background: none;
          border: none;
          padding: 0 6px;
        }
        .sc-right-nav .sc-nav-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #111;
          margin: 0 10px;
          flex-shrink: 0;
        }
        .sc-right-nav .sc-nav-arrow {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          color: #c4001a;
          display: inline-block;
          user-select: none;
        }
        .sc-right-nav .sc-nav-arrow.left  { animation: sc-arrow-left  0.8s ease-in-out infinite; }
        .sc-right-nav .sc-nav-arrow.right { animation: sc-arrow-right 0.8s ease-in-out infinite; }

        .sc-main-portrait {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: top right;
          transform: skewX(8deg);
          transform-origin: top right;
        }

        /* ── Each bar ── */
        .sc-bar {
          position: relative;
          width: 45vw;
          height: 64px;
          transition: height 0.3s cubic-bezier(0.22,1,0.36,1);
          background: #111;
          cursor: pointer;
          pointer-events: all;
          touch-action: manipulation;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: 0 6px 24px rgba(0,0,0,0.65);
          z-index: 1;
          overflow: hidden; /* FIX: keeps the rotated .sc-role text clipped inside the bar */
        }

        /* wrapper holds both the red underlay and the bar */
        .sc-bar-outer {
          position: relative;
          flex-shrink: 0;
          transform: translateX(-100%);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: all;
        }
        .sc-bar-outer.active .sc-bar     { height: 90px; }
        .sc-bar-outer.active .sc-bar-red { height: 90px; }
        .sc-bar-outer.mounted { transform: translateX(0); }
        .sc-bar-outer:nth-child(1) { transition-delay: 0ms; }
        .sc-bar-outer:nth-child(2) { transition-delay: 80ms; }
        .sc-bar-outer:nth-child(3) { transition-delay: 160ms; }

        /* red underlay — peeks out below the bar when active */
        .sc-bar-red {
          position: absolute;
          top: 0; left: 0;
          width: 45vw;
          height: 64px;
          background: #c4001a;
          clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
          transform: translateY(-7px);
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }
        .sc-bar-outer.active .sc-bar-red { opacity: 1; }

        /* white fill — skewed parallelogram on the right 25% */
        .sc-bar-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          background: #ffffff;
          clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
          transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }
        .sc-bar-outer.active .sc-bar-fill {
          clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
        }

        /* shade on the left edge of the white fill */
        .sc-bar-shade {
          position: absolute;
          top: 0; bottom: 0;
          left: 73%;
          width: 6%;
          background: linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 100%);
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .sc-bar-outer.active .sc-bar-shade { opacity: 1; }

        /* bottom shadow line under each bar */
        .sc-bar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
          z-index: 10;
          pointer-events: none;
        }

        /* content layout inside each bar */
        .sc-bar-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px 0 20px;
        }

        /* left: role label */
        .sc-role {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          font-family: 'Anton', sans-serif;
          font-size: 50px;
          letter-spacing: -2px;
          color: #ffffff;
          transform: rotate(-30deg);
          user-select: none;
          line-height: 1;
          padding: 0 16px 0 8px;
        }

        /* left: icon + name centered in remaining space */
        .sc-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding-left: 78px;
        }
        .sc-main-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sc-icon {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          width: 32px;
          text-align: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.15);
          transition: color 0.2s ease;
          user-select: none;
        }
        .sc-bar-outer.active .sc-icon { color: rgba(255,255,255,0.25); }

        .sc-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 4px;
          line-height: 1;
          color: rgba(255,255,255,0.85);
          transition: color 0.2s ease;
          user-select: none;
        }
        .sc-bar-outer.active .sc-label { color: #111111; }

        /* right: stats group */
        .sc-stats {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 24px;
          flex-shrink: 0;
        }

        .sc-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .sc-stat-top {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .sc-stat-tag {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 9px;
          letter-spacing: 1.5px;
          padding: 1px 4px;
          border-width: 1px;
          border-style: solid;
          line-height: 1.4;
          user-select: none;
        }

        .sc-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          font-style: italic;
          line-height: 1;
          color: #ffffff;
          letter-spacing: 1px;
          user-select: none;
          transition: color 0.2s ease;
        }
        .sc-bar-outer.active .sc-stat-num { color: #111111; }

        .sc-stat-bars {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-top: 2px;
        }
        .sc-stat-bar-color {
          height: 3px;
          width: 100%;
        }
        .sc-stat-bar-black {
          height: 2px;
          width: 100%;
          background: #000;
        }

        /* character portrait */
        .sc-char {
          position: absolute;
          top: 0;
          left: 110px;
          height: 100%;
          width: auto;
          max-width: 160px;
          object-fit: cover;
          object-position: top;
          pointer-events: none;
          z-index: 3;
          clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
        }

        /* footer hints */
        .sc-footer {
          position: fixed;
          bottom: 20px; right: 28px;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 14;
          opacity: 0;
          transition: opacity 0.4s ease 0.6s;
        }
        .sc-footer.mounted { opacity: 1; }
        .sc-footer-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.22);
        }
        .sc-footer-key {
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
        }

        @media (max-width: 768px) {
          .sc-bar-outer {
            width: 100%;
          }

          .sc-bar {
            width: 90vw;
            height: 52px;
          }
          .sc-bar-outer.active .sc-bar { height: 68px; }

          .sc-bar-red {
            width: 90vw;
            height: 52px;
          }
          .sc-bar-outer.active .sc-bar-red { height: 68px; }

          .sc-role {
            font-size: 26px;
            letter-spacing: -1px;
            padding: 0 8px 0 4px;
          }

          .sc-char {
            left: 60px;
            max-width: 90px;
          }

          .sc-main {
            padding-left: 40px;
          }

          .sc-label {
            font-size: 18px;
            letter-spacing: 2px;
          }

          .sc-icon {
            font-size: 16px;
            width: 20px;
          }

          .sc-main-portrait-shell {
            width: 30vw;
            height: 32vh;
          }

          .sc-reveal-panel {
            top: 40vh;
            left: 50%;
            width: 92vw;
            height: 28vh;
            transform: translateX(-50%) rotate(-12deg);
          }

          .sc-reveal-panel.mounted {
            transform: translateX(-50%) rotate(-12deg);
          }

          .sc-reveal-upper-bar {
            top: 9%;
            height: 42%;
            gap: 4px;
            padding: 0 70px 0 8px;
          }

          .sc-reveal-upper-line {
            font-size: 9px;
            line-height: 1.3;
          }

          .sc-reveal-lower-bar {
            top: 58%;
            width: 50%;
            height: 18%;
            font-size: 9px;
            line-height: 1.25;
            padding-left: 10px;
          }

          /* FIX: disable the pop-in animation on mobile so this static
             override actually takes effect (animation with fill-mode
             "both" otherwise overrides any transform set outside it) */
          .sc-right-nav {
            animation: none;
            top: 2vh;
            left: auto;
            right: 3vw;
            transform: scale(0.45);
            transform-origin: top right;
          }

          .sc-footer {
            bottom: 12px;
            right: 12px;
          }

          .sc-footer-row {
            font-size: 10px;
          }

          .sc-footer-key {
            font-size: 9px;
            padding: 1px 4px;
          }
        }
      `}</style>

      <div className="sc-root" role="navigation">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`sc-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            onMouseEnter={() => setActive(i)}
          >
            <div className="sc-bar-red" />
            <div
              className="sc-bar"
              onClick={() => handleBarActivate(i)}
            >
              <img className="sc-char" src={CHARS[i]} alt="" />
              <div className="sc-bar-fill" />
              <div className="sc-bar-shade" />
              <div className="sc-bar-content">
                <div className="sc-role">{ROLES[i].text}</div>
                <div className="sc-main">
                  <div className="sc-main-top">
                    <div className="sc-label">{item.label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`sc-footer${mounted ? " mounted" : ""}`}>
        <div className="sc-footer-row"><span className="sc-footer-key">↑↓</span><span>SELECT</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">↵</span><span>REVEAL</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">ESC</span><span>BACK</span></div>
      </div>
    </div>
  );
}