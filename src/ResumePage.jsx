import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import selectItemSound from "./assets/select_item.wav";
import backSound from "./assets/back_sound.wav";

function playSound(src) {
  const audio = new Audio(src);
  audio.play().catch(() => {});
}

const ITEMS = [
  { id: "i", badge: "I", title: "EDUCATION", subtitle: "University / School", rank: 3 },
  { id: "ii", badge: "II", title: "SKILLS", subtitle: "Backend / Frontend / Tools", rank: 4 },
  { id: "iii", badge: "III", title: "PROJECTS", subtitle: "Featured Work", rank: 5 },
  { id: "iv", badge: "IV", title: "EXPERIENCE", subtitle: "Internships / Roles", rank: 2 },
];

const RESUME_SECTIONS = [
  {
    topIndex: "01",
    topTitle: "EDUCATION LOG",
    topProgress: "02/02",
    rows: [
      { index: "01", title: "Universitas Brawijaya", status: "2022 - 2025" },
      { index: "02", title: "SMAN 1 Sumenep", status: "2019 - 2022" },
    ],
    bullets: [
      "D3  Teknologi Informasi with GPA 3.69/4.00.",
      "Final project: PIS Japan Career website development and payment gateway integration.",
      "High school focus: Natural Science track with GPA 86.73.",
    ],
  },
  {
    topIndex: "02",
    topTitle: "SKILL MATRIX",
    topProgress: "04/04",
    rows: [
      { index: "01", title: "Backend", status: "AdonisJS / Laravel" },
      { index: "02", title: "Database", status: "PostgreSQL / MySQL" },
      { index: "03", title: "Frontend", status: "React / HTML / CSS" },
      { index: "04", title: "Tools", status: "Postman / Figma" },
    ],
    bullets: [
      "Primary stack: TypeScript, REST API, Bootstrap, Tailwind, and CodeIgniter 4.",
      "Supporting tools: Canva, Microsoft Word, and Microsoft PowerPoint.",
      "Languages: Indonesian (native) and English (intermediate).",
    ],
  },
  {
    topIndex: "03",
    topTitle: "PROJECT ARCHIVE",
    topProgress: "05/05",
    rows: [
      { index: "01", title: "Attendance System", status: "COMPLETE" },
      { index: "02", title: "Dental Clinic System", status: "OPEN SOURCE" },
      { index: "03", title: "Japan Career", status: "PRIVATE" },
      { index: "04", title: "Portal Berita", status: "LIVE", url: "https://portal-berita-production-8f38.up.railway.app/" },
      { index: "05", title: "Stokku", status: "Ongoing" },
      { index: "06", title: "Admin-RT", status: "Open Source" }
    ],
    bullets: [
      "Additional systems in the portfolio: Admin-RT, Portal Berita, and Stokku.",
      "Core themes: backend systems, CMS integration, and product-oriented web apps.",
      "Project detail page can be expanded in the next update.",
    ],
  },
  {
    topIndex: "04",
    topTitle: "EXPERIENCE LOG",
    topProgress: "02/02",
    rows: [
      { index: "01", title: "Profile Image Studio", status: "Okt 2025 - Apr 2026" },
      { index: "02", title: "Profile Image Studio", status: "Sep 2024 - Des 2024" },
    ],
    bullets: [
      "Built HRIS attendance backend with AdonisJS, PostgreSQL, and role-based access.",
      "Handled timezone anomalies, report exports, scheduler jobs, and API validation.",
      "Worked on CMS/API architecture for the Japan Career and Treehouse platform.",
    ],
  },
];

