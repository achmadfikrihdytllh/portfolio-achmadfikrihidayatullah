import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import hrisPresensi from "./assets/hris/Presensi.png";
import hrisImage from "./assets/hris/image.png";
import dental1 from "./assets/dental/dental-clinic1.png";
import dental2 from "./assets/dental/dental-clinic2.png";
import dental3 from "./assets/dental/dental-clinic3.png";
import dental4 from "./assets/dental/dental-clinic4.png";
import japan1 from "./assets/japancareer/image1.png";
import japan2 from "./assets/japancareer/image2.png";
import japan3 from "./assets/japancareer/image3.png";
import japan4 from "./assets/japancareer/image4.png";
import portfolio1 from "./assets/portfolio/portfolio1.png";
import portfolio2 from "./assets/portfolio/portfolio2.png";
import portfolio3 from "./assets/portfolio/portfolio3.png";
import rtAdmin1 from "./assets/rt-admin/1.png";
import rtAdmin2 from "./assets/rt-admin/2.png";
import rtAdmin3 from "./assets/rt-admin/3.png";
import berita1 from "./assets/portal-berita/1.png";
import berita2 from "./assets/portal-berita/2.png";
import berita3 from "./assets/portal-berita/3.png";
import heroImage from "./assets/hero.png";
import cardImage from "./assets/card.png";
import coverImage from "./assets/066fce1e-074d-4739-b798-efd06e0bf6ea.jpg";
import selectItemSound from "./assets/select_item.wav";
import backSound from "./assets/back_sound.wav";

function playSound(src) {
  const audio = new Audio(src);
  audio.play().catch(() => {});
}

const PROJECTS = [
  {
    title: "ATTENDANCE SYSTEM",
    category: "Internal System",
    status: "COMPLETE",
    tech: ["AdonisJS", "PostgreSQL", "REST API", "TypeScript"],
    image: hrisPresensi,
    gallery: [hrisImage, hrisPresensi],
    description: "Backend presensi karyawan berbasis REST API dengan multi-timezone dan signed URLs.",
  },
  {
    title: "DENTAL CLINIC SYSTEM",
    category: "Legacy Monolith",
    status: "OPEN SOURCE",
    tech: ["CodeIgniter 4", "MySQL", "Bootstrap", "jQuery"],
    image: dental1,
    gallery: [
      dental1,
      dental2,
      dental3,
      dental4,
    ],
    description: "Sistem reservasi pasien, antrian, jadwal dokter, dan billing klinik gigi.",
  },
  {
    title: "JAPAN CAREER",
    category: "Recruitment System",
    status: "PRIVATE",
    tech: ["AdonisJS", "PostgreSQL", "TypeScript"],
    image: japan1,
    gallery: [
      japan1,
      japan2,
      japan3,
      japan4,
    ],
    description: "Backend job matching dan profiling kandidat untuk platform rekrutmen Jepang.",
  },
  {
    title: "PROJECT COMPENDIUM",
    category: "Personal Portfolio",
    status: "LIVE",
    tech: ["Astro", "React", "Tailwind", "TypeScript"],
    image: portfolio1,
    gallery: [portfolio1, portfolio2, portfolio3],
    description: "Portfolio interaktif bertema Persona 3 dengan visualisasi data yang imersif.",
  },
  {
    title: "ADMIN-RT",
    category: "Internal System",
    status: "COMPLETE",
    tech: ["Laravel", "React", "MySQL", "Tailwind", "API"],
    image: rtAdmin1,
    gallery: [rtAdmin1, rtAdmin2, rtAdmin3],
    description: "Sistem manajemen RT/RW untuk warga, iuran bulanan, dan riwayat pembayaran.",
  },
  {
    title: "PORTAL BERITA",
    category: "News Portal",
    status: "LIVE",
    tech: ["Laravel", "MySQL", "Tailwind", "API"],
    image: berita1,
    gallery: [berita1, berita2, berita3],
    description: "Portal berita responsif dengan pencarian, filter kategori, dan komentar.",
  },
  {
    title: "STOKKU",
    category: "Warehouse Management System",
    status: "ONGOING",
    tech: ["AdonisJS", "PostgreSQL", "React", "Tailwind"],
    image: heroImage,
    gallery: [heroImage, cardImage, coverImage],
    description: "Manajemen gudang untuk inventaris, stok real-time, dan transaksi barang.",
  },
];

