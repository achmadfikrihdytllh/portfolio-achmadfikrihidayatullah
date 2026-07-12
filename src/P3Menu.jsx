import { useState, useEffect, useMemo } from "react";
import detailMenuSound from "./assets/detail_menu.wav";
import selectItemSound from "./assets/select_item.wav";

function playSound(src) {
  const audio = new Audio(src);
  audio.play().catch(() => {});
}

const ITEMS = [
  { id: "about",   label: "ABOUT ME",      page: "about",   fontSize: 80, offsetX: 0,  offsetY: 0,  skew: -6,  skewY: 10  },
  { id: "resume",  label: "RESUME",        page: "resume",  fontSize: 66, offsetX: 20, offsetY: 8,  skew: -11, skewY: -10 },
  { id: "github",  label: "GITHUB LINK",   page: "https://github.com/achmadfikrihdytllh",  fontSize: 68, offsetX: 8, offsetY: 6,  skew: 0, skewY: -4  },
  { id: "socials", label: "SOCIALS",       page: "socials", fontSize: 74, offsetX: 16, offsetY: 8,  skew: -3,  skewY: 5   },
  { id: "sideproj",label: "SIDE PROJECTS", page: "sideproj",fontSize: 56, offsetX: 10, offsetY: 6,  skew: -4,  skewY: 7   },
];

const CLIP_SHAPES = [
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
];

// --- Breakpoint referensi untuk scaling ---
// Di atas 1000px -> ukuran penuh (scale 1)
// Di 360px (HP kecil) -> scale minimum 0.34
// Di antaranya -> interpolasi linear
const REF_MAX_W = 1000;
const REF_MIN_W = 360;
const SCALE_MIN = 0.34;

function getScale(width) {
  if (width >= REF_MAX_W) return 1;
  if (width <= REF_MIN_W) return SCALE_MIN;
  const t = (width - REF_MIN_W) / (REF_MAX_W - REF_MIN_W);
  return SCALE_MIN + (1 - SCALE_MIN) * t;
}

// Khusus mobile: scale dihitung dari lebar label TERPANJANG (misal "GITHUB LINK")
// supaya teks otomatis mengisi lebar layar HP (Android/iOS) semaksimal mungkin,
// bukan cuma interpolasi angka tetap yang bisa kekecilan di device tertentu.
function getMobileScale(viewportWidth, maxDesignWidth) {
  const usableWidth = viewportWidth * 0.85 - 32; // sisakan sedikit padding kiri-kanan
  const raw = usableWidth / maxDesignWidth;
  return Math.min(1.05, Math.max(0.5, raw));
}

