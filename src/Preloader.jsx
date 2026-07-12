import { useEffect, useState } from "react";

/**
 * STRATEGI BARU (v2): sebelumnya semua gambar di folder assets ditunggu
 * sekaligus di splash, termasuk galeri screenshot project (dental-clinic,
 * japancareer, portfolio, rt-admin, portal-berita, hris) yang jumlahnya
 * belasan file resolusi tinggi dan CUMA kepake kalau user buka halaman
 * Side Projects. Itu bikin loading awal berat padahal user belum tentu
 * buka halaman itu.
 *
 * Sekarang aset dipisah otomatis lewat lokasi foldernya:
 *  - "critical"  = file yang ada LANGSUNG di ./assets/*  (top-level)
 *                  -> dipakai di menu/about/socials, wajar ditunggu
 *  - "gallery"   = file yang ada di SUBFOLDER ./assets/**\/*
 *                  -> galeri per-project, di-download di BELAKANG LAYAR
 *                  setelah halaman utama tampil, tidak menahan splash
 *
 * Video juga cuma ditunggu sampai frame pertama siap (loadeddata), bukan
 * full-download.
 */

const CRITICAL_IMAGE_RE = /^\.\/assets\/[^/]+\.(png|jpe?g|webp|svg|gif)$/i;

const allImageModules = import.meta.glob(
  "./assets/**/*.{png,jpg,jpeg,webp,svg,gif}",
  { import: "default" }
);

const criticalImageEntries = [];
const galleryImageEntries = [];
for (const [path, loader] of Object.entries(allImageModules)) {
  if (CRITICAL_IMAGE_RE.test(path)) {
    criticalImageEntries.push(loader);
  } else {
    galleryImageEntries.push(loader);
  }
}

const audioModules = import.meta.glob(
  "./assets/**/*.{wav,mp3,ogg}",
  { import: "default" }
);
const videoModules = import.meta.glob(
  "./assets/**/*.{mp4,webm}",
  { import: "default" }
);

function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = url;
  });
}

function preloadAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.oncanplaythrough = resolve;
    audio.onerror = resolve;
    audio.src = url;
    audio.load();
  });
}

function preloadVideo(url) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.oncanplaythrough = resolve;
    video.onloadeddata = resolve;
    video.onerror = resolve;
    video.src = url;
    video.load();
    setTimeout(resolve, 10000);
  });
}

// Download gambar galeri satu-satu (bukan bareng semua) di waktu senggang
// browser, biar tidak rebutan bandwidth/CPU sama hal lain yang lagi jalan
// (animasi halaman, dsb). Kalau requestIdleCallback tidak ada (Safari),
// fallback ke setTimeout biasa.
function loadGalleryInBackground(loaders) {
  const ric = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
  let i = 0;
  function next() {
    if (i >= loaders.length) return;
    const loader = loaders[i++];
    loader()
      .then(preloadImage)
      .catch(() => {})
      .finally(() => ric(next));
  }
  ric(next);
}

export default function Preloader({ children }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const audioLoaders = Object.values(audioModules);
    const videoLoaders = Object.values(videoModules);
    const total = criticalImageEntries.length + audioLoaders.length + videoLoaders.length;

    if (total === 0) {
      setReady(true);
      return;
    }

    let loaded = 0;
    const bump = () => {
      loaded += 1;
      if (cancelled) return;
      setProgress(Math.round((loaded / total) * 100));
      if (loaded >= total) setReady(true);
    };

    criticalImageEntries.forEach((load) => {
      load().then(preloadImage).then(bump).catch(bump);
    });
    audioLoaders.forEach((load) => {
      load().then(preloadAudio).then(bump).catch(bump);
    });
    videoLoaders.forEach((load) => {
      load().then(preloadVideo).then(bump).catch(bump);
    });

    const failSafe = setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 10000);

    // Begitu splash beres, baru mulai download galeri project di
    // belakang layar (tidak menahan apapun, tidak ditampilkan progress).
    loadGalleryInBackground(galleryImageEntries);

    return () => {
      cancelled = true;
      clearTimeout(failSafe);
    };
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0b0f1c",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          zIndex: 9999,
          fontFamily: "'Bebas Neue', sans-serif",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 14, letterSpacing: 4, opacity: 0.55 }}>
          LOADING
        </div>
        <div
          style={{
            width: 220,
            height: 4,
            background: "rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#c4001a",
              transition: "width 0.2s ease",
            }}
          />
        </div>
        <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.4 }}>
          {progress}%
        </div>
      </div>
    );
  }

  return children;
}