import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { mediaAPI } from "../services/mediaAPI";
import { X, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon, Camera, ZoomIn } from "lucide-react";

const BACKEND_URL = "https://tikonecricketgurukulbackend.onrender.com";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgg {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  position: relative; overflow: hidden; min-height: 100vh; padding: 64px 16px 88px;
  background: linear-gradient(135deg, var(--cream) 0%, var(--pink-soft) 55%, var(--pink) 130%);
}
.tcgg *, .tcgg *::before, .tcgg *::after, .tcgg-lb *, .tcgg-lb *::before, .tcgg-lb *::after { box-sizing: border-box; }
.tcgg h1, .tcgg h3 { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -.03em; margin: 0; }
.tcgg p { margin: 0; }

@keyframes tcgg-float { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-22px) rotate(10deg) } }
@keyframes tcgg-blob { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(26px,-30px) scale(1.12) } }
@keyframes tcgg-in { from { opacity: 0; transform: translateY(30px) scale(.95) } to { opacity: 1; transform: none } }
@keyframes tcgg-shimmer { to { background-position: 200% center } }
@keyframes tcgg-wiggle { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3deg) } }
@keyframes tcgg-spin { to { transform: rotate(360deg) } }
@keyframes tcgg-shake { 0%,100% { transform: translateX(0) } 20%,60% { transform: translateX(-6px) } 40%,80% { transform: translateX(6px) } }
@keyframes tcgg-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes tcgg-zoom { from { opacity: 0; transform: scale(.88) translateY(15px) } to { opacity: 1; transform: none } }

.tcgg-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: .5; pointer-events: none; animation: tcgg-blob 12s ease-in-out infinite; }
.tcgg-ball { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%); box-shadow: inset -3px -4px 8px rgba(0,0,0,.25), 0 6px 12px rgba(42,10,63,.2); animation: tcgg-float 6s ease-in-out infinite; opacity: .8; }
.tcgg-wrap { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; }