export default function P3Menu({ onNavigate }) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [viewportW, setViewportW] = useState(
    typeof window !== "undefined" ? window.innerWidth : REF_MAX_W
  );

  const isMobile = viewportW <= 768;

  // Lebar desain (di scale=1) dari label terpanjang, dipakai sebagai acuan
  // supaya scale mobile pas mengisi lebar layar tanpa perlu diketik manual.
  const maxDesignWidth = useMemo(
    () => Math.max(...ITEMS.map(it => it.label.length * it.fontSize * 0.6 + 80)),
    []
  );

  const scale = isMobile ? getMobileScale(viewportW, maxDesignWidth) : getScale(viewportW);

  const activate = (idx) => {
    setActive(idx);
    setAnimKey(k => k + 1);
  };

  // FIX: sebelumnya kode manggil selectItem(item.page) di onClick/onTouchStart
  // padahal fungsi itu tidak pernah didefinisikan di mana pun di komponen ini.
  // Akibatnya setiap tap/klik langsung throw ReferenceError dan event berhenti
  // di situ, jadi menu terlihat "tidak bisa ditekan" (khususnya kerasa di HP
  // karena user tidak buka console buat lihat errornya).
  // Sekarang dipusatkan lewat satu fungsi yang manggil onNavigate (prop yang
  // sama dipakai keyboard handler Enter), plus play sound & set active state.
  const goTo = (idx) => {
    playSound(detailMenuSound);
    activate(idx);
    onNavigate?.(ITEMS[idx].page);
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp")   { playSound(selectItemSound); activate(Math.max(0, active - 1)); }
      if (e.key === "ArrowDown") { playSound(selectItemSound); activate(Math.min(ITEMS.length - 1, active + 1)); }
      if (e.key === "Enter")     { goTo(active); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onNavigate]);

  useEffect(() => {
    let rAF = null;
    const onResize = () => {
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => setViewportW(window.innerWidth));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rAF) cancelAnimationFrame(rAF);
    };
  }, []);

  return (
    <>
      <style>{`
        /* FIX: container utama (#menu-screen ada di komponen parent, tapi
           style tag React ini tidak di-scope jadi bisa nimpa dari sini).
           100vh di HP asli dihitung TERMASUK area address bar yang bisa
           collapse/muncul, jadi konten sering kepotong padahal sebenarnya
           lebih tinggi dari yang keliatan. 100dvh ngikutin tinggi layar
           yang BENERAN keliatan. overflow-y:auto sebagai jaring pengaman
           supaya tetap bisa discroll kalau di HP tertentu masih kurang. */
        #menu-screen {
          height: 100vh;
          height: 100dvh;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .p3-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding-left: clamp(20px, 6vw, 64px);
          padding-bottom: 5px;
          pointer-events: none;
          overflow: visible;
        }

        .p3-stripe  { position:absolute; right:0; top:0; bottom:0; width:5px; background:#c4001a; z-index:10; pointer-events:none; }
        .p3-stripe2 { position:absolute; right:9px; top:0; bottom:0; width:2px; background:rgba(245,122,139,0.22); z-index:10; pointer-events:none; }

        .p3-menu {
          position: relative;
          z-index: 20;
          padding: clamp(16px, 5vw, 48px);
          padding-right: clamp(24px, 6vw, 48px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          pointer-events: all;
          max-width: 100%;
          box-sizing: border-box;
        }

        .p3-row {
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          line-height: 1;
          text-decoration: none;
          opacity: 0;
          transform: translateX(36px);
          transition: opacity 0.38s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1);
          max-width: 100%;
          touch-action: manipulation;
        }
        .p3-row.mounted {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        .p3-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 120%; height: 200%;
          background: radial-gradient(ellipse at center, rgba(255,100,180,0.35) 0%, transparent 70%);
          filter: blur(18px);
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .p3-row.active .p3-glow { opacity: 1; }

        .p3-skew-wrap {
          position: relative;
          display: flex;
          align-items: center;
          isolation: isolate;
          max-width: 100%;
        }

        @keyframes p3-shadow-pop {
          0%   { transform: translateY(-40%) translateX(-12px) scaleX(0) scaleY(1); }
          55%  { transform: translateY(-46%) translateX(-15px) scaleX(1.22) scaleY(1.18); }
          75%  { transform: translateY(-39%) translateX(-11px) scaleX(0.96) scaleY(0.97); }
          100% { transform: translateY(-40%) translateX(-12px) scaleX(1) scaleY(1); }
        }

        .p3-shadow-tri {
          position: absolute;
          top: 50%;
          transform-origin: left center;
          background: rgba(235, 80, 120, 0.85);
          z-index: 1;
          pointer-events: none;
          transform: translateY(-40%) translateX(-12px) scaleX(0);
          transition: transform 0.18s ease;
        }
        .p3-shadow-tri.pop {
          animation: p3-shadow-pop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .p3-highlight {
          position: absolute;
          top: 50%;
          transform-origin: left center;
          background: #ffffff;
          z-index: 2;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
        }

        .p3-label-wrap {
          position: relative;
          z-index: 3;
          max-width: 100%;
        }

        .p3-label-base {
          font-family: 'Anton', sans-serif;
          font-style: italic;
          line-height: 0.85;
          display: block;
          white-space: nowrap;
          user-select: none;
        }

        .p3-label-dark {
          color: #3ce2ff;
          transition: color 0.12s ease;
        }
        .p3-row.active .p3-label-dark { color: #6b0010; }
        .p3-row:hover:not(.active) .p3-label-dark { color: #00d9ff; }

        .p3-label-bright {
          color: #ff2a2a;
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.12s ease;
        }
        .p3-row.active .p3-label-bright { opacity: 1; }

        .p3-hint {
          position: absolute;
          bottom: clamp(10px, 2.5vw, 24px);
          right: clamp(12px, 3vw, 28px);
          z-index: 20;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Anton', sans-serif;
          opacity: 0;
          transition: opacity 0.5s ease 0.9s;
        }
        .p3-hint.mounted { opacity: 1; }
        .p3-hint-row {
          display: flex; align-items: center; gap: 6px;
          font-size: clamp(9px, 2vw, 13px);
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.28);
        }
        .p3-hint-key {
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 3px;
          padding: 1px 5px;
          font-size: clamp(8px, 1.6vw, 11px);
        }

        .p3-name-tag {
          position: absolute;
          top: clamp(8px, 2vw, 18px);
          left: clamp(10px, 2.5vw, 22px);
          z-index: 20;
          font-family: 'Anton', sans-serif;
          font-style: italic;
          font-size: clamp(36px, 10vw, 108px);
          line-height: 0.88;
          letter-spacing: 2px;
          color: rgba(10, 10, 14, 0.64);
          transform: rotate(18deg);
          transform-origin: left top;
          user-select: none;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .p3-name-tag span:first-child {
          color: rgba(0, 0, 0, 0.86);
        }

        @media (max-width: 480px) {
          .p3-overlay {
            padding-left: 16px;
            padding-bottom: 10px;
          }
          .p3-menu { padding: 12px 16px 12px 12px; }
        }

        /* ===== MODE MOBILE ===== */
        @media (max-width: 768px) {
          .p3-overlay {
            align-items: flex-end;
            justify-content: flex-start;
            padding-left: 12px;
            padding-bottom: 12px;
            /* FIX: sebelumnya overflow:hidden bikin item menu yang
               kepotong di layar pendek jadi tidak bisa dijangkau sama
               sekali. Sekarang bisa discroll & disentuh kalau perlu. */
            overflow-y: auto;
            pointer-events: auto;
            -webkit-overflow-scrolling: touch;
          }

          .p3-menu {
            align-items: flex-start;
            padding: 12px 16px 24px 12px;
          }

          .p3-row {
            justify-content: flex-start;
          }

          /* Hint navigasi & name-tag dibuat tidak mengganggu area menu */
          .p3-name-tag {
            top: 12px;
            left: 12px;
          }
        }

        /* Background video: di mobile hanya bagian KIRI gambar (kepala Aigis)
           yang ditonjolkan, supaya tidak crop di tengah badan/senjata.
           Angka object-position bisa disesuaikan lagi kalau belum pas. */
        @media (max-width: 768px) {
          #menu-screen video {
            object-position: 15% 30%;
          }
        }
      `}</style>

      <div className="p3-overlay">
        <div className="p3-name-tag">
        </div>
        <div className="p3-stripe" />
        <div className="p3-stripe2" />

        <nav className="p3-menu">
          {ITEMS.map((item, i) => {
            const isActive = active === i;
            const dist = Math.abs(i - active);
            const opacity = isActive ? 1 : Math.max(0.5, 1 - dist * 0.2);
            const clipFn = CLIP_SHAPES[i] ?? CLIP_SHAPES[0];

            // Ukuran & offset yang sudah di-scale sesuai lebar viewport
            const scaledFontSize = item.fontSize * scale;
            // Di mobile, offset zigzag (offsetX/offsetY) di-nol-kan supaya
            // tiap baris center dengan rapi, bukan geser-geser tidak rata.
            const scaledOffsetX = isMobile ? 0 : item.offsetX * scale;
            const scaledOffsetY = isMobile ? 0 : item.offsetY * scale;
            const scaledLetterSpacing = Math.max(0.5, 2 * scale);

            // estW/estH DIHITUNG DARI UKURAN YANG SUDAH DI-SCALE
            // supaya clip-path shadow & highlight tetap pas menempel di teks
            const estW = item.label.length * scaledFontSize * 0.6 + 80 * scale;
            const estH = scaledFontSize * 0.94;

            return (
              <a
                key={item.id}
                href="#"
                className={`p3-row ${isActive ? "active" : ""} ${mounted ? "mounted" : ""}`}
                style={{
                  marginRight: scaledOffsetX,
                  marginTop: scaledOffsetY,
                  transitionDelay: mounted ? `${i * 80}ms` : "0ms",
                }}
                onClick={(e) => { e.preventDefault(); goTo(i); }}
                onTouchStart={(e) => { e.preventDefault(); goTo(i); }}
                onMouseEnter={() => activate(i)}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="p3-glow" />
                <div
                  className="p3-skew-wrap"
                  style={{ transform: `skewX(${item.skew}deg) skewY(${item.skewY}deg)` }}
                >
                  <div
                    key={isActive ? `pop-${i}-${animKey}` : `idle-${i}`}
                    className={`p3-shadow-tri${isActive ? ' pop' : ''}`}
                    style={{
                      width: estW,
                      height: estH,
                      clipPath: clipFn(estW, estH),
                    }}
                  />
                  <div
                    className="p3-highlight"
                    style={{
                      width: estW,
                      height: estH,
                      clipPath: clipFn(estW, estH),
                      transform: `translateY(-50%) scaleX(${isActive ? 1 : 0})`,
                    }}
                  />
                  <div className="p3-label-wrap" style={{ opacity }}>
                    <span
                      className="p3-label-base p3-label-dark"
                      style={{ fontSize: scaledFontSize, letterSpacing: scaledLetterSpacing }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="p3-label-base p3-label-bright"
                      style={{
                        fontSize: scaledFontSize,
                        letterSpacing: scaledLetterSpacing,
                        clipPath: clipFn(estW, estH),
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </nav>

        <div className={`p3-hint ${mounted ? "mounted" : ""}`}>
          <div className="p3-hint-row"><span className="p3-hint-key">↑↓</span><span>NAVIGATE</span></div>
          <div className="p3-hint-row"><span className="p3-hint-key">↵</span><span>CONFIRM</span></div>
        </div>
      </div>
    </>
  );
}