export default function ResumePage({ src }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") { playSound(selectItemSound); setActive((i) => Math.max(0, i - 1)); }
      if (e.key === "ArrowDown") { playSound(selectItemSound); setActive((i) => Math.min(ITEMS.length - 1, i + 1)); }
      if (e.key === "ArrowLeft") { playSound(backSound); navigate(-1); }
      if (e.key === "Escape" || e.key === "Backspace") { playSound(backSound); navigate(-1); }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);


  return (
    <div id="menu-screen">
      <video src={src} autoPlay loop muted playsInline />
      <div className="resume-entry-mask" aria-hidden="true">
        <video className="resume-entry-video" src={src} autoPlay loop muted playsInline />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&display=swap');

        .resume-entry-mask {
          position: absolute;
          inset: 0;
          z-index: 9;
          overflow: hidden;
          background: #0047FF;
          clip-path: circle(0 at 50% 50%);
          animation: resume-entry-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: none;
        }

        .resume-entry-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @keyframes resume-entry-reveal {
          from { clip-path: circle(0 at 50% 50%); }
          to { clip-path: circle(150vmax at 50% 50%); }
        }

        .resume-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }

        .resume-stack {
          position: absolute;
          top: 9vh;
          left: 2.8vw;
          width: min(47vw, 720px);
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
          transform: scale(0.9);
          transform-origin: top left;
        }

        .resume-list-tag {
          font-family: 'Anton', sans-serif;
          font-size: 92px;
          line-height: 0.9;
          color: #f6fbff;
          letter-spacing: 2px;
          margin: 0 0 6px 12px;
          text-shadow: 0 2px 0 rgba(0,0,0,0.18);
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .resume-list-tag.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-card-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: all;
          cursor: pointer;
        }
        .resume-card-wrap.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-card {
          position: relative;
          height: 112px;
          background: #10185f;
          clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
          box-shadow: 0 8px 0 rgba(5, 13, 59, 0.85);
          transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          overflow: visible;
        }
        .resume-card-wrap.active .resume-card {
          background: #ffffff;
          box-shadow: 10px 8px 0 #d63232;
          transform: translateX(6px);
        }

        .resume-card-inner {
          position: absolute;
          inset: 0;
          padding: 14px 22px 14px 62px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .resume-badge {
          position: absolute;
          top: 10px;
          left: -10px;
          width: 56px;
          height: 70px;
          background: #0b113d;
          border: 3px solid #9cf7ff;
          clip-path: polygon(14% 0, 100% 0, 84% 100%, 0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-8deg);
          box-shadow: 0 4px 0 rgba(0,0,0,0.28);
          transition: background 0.22s ease, border-color 0.22s ease;
        }
        .resume-badge-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #d2fdff;
          letter-spacing: 1px;
          transform: rotate(8deg);
        }
        .resume-card-wrap.active .resume-badge {
          background: #000;
          border-color: #000;
        }
        .resume-card-wrap.active .resume-badge-text {
          color: #fff;
        }

        .resume-title {
          font-family: 'Anton', sans-serif;
          font-size: 56px;
          line-height: 0.9;
          letter-spacing: 1px;
          color: #a5f6ff;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-title {
          color: #000;
        }

        .resume-rank {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .resume-rank-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 2px;
          color: #9ffbff;
          transition: color 0.22s ease;
        }
        .resume-rank-number {
          font-family: 'Anton', sans-serif;
          font-size: 70px;
          line-height: 0.82;
          color: #9ffbff;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-rank-label,
        .resume-card-wrap.active .resume-rank-number {
          color: #000;
        }

        .resume-subtitle-bar {
          position: absolute;
          left: 64px;
          right: 14px;
          bottom: 12px;
          height: 34px;
          background: #85f4ff;
          clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          display: flex;
          align-items: center;
          padding: 0 18px;
          transition: background 0.22s ease;
        }
        .resume-card-wrap.active .resume-subtitle-bar {
          background: #000;
        }

        .resume-subtitle {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          line-height: 1;
          letter-spacing: 1px;
          color: #041238;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-subtitle {
          color: #fff;
        }

        .resume-detail-panel {
          position: absolute;
          top: 9.5vh;
          right: 4.5vw;
          width: min(39vw, 620px);
          min-height: 74vh;
          z-index: 12;
          padding: 22px 24px 24px 24px;
          background: linear-gradient(180deg, rgba(15, 28, 105, 0.96) 0%, rgba(8, 16, 68, 0.97) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(133, 244, 255, 0.16),
            16px 16px 0 rgba(0, 6, 30, 0.55);
          overflow: hidden;
        }
        .resume-detail-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(133, 244, 255, 0.08) 0 15%, transparent 15% 100%),
            linear-gradient(180deg, rgba(255,255,255,0.05), transparent 24%);
          pointer-events: none;
        }
        .resume-detail-top {
          position: relative;
          display: grid;
          grid-template-columns: 70px 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 92px;
          padding: 0 18px;
          background: linear-gradient(90deg, #8ef5ff 0%, #d3fdff 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          color: #08153f;
          box-shadow: 10px 0 0 rgba(255, 94, 136, 0.88);
        }
        .resume-detail-top-index {
          font-family: 'Anton', sans-serif;
          font-size: 46px;
          line-height: 1;
        }
        .resume-detail-top-title {
          font-family: 'Anton', sans-serif;
          font-size: 42px;
          line-height: 0.92;
          letter-spacing: 1px;
        }
        .resume-detail-top-progress {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          letter-spacing: 2px;
          line-height: 1;
        }
        .resume-detail-list {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
        }
        .resume-detail-row {
          display: grid;
          grid-template-columns: 50px 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 56px;
          padding: 0 14px;
          background: rgba(8, 18, 72, 0.96);
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(140, 239, 255, 0.12);
          transition: transform 0.16s ease, background 0.16s ease;
        }
        .resume-detail-row:hover {
          transform: translateX(4px);
          background: rgba(12, 26, 94, 1);
        }
        .resume-detail-row-index {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 1px;
          color: #94f4ff;
        }
        .resume-detail-row-title {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          line-height: 1;
          color: #f2fcff;
        }
        .resume-detail-row-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .resume-detail-status {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          line-height: 1;
          letter-spacing: 1.1px;
          color: #06133b;
          background: #8df6ff;
          padding: 7px 12px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
        }
        .resume-detail-visit-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          line-height: 1;
          letter-spacing: 1.1px;
          color: #06133b;
          background: #ff5e88;
          padding: 7px 12px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
          text-decoration: none;
          cursor: pointer;
          pointer-events: all;
          transition: transform 0.16s ease, background 0.16s ease;
          white-space: nowrap;
        }
        .resume-detail-visit-btn:hover {
          background: #ff8aa8;
          transform: translateX(-2px);
        }
        .resume-detail-bottom {
          position: relative;
          margin-top: 22px;
          padding: 18px;
          background: rgba(5, 13, 57, 0.97);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(145, 239, 255, 0.12);
        }
        .resume-detail-bottom-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px;
          letter-spacing: 2px;
          color: #91f5ff;
          margin-bottom: 14px;
        }
        .resume-detail-bullets {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .resume-detail-bullet {
          font-family: 'Anton', sans-serif;
          font-size: 21px;
          line-height: 1.15;
          color: #edfaff;
        }

        @media (max-width:768px){

        .resume-overlay{
            display:flex;
            flex-direction:column;
            overflow-y:auto;
            overflow-x:hidden;
            padding:12px;
            gap:16px;
        }

        .resume-stack{
            position:relative;
            top:0;
            left:0;
            width:100%;
            transform:none;
            gap:8px;
            pointer-events:auto;
        }

        .resume-list-tag{
            font-size:54px;
            margin-left:4px;
        }

        /* CARD */

        .resume-card{
            height:82px;
            box-shadow:0 5px 0 rgba(5,13,59,.85);
        }

        .resume-card-inner{
            position:absolute;
            inset:0;
            padding:10px 14px 10px 48px;
            display:flex;
            flex-direction:row;
            justify-content:space-between;
            align-items:flex-start;
        }

        .resume-badge{
            width:38px;
            height:48px;
            left:-6px;
            top:7px;
            border-width:2px;
        }

        .resume-badge-text{
            font-size:22px;
        }

        .resume-title{
            font-size:27px;
            line-height:.9;
            white-space:nowrap;
        }

        .resume-rank{
            gap:4px;
            margin-top:2px;
        }

        .resume-rank-label{
            font-size:15px;
        }

        .resume-rank-number{
            font-size:38px;
        }

        .resume-subtitle-bar{
            position:absolute;
            left:48px;
            right:10px;
            bottom:8px;
            height:22px;
            margin:0;
            padding:0 10px;
        }

        .resume-subtitle{
            font-size:14px;
            white-space:nowrap;
        }

        /* PANEL */

        .resume-detail-panel{
            position:relative;
            top:auto;
            right:auto;
            width:100%;
            min-height:auto;
            padding:14px;
            margin-top:6px;
            box-shadow:none;
        }

        .resume-detail-top{
            min-height:58px;
            grid-template-columns:38px 1fr auto;
            gap:8px;
            padding:0 10px;
        }

        .resume-detail-top-index{
            font-size:28px;
        }

        .resume-detail-top-title{
            font-size:22px;
        }

        .resume-detail-top-progress{
            font-size:24px;
        }

        .resume-detail-row{
            min-height:46px;
            grid-template-columns:30px 1fr auto;
        }

        .resume-detail-row-title{
            font-size:15px;
        }

        .resume-detail-row-actions{
            gap:6px;
        }

        .resume-detail-status{
            font-size:12px;
        }

        .resume-detail-visit-btn{
            font-size:11px;
            padding:5px 8px;
        }

        .resume-detail-bottom-title{
            font-size:20px;
        }

        .resume-detail-bullet{
            font-size:13px;
        }
        }

      `}</style>

      <div className="resume-overlay">
        <div className="resume-stack">
          <div className={`resume-list-tag${mounted ? " mounted" : ""}`}>LIST</div>
          {ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`resume-card-wrap${active === index ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: `${index * 55}ms` }}
              onMouseEnter={() => {
                setActive(index);
              }}
              onClick={() => {
                playSound(selectItemSound);
                setActive(index);
              }}
            >
              <div className="resume-card">
                <div className="resume-badge">
                  <div className="resume-badge-text">{item.badge}</div>
                </div>
                <div className="resume-card-inner">
                  <div className="resume-title">{item.title}</div>
                  <div className="resume-rank">
                    <div className="resume-rank-label">RANK</div>
                    <div className="resume-rank-number">{item.rank}</div>
                  </div>
                </div>
                <div className="resume-subtitle-bar">
                  <div className="resume-subtitle">{item.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {RESUME_SECTIONS[active] && (
          <div className="resume-detail-panel">
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">{RESUME_SECTIONS[active].topIndex}</div>
              <div className="resume-detail-top-title">{RESUME_SECTIONS[active].topTitle}</div>
              <div className="resume-detail-top-progress">{RESUME_SECTIONS[active].topProgress}</div>
            </div>

            <div className="resume-detail-list">
              {RESUME_SECTIONS[active].rows.map((row) => (
                <div className="resume-detail-row" key={row.index}>
                  <div className="resume-detail-row-index">{row.index}</div>
                  <div className="resume-detail-row-title">{row.title}</div>
                  <div className="resume-detail-row-actions">
                    <div className="resume-detail-status">{row.status}</div>
                    {row.status === "LIVE" && row.url && (
                      <a
                        className="resume-detail-visit-btn"
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => { e.stopPropagation(); playSound(selectItemSound); }}
                      >
                        VISIT ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="resume-detail-bottom">
              <div className="resume-detail-bottom-title">DETAILS</div>
              <div className="resume-detail-bullets">
                {RESUME_SECTIONS[active].bullets.map((bullet) => (
                  <div className="resume-detail-bullet" key={bullet}>- {bullet}</div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}