export default function SideProjects() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const activeProject = useMemo(() => PROJECTS[activeIndex], [activeIndex]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 70);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (previewImage) {
        if (e.key === "Escape" || e.key === "Backspace") { playSound(backSound); setPreviewImage(null); }
        return;
      }
      if (e.key === "ArrowUp") { playSound(selectItemSound); setActiveIndex((i) => Math.max(0, i - 1)); }
      if (e.key === "ArrowDown") { playSound(selectItemSound); setActiveIndex((i) => Math.min(PROJECTS.length - 1, i + 1)); }
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") { playSound(backSound); navigate(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, previewImage]);

  const openPreview = (image) => {
    playSound(selectItemSound);
    setPreviewImage({
      image,
      title: activeProject.title,
      category: activeProject.category,
      description: activeProject.description,
    });
  };


  return (
    <div className={`sideproj-screen${mounted ? " mounted" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Montserrat:wght@300;400;600&display=swap');

        .sideproj-screen {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at top left, rgba(255, 255, 255, 0.18), transparent 24%),
            linear-gradient(135deg, #0b0f1c 0%, #12192d 52%, #1d2746 100%);
          color: #f7f9ff;
        }

        .sideproj-screen::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 18px),
            linear-gradient(240deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 16px);
          background-size: 100% 100%, 100% 100%;
          pointer-events: none;
          opacity: 0.45;
        }

        .sideproj-header {
          position: absolute;
          top: 24px;
          left: 28px;
          z-index: 2;
        }

        .sideproj-kicker {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 4px;
          color: rgba(255,255,255,0.72);
        }

        .sideproj-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(36px, 6vw, 82px);
          letter-spacing: 2px;
          line-height: 0.92;
          margin-top: 4px;
        }

        .sideproj-layout {
          position: absolute;
          inset: 98px 24px 24px 24px;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 20px;
          z-index: 2;
        }

        .sideproj-list,
        .sideproj-detail {
          background: rgba(6, 9, 20, 0.68);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.35);
        }

        .sideproj-list {
          padding: 16px;
          overflow: auto;
        }

        .sideproj-card {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          margin-bottom: 12px;
          cursor: pointer;
          transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
          touch-action: manipulation;
        }

        .sideproj-card.active {
          transform: translateX(8px);
          background: rgba(255,255,255,0.11);
          border-color: rgba(255,255,255,0.24);
        }

        .sideproj-card-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px 8px;
        }

        .sideproj-card-title {
          font-family: 'Anton', sans-serif;
          font-size: 24px;
          line-height: 1;
        }

        .sideproj-card-status {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 2px;
          color: #8bf6ff;
          white-space: nowrap;
        }

        .sideproj-card-meta {
          padding: 0 14px 12px;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.68);
          line-height: 1.5;
        }

        .sideproj-detail {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 18px;
          padding: 18px;
        }

        .sideproj-hero {
          min-height: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
          cursor: zoom-in;
        }

        .sideproj-hero img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #0a0d18;
          display: block;
        }

        .sideproj-info {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sideproj-info-category {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 3px;
          color: #ffcf5a;
        }

        .sideproj-info-description {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.88);
        }

        .sideproj-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .sideproj-tech-chip {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 1.6px;
          padding: 7px 10px 5px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .sideproj-gallery {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .sideproj-thumb {
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: zoom-in;
        }

        .sideproj-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .sideproj-footer {
          position: absolute;
          right: 24px;
          bottom: 20px;
          z-index: 2;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.62);
        }

        .sideproj-preview {
          position: fixed;
          inset: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(3, 5, 12, 0.86);
          backdrop-filter: blur(8px);
        }

        .sideproj-preview-panel {
          width: min(1100px, 100%);
          max-height: 92vh;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
          gap: 16px;
          padding: 16px;
          background: rgba(8, 12, 24, 0.96);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 24px 80px rgba(0,0,0,0.55);
        }

        .sideproj-preview-image {
          min-height: 0;
          background: #05070f;
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .sideproj-preview-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          background: #05070f;
        }

        .sideproj-preview-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
          overflow: auto;
        }

        .sideproj-preview-close {
          align-self: flex-end;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 2px;
          padding: 8px 12px 6px;
          cursor: pointer;
        }

        .sideproj-preview-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(28px, 4vw, 54px);
          line-height: 0.95;
        }

        .sideproj-preview-category {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 3px;
          color: #ffcf5a;
        }

        .sideproj-preview-description {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.9);
        }

        @media (max-width: 980px) {
          .sideproj-layout {
            grid-template-columns: 1fr;
            inset: 92px 16px 16px 16px;
          }

          .sideproj-detail {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sideproj-header {
            top: 12px;
            left: 12px;
            right: 12px;
          }

          .sideproj-kicker {
            font-size: 14px;
            letter-spacing: 3px;
          }

          .sideproj-title {
            font-size: clamp(28px, 9vw, 48px);
          }

          .sideproj-layout {
            inset: 78px 12px 12px 12px;
            gap: 12px;
            overflow-y: auto;
          }

          .sideproj-list {
            padding: 12px;
          }

          .sideproj-card-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 10px 12px 6px;
          }

          .sideproj-card-title {
            font-size: 20px;
          }

          .sideproj-card-meta {
            font-size: 11px;
            line-height: 1.45;
            padding: 0 12px 10px;
          }

          .sideproj-detail {
            gap: 12px;
            padding: 12px;
          }

          .sideproj-hero {
            aspect-ratio: 16 / 10;
            min-height: 180px;
          }

          .sideproj-info {
            gap: 10px;
          }

          .sideproj-info-category {
            font-size: 16px;
          }

          .sideproj-info-description {
            font-size: 13px;
            line-height: 1.55;
          }

          .sideproj-tech {
            gap: 6px;
          }

          .sideproj-tech-chip {
            font-size: 13px;
            padding: 6px 8px 4px;
          }

          .sideproj-gallery {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .sideproj-footer {
            position: fixed;
            right: 12px;
            bottom: 10px;
            font-size: 11px;
            letter-spacing: 1.5px;
            opacity: 0.8;
          }

          .sideproj-preview {
            padding: 10px;
          }

          .sideproj-preview-panel {
            grid-template-columns: 1fr;
            max-height: 94vh;
            padding: 12px;
          }

          .sideproj-preview-info {
            gap: 10px;
          }

          .sideproj-preview-title {
            font-size: 30px;
          }

          .sideproj-preview-description {
            font-size: 13px;
            line-height: 1.55;
          }
        }
      `}</style>

      <div className="sideproj-header">
        <div className="sideproj-kicker">SIDE PROJECTS / GALLERY MODE</div>
        <div className="sideproj-title">PROJECT ARCHIVE</div>
      </div>

      <div className="sideproj-layout">
        <div className="sideproj-list">
          {PROJECTS.map((project, index) => (
            <div
              key={project.title}
              className={`sideproj-card${index === activeIndex ? " active" : ""}`}
              onClick={() => selectProject(index)}
              onTouchStart={() => selectProject(index)}
            >
              <div className="sideproj-card-top">
                <div className="sideproj-card-title">{project.title}</div>
                <div className="sideproj-card-status">{project.status}</div>
              </div>
              <div className="sideproj-card-meta">
                <div>{project.category}</div>
                <div>{project.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="sideproj-detail">
          <div className="sideproj-hero" onClick={() => openPreview(activeProject.image)}>
            <img src={activeProject.image} alt={activeProject.title} />
          </div>
          <div className="sideproj-info">
            <div className="sideproj-info-category">{activeProject.category}</div>
            <div className="sideproj-info-description">{activeProject.description}</div>
            <div className="sideproj-tech">
              {activeProject.tech.map((tech) => (
                <div className="sideproj-tech-chip" key={tech}>{tech}</div>
              ))}
            </div>
            <div className="sideproj-gallery">
              {activeProject.gallery.map((image) => (
                <div className="sideproj-thumb" key={image} onClick={() => openPreview(image)}>
                  <img src={image} alt={activeProject.title} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {previewImage && (
        <div className="sideproj-preview" onClick={closePreview}>
          <div className="sideproj-preview-panel" onClick={(event) => event.stopPropagation()}>
            <div className="sideproj-preview-image">
              <img src={previewImage.image} alt={previewImage.title} />
            </div>
            <div className="sideproj-preview-info">
              <button type="button" className="sideproj-preview-close" onClick={closePreview}>
                CLOSE
              </button>
              <div className="sideproj-preview-category">{previewImage.category}</div>
              <div className="sideproj-preview-title">{previewImage.title}</div>
              <div className="sideproj-preview-description">{previewImage.description}</div>
            </div>
          </div>
        </div>
      )}

      <div className="sideproj-footer">↑↓ SELECT  •  CLICK TO VIEW  •  ESC BACK</div>
    </div>
  );
}