.tcgg-hero { text-align: center; margin-bottom: 40px; animation: tcgg-in .7s cubic-bezier(.2,.8,.2,1) both; }
.tcgg-chip { display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: 999px; background: var(--plum); color: var(--lime); font-size: 12.5px; font-weight: 800; margin-bottom: 16px; animation: tcgg-wiggle 2.6s ease-in-out infinite; }
.tcgg-title { font-weight: 800; line-height: 1.02; font-size: clamp(2.3rem, 7vw, 4rem);
  background: linear-gradient(90deg, var(--plum), #b0108a, var(--plum-2), #b0108a, var(--plum)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcgg-shimmer 5s linear infinite; }
.tcgg-sub { max-width: 620px; margin: 14px auto 0; font-size: clamp(1rem, 2.4vw, 1.15rem); font-weight: 500; line-height: 1.55; color: rgba(42,10,63,.75); }
.tcgg-bar { width: 90px; height: 8px; margin: 22px auto 0; border-radius: 999px; background: var(--lime); border: 2px solid var(--plum); }

.tcgg-loading { display: flex; justify-content: center; align-items: center; gap: 12px; width: fit-content; margin: 0 auto 24px; padding: 10px 20px; border-radius: 999px; background: #fff; border: 3px solid var(--plum); box-shadow: 4px 4px 0 var(--plum); font-weight: 800; animation: tcgg-in .4s both; }
.tcgg-loading svg { animation: tcgg-spin 1s linear infinite; color: #b0108a; }
.tcgg-error { max-width: 560px; margin: 0 auto 24px; padding: 12px 18px; text-align: center; border-radius: 16px; border: 2px solid #9f1239; background: #ffe4ea; color: #9f1239; font-weight: 700; animation: tcgg-shake .45s; }

.tcgg-count { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 26px; padding: 8px 18px; border-radius: 999px; background: var(--lime); border: 3px solid var(--plum); box-shadow: 4px 4px 0 var(--plum); font-weight: 800; font-size: 14.5px; }
.tcgg-count svg { transition: transform .5s cubic-bezier(.3,1.6,.5,1); }
.tcgg-count:hover svg { transform: rotate(360deg); }

.tcgg-grid { display: grid; gap: 30px; grid-template-columns: 1fr; }
@media (min-width: 640px) { .tcgg-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .tcgg-grid { grid-template-columns: repeat(3, 1fr); } }

.tcgg-card { position: relative; overflow: hidden; background: #fff; border: 3px solid var(--plum); border-radius: 26px; box-shadow: 7px 7px 0 var(--plum); animation: tcgg-in .7s cubic-bezier(.2,.8,.2,1) both; transition: transform .35s cubic-bezier(.3,1.6,.5,1), box-shadow .35s; }
.tcgg-card:nth-child(3n+1) { --tilt: -1.2deg; }
.tcgg-card:nth-child(3n+2) { --tilt: .8deg; }
.tcgg-card:nth-child(3n) { --tilt: -.6deg; }
.tcgg-card:hover { transform: translate(-4px,-8px) rotate(var(--tilt)); box-shadow: 11px 15px 0 var(--plum); }
.tcgg-media { position: relative; overflow: hidden; height: 256px; background: var(--pink-soft); }
.tcgg-media.is-zoom { cursor: zoom-in; }
.tcgg-media img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.8,.2,1); }
.tcgg-media video { display: block; width: 100%; height: 100%; object-fit: cover; background: #000; }
.tcgg-card:hover .tcgg-media img { transform: scale(1.1) rotate(.6deg); }
.tcgg-over { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(42,10,63,0); transition: background .35s; }
.tcgg-media.is-zoom:hover .tcgg-over { background: rgba(42,10,63,.42); }
.tcgg-over span { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; background: var(--lime); color: var(--plum); border: 2px solid var(--plum); font-weight: 800; font-size: 15px; opacity: 0; transform: translateY(14px) scale(.9); transition: opacity .3s, transform .4s cubic-bezier(.3,1.6,.5,1); }
.tcgg-media.is-zoom:hover .tcgg-over span { opacity: 1; transform: none; }
.tcgg-sheen { position: absolute; top: 0; left: -120%; width: 55%; height: 100%; z-index: 2; pointer-events: none; background: linear-gradient(120deg, transparent, rgba(255,255,255,.5), transparent); transform: skewX(-20deg); transition: left .9s; }
.tcgg-card:hover .tcgg-sheen { left: 140%; }
.tcgg-num { position: absolute; top: 12px; left: 12px; z-index: 3; min-width: 34px; height: 34px; padding: 0 10px; border-radius: 12px; display: grid; place-items: center; background: var(--lime); color: var(--plum); border: 2px solid var(--plum); font-family: 'Bricolage Grotesque', sans-serif; font-size: 14px; font-weight: 800; pointer-events: none; transition: transform .4s cubic-bezier(.3,1.6,.5,1), background .3s, color .3s; }
.tcgg-card:hover .tcgg-num { transform: rotate(-8deg) scale(1.12); background: var(--plum); color: var(--lime); }
.tcgg-info { padding: 14px 18px 18px; border-top: 3px solid var(--plum); background: var(--cream); }
.tcgg-info h3 { font-size: 1.15rem; font-weight: 800; color: var(--plum); }
.tcgg-info p { margin-top: 4px; font-size: 14px; font-weight: 500; color: rgba(42,10,63,.72); line-height: 1.45; }

.tcgg-none { margin-top: 20px; text-align: center; padding: 26px; border: 3px dashed rgba(42,10,63,.35); border-radius: 22px; background: rgba(255,255,255,.55); font-weight: 700; color: rgba(42,10,63,.65); }

/* Lightbox */
.tcgg-lb { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 16px; font-family: 'DM Sans', system-ui, sans-serif; background: rgba(42,10,63,.94); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); animation: tcgg-fade .25s both; }
.tcgg-lb-content { display: flex; flex-direction: column; align-items: center; max-width: 100%; max-height: 100%; animation: tcgg-zoom .3s both; }
.tcgg-lb-content img { max-width: 100%; max-height: 78vh; object-fit: contain; border-radius: 20px; border: 4px solid var(--pink); box-shadow: 8px 8px 0 var(--lime); background: #fff; }
.tcgg-lb-cap { margin-top: 20px; text-align: center; color: #fff; }
.tcgg-lb-cap p:first-child { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(1.1rem, 3vw, 1.4rem); }
.tcgg-lb-count { display: inline-block; margin-top: 8px; padding: 4px 14px; border-radius: 999px; background: var(--lime); color: var(--plum); font-size: 13px; font-weight: 800; }
.tcgg-lb-btn {
  z-index: 20;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  border: 3px solid #ffffff;
  background: #FF69B4;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(255, 105, 180, 0.7);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform .25s, background .2s;
}

.tcgg-lb-btn:hover {
  background: #FF1493;
  color: #ffffff;
  transform: scale(1.12);
}
.tcgg-lb-btn:focus-visible { outline: 3px solid var(--lime); outline-offset: 3px; }
.tcgg-lb-x { position: absolute; top: 18px; right: 18px; }
.tcgg-lb-x:hover { transform: rotate(90deg) scale(1.12); }
.tcgg-lb-prev { position: absolute; left: 12px; }
.tcgg-lb-next { position: absolute; right: 12px; }
@media (min-width: 768px) { .tcgg-lb-prev { left: 32px; } .tcgg-lb-next { right: 32px; } }
@media (max-width: 520px) {
  .tcgg { padding: 44px 12px 64px; }
  .tcgg-card { border-radius: 20px; box-shadow: 4px 4px 0 var(--plum); }
  .tcgg-grid { gap: 22px; }
  .tcgg-lb-btn { width: 44px; height: 44px; }
}
@media (prefers-reduced-motion: reduce) { .tcgg *, .tcgg-lb, .tcgg-lb * { animation: none !important; transition: none !important; } }
`;

// Existing photos — preserved
const staticMediaItems = [
{ id: "static-1", type: "image", src: "/tcg_ground.jpeg", alt: "Tikone Cricket Academy Ground" },
{ id: "static-2", type: "image", src: "/tcg_pr1.jpg", alt: "Training Session" },
{ id: "static-3", type: "image", src: "/tcg_pr2.jpg", alt: "Match Day" },
{ id: "static-4", type: "image", src: "/tcg_pr4.jpg", alt: "Match Pr Day" },
{ id: "static-5", type: "image", src: "/U-14 TEAM PHOTO.jpg", alt: "U-14 Team" },
{ id: "static-6", type: "image", src: "/TCG U-13 MATCH.jpg", alt: "U-13 Match" },
{ id: "static-7", type: "image", src: "/21 DEC 25 MATCH PHOTO.jpeg", alt: "Match Photo" },
];

const MediaPage = () => {
const [uploadedMedia, setUploadedMedia] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [selectedImage, setSelectedImage] = useState(null);

// Fetch images and videos uploaded from Admin Dashboard
useEffect(() => {
const fetchMedia = async () => {
try {
setLoading(true);
setError("");

    const data = await mediaAPI.getAll();

    const formattedMedia = data.map((item) => ({
      id: item.id,
      type: item.mediaType,
      src: `${BACKEND_URL}${item.url}`,
      alt: item.title || "Tikone Cricket Gurukul Media",
      title: item.title || "",
      description: item.description || "",
      uploadDate: item.uploadDate,
    }));

    setUploadedMedia(formattedMedia);
  } catch (err) {
    console.error("Error loading media:", err);
    setError("Unable to load newly uploaded media. Please try again later.");
  } finally {
    setLoading(false);
  }
};

fetchMedia();

}, []);

// Combine existing photos and newly uploaded media
const allMedia = [...staticMediaItems, ...uploadedMedia];

// Only images are displayed in the image lightbox
const images = allMedia.filter((item) => item.type === "image");

const openImage = (item) => {
const index = images.findIndex((image) => image.id === item.id);
setSelectedImage(index);
};

const closeImage = () => setSelectedImage(null);

const showPrevious = (e) => {
e?.stopPropagation();
setSelectedImage((current) =>
current === 0 ? images.length - 1 : current - 1
);
};

const showNext = (e) => {
e?.stopPropagation();
setSelectedImage((current) =>
current === images.length - 1 ? 0 : current + 1
);
};

// Keyboard navigation
useEffect(() => {
if (selectedImage === null) return;

const handleKeyDown = (e) => {
  if (e.key === "Escape") closeImage();
  if (e.key === "ArrowLeft") showPrevious();
  if (e.key === "ArrowRight") showNext();
};

document.addEventListener("keydown", handleKeyDown);
document.body.style.overflow = "hidden";

return () => {
  document.removeEventListener("keydown", handleKeyDown);
  document.body.style.overflow = "";
};

}, [selectedImage, images.length]);

return (
<Layout>
<style>{styles}</style>

  <section className="tcgg">
    <span className="tcgg-blob" style={{ width: 340, height: 340, top: -90, left: "-6%", background: "#FFA8E0" }} />
    <span className="tcgg-blob" style={{ width: 300, height: 300, bottom: -80, right: "-4%", background: "#C6FF3D", opacity: 0.3, animationDelay: "3s" }} />
    <span className="tcgg-ball" style={{ width: 26, height: 26, top: "7%", right: "10%" }} />
    <span className="tcgg-ball" style={{ width: 16, height: 16, top: "42%", left: "4%", animationDelay: "1.2s" }} />
    <span className="tcgg-ball" style={{ width: 20, height: 20, bottom: "9%", right: "14%", animationDelay: "2s" }} />

    <div className="tcgg-wrap">

      {/* Heading */}
      <div className="tcgg-hero">
        <span className="tcgg-chip"><Camera size={14} /> Gallery</span>
        <h1 className="tcgg-title">
          Photos & Media
        </h1>

        <p className="tcgg-sub">
          Explore our gallery of images and videos from Tikone Cricket Gurukul.
          Relive our training sessions, matches and special moments.
        </p>
        <div className="tcgg-bar" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="tcgg-loading">
          <Loader2 size={22} />
          <span>Loading gallery...</span>
        </div>
      )}

      {/* API error */}
      {error && (
        <div className="tcgg-error">
          {error}
        </div>
      )}

      {/* Media count */}
      <div className="tcgg-count">
        <ImageIcon size={20} />
        <span>{allMedia.length} photos and videos</span>
      </div>

      {/* Gallery */}
      <div className="tcgg-grid">

        {allMedia.map((item, idx) => (
          <div
            key={item.id}
            className="tcgg-card"
            style={{ animationDelay: `${Math.min(idx * 70, 500) + 150}ms` }}
          >
            <span className="tcgg-num">{String(idx + 1).padStart(2, "0")}</span>
            <span className="tcgg-sheen" />
            {item.type === "image" ? (
              <div
                className="tcgg-media is-zoom"
                onClick={() => openImage(item)}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                />

                <div className="tcgg-over">
                  <span><ZoomIn size={18} /> View Image</span>
                </div>
              </div>
            ) : (
              <div className="tcgg-media">
                <video
                  src={item.src}
                  controls
                  preload="metadata"
                >
                  Your browser does not support video playback.
                </video>
              </div>
            )}

            {(item.title || item.description) && (
              <div className="tcgg-info">
                {item.title && (
                  <h3>
                    {item.title}
                  </h3>
                )}

                {item.description && (
                  <p>
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

      </div>

      {!loading && allMedia.length === 0 && (
        <p className="tcgg-none">
          No media available yet.
        </p>
      )}

    </div>
  </section>

  {/* Full-screen Image Preview */}
  {selectedImage !== null && images[selectedImage] && (
    <div
      className="tcgg-lb"
      onClick={closeImage}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      {/* Close button */}
      <button
        onClick={closeImage}
        className="tcgg-lb-btn tcgg-lb-x"
        aria-label="Close image preview"
      >
        <X size={26} />
      </button>

      {/* Previous */}
      {images.length > 1 && (
        <button
          onClick={showPrevious}
          className="tcgg-lb-btn tcgg-lb-prev"
          aria-label="Previous image"
        >
          <ChevronLeft size={30} />
        </button>
      )}

      {/* Image */}
      <div
        className="tcgg-lb-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={images[selectedImage].id}
          src={images[selectedImage].src}
          alt={images[selectedImage].alt}
        />

        <div className="tcgg-lb-cap">
          <p>
            {images[selectedImage].title || images[selectedImage].alt}
          </p>

          <span className="tcgg-lb-count">
            {selectedImage + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={showNext}
          className="tcgg-lb-btn tcgg-lb-next"
          aria-label="Next image"
        >
          <ChevronRight size={30} />
        </button>
      )}
    </div>
  )}

</Layout>

);
};

export default MediaPage;
