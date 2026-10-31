import React from "react";
import Layout from "../components/layout/Layout";
import { Camera } from "lucide-react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgg {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  position: relative; overflow: hidden; min-height: 100vh; padding: 64px 16px 88px;
  background: linear-gradient(135deg, var(--cream) 0%, var(--pink-soft) 55%, var(--pink) 130%);
}
.tcgg *, .tcgg *::before, .tcgg *::after { box-sizing: border-box; }
.tcgg h1 { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -.03em; margin: 0; }
.tcgg p { margin: 0; }

@keyframes tcgg-float { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-22px) rotate(10deg) } }
@keyframes tcgg-blob { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(26px,-30px) scale(1.12) } }
@keyframes tcgg-in { from { opacity: 0; transform: translateY(30px) scale(.95) } to { opacity: 1; transform: none } }
@keyframes tcgg-shimmer { to { background-position: 200% center } }
@keyframes tcgg-wiggle { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3deg) } }

.tcgg-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: .5; pointer-events: none; animation: tcgg-blob 12s ease-in-out infinite; }
.tcgg-ball { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%); box-shadow: inset -3px -4px 8px rgba(0,0,0,.25), 0 6px 12px rgba(42,10,63,.2); animation: tcgg-float 6s ease-in-out infinite; opacity: .8; }
.tcgg-wrap { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; }

.tcgg-hero { text-align: center; margin-bottom: 48px; animation: tcgg-in .7s cubic-bezier(.2,.8,.2,1) both; }
.tcgg-chip { display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: 999px; background: var(--plum); color: var(--lime); font-size: 12.5px; font-weight: 800; margin-bottom: 16px; animation: tcgg-wiggle 2.6s ease-in-out infinite; }
.tcgg-title { font-weight: 800; line-height: 1.02; font-size: clamp(2.3rem, 7vw, 4rem);
  background: linear-gradient(90deg, var(--plum), #b0108a, var(--plum-2), #b0108a, var(--plum)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcgg-shimmer 5s linear infinite; }
.tcgg-sub { max-width: 560px; margin: 14px auto 0; font-size: clamp(1rem, 2.4vw, 1.15rem); font-weight: 500; line-height: 1.55; color: rgba(42,10,63,.75); }
.tcgg-bar { width: 90px; height: 8px; margin: 22px auto 0; border-radius: 999px; background: var(--lime); border: 2px solid var(--plum); }

.tcgg-grid { display: grid; gap: 30px; grid-template-columns: 1fr; }
@media (min-width: 640px) { .tcgg-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .tcgg-grid { grid-template-columns: repeat(3, 1fr); } }

.tcgg-card { position: relative; overflow: hidden; background: #fff; border: 3px solid var(--plum); border-radius: 26px; box-shadow: 7px 7px 0 var(--plum); animation: tcgg-in .7s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i) * 90ms + 200ms); transition: transform .35s cubic-bezier(.3,1.6,.5,1), box-shadow .35s; }
.tcgg-card:nth-child(3n+1) { --tilt: -1.2deg; }
.tcgg-card:nth-child(3n+2) { --tilt: .8deg; }
.tcgg-card:nth-child(3n) { --tilt: -.6deg; }
.tcgg-card:hover { transform: translate(-4px,-8px) rotate(var(--tilt)); box-shadow: 11px 15px 0 var(--plum); }
.tcgg-media { position: relative; overflow: hidden; height: 256px; background: var(--pink-soft); }
.tcgg-media img, .tcgg-media video { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.8,.2,1); }
.tcgg-card:hover .tcgg-media img, .tcgg-card:hover .tcgg-media video { transform: scale(1.1) rotate(.6deg); }
.tcgg-media::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, transparent 55%, rgba(42,10,63,.45)); opacity: 0; transition: opacity .4s; }
.tcgg-card:hover .tcgg-media::after { opacity: 1; }
.tcgg-sheen { position: absolute; top: 0; left: -120%; width: 55%; height: 100%; z-index: 2; pointer-events: none; background: linear-gradient(120deg, transparent, rgba(255,255,255,.5), transparent); transform: skewX(-20deg); transition: left .9s; }
.tcgg-card:hover .tcgg-sheen { left: 140%; }
.tcgg-num { position: absolute; top: 12px; left: 12px; z-index: 3; min-width: 34px; height: 34px; padding: 0 10px; border-radius: 12px; display: grid; place-items: center; background: var(--lime); color: var(--plum); border: 2px solid var(--plum); font-family: 'Bricolage Grotesque', sans-serif; font-size: 14px; font-weight: 800; transition: transform .4s cubic-bezier(.3,1.6,.5,1), background .3s, color .3s; }
.tcgg-card:hover .tcgg-num { transform: rotate(-8deg) scale(1.12); background: var(--plum); color: var(--lime); }

@media (max-width: 520px) {
  .tcgg { padding: 44px 12px 64px; }
  .tcgg-card { border-radius: 20px; box-shadow: 4px 4px 0 var(--plum); }
  .tcgg-grid { gap: 22px; }
}
@media (prefers-reduced-motion: reduce) { .tcgg *, .tcgg *::before { animation: none !important; transition: none !important; } }
`;

const mediaItems = [
  { type: "image", src: "/tcg_ground.jpeg", alt: "Tikone Cricket Academy Ground" },
  { type: "image", src: "/tcg_pr1.jpg", alt: "Training Session" },
  { type: "image", src: "/tcg_pr2.jpg", alt: "Match Day" },
  { type: "image", src: "/tcg_pr4.jpg", alt: "Match Pr Day" },
  { type: "image", src: "/U-14 TEAM PHOTO.jpg", alt: "pr" },
  { type: "image", src: "/TCG U-13 MATCH.jpg", alt: "pr" },
  { type: "image", src: "/21 DEC 25 MATCH PHOTO.jpeg", alt: "pr" },
];

const MediaPage = () => {
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
          <div className="tcgg-hero">
            <span className="tcgg-chip"><Camera size={14} /> Gallery</span>
            <h1 className="tcgg-title">Photos & Media</h1>
            <p className="tcgg-sub">
              Explore our gallery of images and videos from Tikone Cricket Gurukul
            </p>
            <div className="tcgg-bar" />
          </div>

          <div className="tcgg-grid">
            {mediaItems.map((item, idx) => (
              <div key={idx} className="tcgg-card" style={{ "--i": idx }}>
                <span className="tcgg-num">{String(idx + 1).padStart(2, "0")}</span>
                <span className="tcgg-sheen" />
                <div className="tcgg-media">
                  {item.type === "image" ? (
                    <img src={item.src} alt={item.alt} loading="lazy" />
                  ) : (
                    <video
                      src={item.src}
                      controls
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MediaPage;


