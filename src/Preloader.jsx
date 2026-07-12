import { useEffect, useState } from "react";

/**
 * Preload otomatis semua gambar & suara di folder ./assets sebelum
 * halaman apapun dirender. Pakai import.meta.glob (fitur Vite) supaya
 * TIDAK perlu ketik manual tiap nama file — kalau nambah aset baru di
 * folder assets, otomatis ikut di-preload tanpa perlu edit file ini.
 *
 * Video (.mp4) SENGAJA tidak diikutkan di sini karena ukurannya besar
 * dan bakal bikin loading awal lama banget kalau ditunggu full-download.
 * Video tetap jalan seperti biasa (browser stream sambil main), cuma
 * tidak menahan splash screen.
 */
const imageModules = import.meta.glob(
  "./assets/**/*.{png,jpg,jpeg,webp,svg,gif}",
  { import: "default" }
);
const audioModules = import.meta.glob(
  "./assets/**/*.{wav,mp3,ogg}",
  { import: "default" }
);
// Video ikut di-preload juga (sebelumnya sengaja di-skip biar splash cepat,
// tapi efeknya background layar item pas video belum sempat kebuffer).
// Dipakai event "loadeddata" (bukan "canplaythrough") supaya cukup nunggu
// frame pertama siap tampil, bukan nunggu seluruh video full ke-download —
// kalau nunggu full, splash bisa lama banget buat video yang gede.
const videoModules = import.meta.glob(
  "./assets/**/*.{mp4,webm}",
  { import: "default" }
);

function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve; // tetap lanjut walau 1 file gagal, jangan nge-block semuanya
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
    // Jaring pengaman per-video: kalau koneksi lambat banget, jangan
    // sampai 1 video nahan splash lebih dari 10 detik sendirian.
    setTimeout(resolve, 10000);
  });
}

export default function Preloader({ children }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const imageLoaders = Object.values(imageModules);
    const audioLoaders = Object.values(audioModules);
    const total = imageLoaders.length + audioLoaders.length;

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

    imageLoaders.forEach((load) => {
      load().then(preloadImage).then(bump).catch(bump);
    });
    audioLoaders.forEach((load) => {
      load().then(preloadAudio).then(bump).catch(bump);
    });

    // Jaring pengaman: kalau ada aset yang macet/gagal terus (network aneh),
    // jangan sampai splash nyangkut selamanya — paksa lanjut setelah 8 detik.
    const failSafe = setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 8000);

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