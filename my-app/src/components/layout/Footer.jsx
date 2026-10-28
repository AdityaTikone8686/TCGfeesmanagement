import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";
import useVisitors from "../../hooks/useVisitors";
import AnimatedNumber from "../ui/AnimatedNumber";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgf {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D;
  font-family: 'DM Sans', system-ui, sans-serif;
  position: relative; overflow: hidden;
  background: var(--plum); color: rgba(255,255,255,.82);
}
.tcgf * { box-sizing: border-box; }
@keyframes tcgf-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes tcgf-float { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(24px,-22px) scale(1.12) } }
@keyframes tcgf-ping { 0% { box-shadow: 0 0 0 0 rgba(198,255,61,.9) } 100% { box-shadow: 0 0 0 10px rgba(198,255,61,0) } }
@keyframes tcgf-wiggle { 0%,100% { transform: rotate(0) } 25% { transform: rotate(-12deg) } 75% { transform: rotate(12deg) } }
@keyframes tcgf-shimmer { to { background-position: 200% center } }

/* pink strip on top */
.tcgf-strip { background: var(--pink); color: var(--plum); border-bottom: 3px solid var(--plum); overflow: hidden; padding: 12px 0; }
.tcgf-strip-track { display: flex; width: max-content; animation: tcgf-marquee 28s linear infinite; }
.tcgf-strip:hover .tcgf-strip-track { animation-play-state: paused; }
.tcgf-strip span { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 18px; padding: 0 24px; white-space: nowrap; display: inline-flex; gap: 24px; align-items: center; }

.tcgf-blob { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; }
.tcgf-wrap { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 56px 16px 28px; }
@media (min-width: 640px) { .tcgf-wrap { padding-top: 72px; } }
.tcgf-grid { display: grid; grid-template-columns: 1fr; gap: 40px; }
@media (min-width: 768px) { .tcgf-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .tcgf-grid { grid-template-columns: 1.3fr .8fr .9fr 1.3fr; gap: 48px; } }

.tcgf-brand { display: flex; align-items: center; gap: 12px; }
.tcgf-logo { width: 48px; height: 48px; border-radius: 14px; background: #fff; border: 3px solid var(--pink); overflow: hidden; box-shadow: 3px 3px 0 var(--pink); transition: transform .35s cubic-bezier(.3,1.6,.5,1); }
.tcgf-brand:hover .tcgf-logo { transform: rotate(-8deg) scale(1.08); }
.tcgf-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
.tcgf-title { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 22px; letter-spacing: -.02em; line-height: 1.05;
  background: linear-gradient(90deg, #fff, var(--pink), #fff, var(--pink)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcgf-shimmer 6s linear infinite; }
.tcgf-about { margin: 20px 0 0; font-size: 14px; line-height: 1.75; color: rgba(255,255,255,.72); }

.tcgf-social { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
.tcgf-soc { width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; background: rgba(255,255,255,.08); border: 2px solid rgba(255,168,224,.5); color: var(--pink); text-decoration: none; font-weight: 800; font-size: 15px; transition: transform .3s cubic-bezier(.3,1.6,.5,1), background .25s, color .25s, box-shadow .25s; }
.tcgf-soc:hover { background: var(--pink); color: var(--plum); transform: translateY(-6px) rotate(-6deg); box-shadow: 4px 4px 0 var(--lime); }
.tcgf-soc:hover svg { animation: tcgf-wiggle .5s; }

.tcgf h3 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 20px; font-weight: 800; color: #fff; margin: 0 0 22px; position: relative; display: inline-block; }
.tcgf h3::after { content: ''; position: absolute; left: 0; bottom: -8px; width: 44px; height: 5px; border-radius: 4px; background: var(--pink); transition: width .4s; }
.tcgf-col:hover h3::after { width: 100%; }
.tcgf ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }

.tcgf-qlink { display: inline-flex; align-items: center; gap: 10px; color: rgba(255,255,255,.78); text-decoration: none; font-size: 15px; font-weight: 500; transition: color .2s, transform .25s; }
.tcgf-qlink svg { color: var(--pink); transition: transform .25s; }
.tcgf-qlink:hover { color: var(--lime); transform: translateX(6px); }
.tcgf-qlink:hover svg { transform: translateX(4px); color: var(--lime); }

.tcgf-serv { display: flex; align-items: center; gap: 12px; font-size: 15px; transition: transform .25s, color .25s; }
.tcgf-serv:hover { transform: translateX(6px); color: #fff; }
.tcgf-serv i { width: 10px; height: 10px; border-radius: 50%; background: var(--lime); flex-shrink: 0; transition: transform .3s; }
.tcgf-serv:hover i { transform: scale(1.5); background: var(--pink); }

.tcgf-contact { display: grid; gap: 14px; }
.tcgf-crow { display: flex; align-items: flex-start; gap: 14px; padding: 12px; border-radius: 16px; border: 2px solid transparent; transition: background .25s, border-color .25s, transform .25s; }
.tcgf-crow:hover { background: rgba(255,255,255,.07); border-color: rgba(255,168,224,.5); transform: translateX(4px); }
.tcgf-cic { width: 38px; height: 38px; border-radius: 12px; background: var(--pink); color: var(--plum); display: grid; place-items: center; flex-shrink: 0; transition: transform .4s cubic-bezier(.3,1.6,.5,1); }
.tcgf-crow:hover .tcgf-cic { transform: rotate(360deg) scale(1.1); background: var(--lime); }
.tcgf-crow p { margin: 0; font-size: 14px; line-height: 1.6; color: rgba(255,255,255,.8); }

.tcgf-bottom { margin-top: 48px; padding-top: 24px; border-top: 2px dashed rgba(255,168,224,.35); display: flex; flex-direction: column; align-items: center; gap: 18px; }
@media (min-width: 768px) { .tcgf-bottom { flex-direction: row; justify-content: space-between; } }
.tcgf-visit { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; }
.tcgf-pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; background: rgba(255,255,255,.08); border: 2px solid rgba(255,168,224,.5); font-weight: 600; color: rgba(255,255,255,.85); }
.tcgf-pill b { color: var(--lime); font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; }
.tcgf-live { width: 10px; height: 10px; border-radius: 50%; background: var(--lime); animation: tcgf-ping 1.6s infinite; }
.tcgf-copy { margin: 0; font-size: 13px; text-align: center; color: rgba(255,255,255,.65); }
.tcgf-legal { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 18px; font-size: 13px; }
.tcgf-legal a { position: relative; color: rgba(255,255,255,.72); text-decoration: none; transition: color .2s; }
.tcgf-legal a::after { content: ''; position: absolute; left: 0; bottom: -3px; height: 2px; width: 0; background: var(--pink); transition: width .3s; }
.tcgf-legal a:hover { color: var(--pink); }
.tcgf-legal a:hover::after { width: 100%; }

@media (prefers-reduced-motion: reduce) { .tcgf, .tcgf * { animation: none !important; transition: none !important; } }
`;

const MARQUEE = [
  "Expert Coaches",
  "Modern Facilities",
  "Proven Results",
  "Flexible Plans",
  "Champions Made Here",
];

export default function Footer() {
  const { total, live } = useVisitors();

  return (
    <footer className="tcgf">
      <style>{styles}</style>

      <div className="tcgf-strip" aria-hidden="true">
        <div className="tcgf-strip-track">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>
              {t} <span style={{ padding: 0 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="tcgf-blob" style={{ width: 320, height: 320, background: "var(--pink)", opacity: 0.2, top: 40, left: -100, animation: "tcgf-float 14s ease-in-out infinite" }} />
      <div className="tcgf-blob" style={{ width: 260, height: 260, background: "var(--lime)", opacity: 0.12, bottom: -60, right: "10%", animation: "tcgf-float 16s ease-in-out infinite reverse" }} />

      <div className="tcgf-wrap">
        <div className="tcgf-grid">

          {/* Brand Section */}
          <div>
            <div className="tcgf-brand">
              <div className="tcgf-logo">
                <img src="/TikoneCricketGurukul1.png" alt="Logo" />
              </div>
              <span className="tcgf-title">Tikone Cricket Gurukul</span>
            </div>

            <p className="tcgf-about">
              Professional cricket coaching with state-of-the-art facilities.
              Join hundreds of students who have transformed their game with our
              expert coaching.
            </p>

            <div className="tcgf-social">
              <a
                href="https://www.instagram.com/officialtikonecricketgurukul/"
                target="_blank"
                rel="noreferrer"
                className="tcgf-soc"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" size={20} />
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/main_tcg?s=21"
                target="_blank"
                rel="noreferrer"
                className="tcgf-soc"
                aria-label="X"
              >
                <span>X</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1QUmmojSSn/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="tcgf-soc"
                aria-label="Facebook"
              >
                <span>f</span>
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.com/@officialtikonecricketgurukul?igshid=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noreferrer"
                className="tcgf-soc"
                aria-label="Threads"
              >
                <span>@</span>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@officialtikonecricketgurukul?si=23hnVurVkNuVoqbk"
                target="_blank"
                rel="noreferrer"
                className="tcgf-soc"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="tcgf-col">
            <h3>Quick Links</h3>
            <ul>
              {[
                { to: "/#", label: "Home" },
                { to: "/admin/login", label: "Admin Portal" },
                { to: "/student/login", label: "Student Portal" },
                { to: "/student/register", label: "Register" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="tcgf-qlink">
                    <ArrowRight size={16} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="tcgf-col">
            <h3>Our Services</h3>
            <ul>
              {[
                "Batting Training",
                "Bowling Practice",
                "Fielding Skills",
                "Match Practice",
                "Fitness Training",
              ].map((service) => (
                <li key={service} className="tcgf-serv">
                  <i></i>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="tcgf-col">
            <h3>Contact Us</h3>

            <div className="tcgf-contact">
              <div className="tcgf-crow">
                <div className="tcgf-cic"><MapPin size={18} /></div>
                <p>
                  Boat Club, near Kazu Devi Temple, Sector 33, Thergaon, Pune –
                  411033
                </p>
              </div>

              <div className="tcgf-crow">
                <div className="tcgf-cic"><Phone size={18} /></div>
                <p>
                  +91 9881332092<br />
                  +91 9881998200
                </p>
              </div>

              <div className="tcgf-crow">
                <div className="tcgf-cic"><Mail size={18} /></div>
                <p style={{ wordBreak: "break-all" }}>
                  tikonecricketgurukul@gmail.com
                </p>
              </div>

              <div className="tcgf-crow">
                <div className="tcgf-cic"><Clock size={18} /></div>
                <p>
                  Mon–Sat: 4:00 PM – 7:00 PM<br />
                  Sun: 7:30 AM – 9:30 AM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="tcgf-bottom">
          <div className="tcgf-visit">
            <div className="tcgf-pill">
              <span className="tcgf-live" />
              Live:
              <b>
                <AnimatedNumber value={live} />
              </b>
            </div>

            <div className="tcgf-pill">
              Total:
              <b>
                <AnimatedNumber value={total} />
              </b>
            </div>
          </div>

          import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";
import useVisitors from "../../hooks/useVisitors";
import AnimatedNumber from "../ui/AnimatedNumber";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgf {
  --pink: #FFA8E0;
  --pink-soft: #FFD3F0;
  --plum: #2A0A3F;
  --plum-2: #4A1470;
  --lime: #C6FF3D;
  --white: #FFFFFF;

  font-family: 'DM Sans', system-ui, sans-serif;
  position: relative;
  overflow: hidden;
  isolation: isolate;

  /* Main footer background */
  background: #FFA8E0;
  color: #2A0A3F;
}

.tcgf * {
  box-sizing: border-box;
}

/* ==============================
   ANIMATIONS
============================== */

@keyframes tcgf-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes tcgf-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(24px, -22px) scale(1.12);
  }
}

@keyframes tcgf-ping {
  0% {
    box-shadow: 0 0 0 0 rgba(74, 20, 112, .55);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(74, 20, 112, 0);
  }
}

@keyframes tcgf-wiggle {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-12deg); }
  75% { transform: rotate(12deg); }
}

@keyframes tcgf-shimmer {
  to { background-position: 200% center; }
}

/* ==============================
   TOP MARQUEE STRIP
============================== */

.tcgf-strip {
  background: #2A0A3F;
  color: #FFA8E0;
  border-bottom: 3px solid #4A1470;
  overflow: hidden;
  padding: 12px 0;
}

.tcgf-strip-track {
  display: flex;
  width: max-content;
  animation: tcgf-marquee 28s linear infinite;
}

.tcgf-strip:hover .tcgf-strip-track {
  animation-play-state: paused;
}

.tcgf-strip span {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 18px;
  padding: 0 24px;
  white-space: nowrap;
  display: inline-flex;
  gap: 24px;
  align-items: center;
}

/* ==============================
   DECORATIVE BLOBS
============================== */

.tcgf-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
  z-index: -1;
}

/* ==============================
   MAIN LAYOUT
============================== */

.tcgf-wrap {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 16px 28px;
}

@media (min-width: 640px) {
  .tcgf-wrap {
    padding-top: 72px;
  }
}

.tcgf-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

@media (min-width: 768px) {
  .tcgf-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .tcgf-grid {
    grid-template-columns: 1.3fr .8fr .9fr 1.3fr;
    gap: 48px;
  }
}

/* ==============================
   BRAND AND LOGO
============================== */

.tcgf-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tcgf-logo {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #FFFFFF;
  border: 3px solid #2A0A3F;
  overflow: hidden;
  box-shadow: 3px 3px 0 #4A1470;
  transition:
    transform .35s cubic-bezier(.3, 1.6, .5, 1),
    box-shadow .3s;
}

.tcgf-brand:hover .tcgf-logo {
  transform: rotate(-8deg) scale(1.08);
  box-shadow: 4px 4px 0 #4A1470;
}

.tcgf-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.tcgf-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -.02em;
  line-height: 1.2;

  background: linear-gradient(
    90deg,
    #2A0A3F,
    #4A1470,
    #2A0A3F,
    #4A1470
  );

  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: tcgf-shimmer 6s linear infinite;
}

.tcgf-about {
  margin: 20px 0 0;
  font-size: 14px;
  line-height: 1.75;
  color: #4A1470;
}

/* ==============================
   SOCIAL MEDIA ICONS
============================== */

.tcgf-social {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.tcgf-soc {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 14px;

  display: grid;
  place-items: center;

  background: rgba(255, 255, 255, .55);
  border: 2px solid #4A1470;
  color: #2A0A3F;

  text-decoration: none;
  font-weight: 800;
  font-size: 17px;

  transition:
    transform .3s cubic-bezier(.3, 1.6, .5, 1),
    background .25s,
    color .25s,
    box-shadow .25s;
}

.tcgf-soc:hover {
  background: #2A0A3F;
  color: #FFFFFF;
  transform: translateY(-6px) rotate(-6deg);
  box-shadow: 4px 4px 0 #4A1470;
}

.tcgf-soc:hover svg {
  animation: tcgf-wiggle .5s;
}

/* ==============================
   SECTION HEADINGS
============================== */

.tcgf h3 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #2A0A3F;
  margin: 0 0 22px;
  position: relative;
  display: inline-block;
}

.tcgf h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 44px;
  height: 5px;
  border-radius: 4px;
  background: #4A1470;
  transition: width .4s;
}

.tcgf-col:hover h3::after {
  width: 100%;
}

.tcgf ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

/* ==============================
   QUICK LINKS
============================== */

.tcgf-qlink {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  color: #2A0A3F;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;

  transition:
    color .2s,
    transform .25s;
}

.tcgf-qlink svg {
  color: #4A1470;
  flex-shrink: 0;
  transition:
    transform .25s,
    color .25s;
}

.tcgf-qlink:hover {
  color: #4A1470;
  transform: translateX(6px);
}

.tcgf-qlink:hover svg {
  transform: translateX(4px);
  color: #4A1470;
}

/* ==============================
   SERVICES
============================== */

.tcgf-serv {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #2A0A3F;

  transition:
    transform .25s,
    color .25s;
}

.tcgf-serv:hover {
  transform: translateX(6px);
  color: #4A1470;
}

.tcgf-serv i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4A1470;
  border: 2px solid rgba(255, 255, 255, .7);
  flex-shrink: 0;
  transition:
    transform .3s,
    background .3s;
}

.tcgf-serv:hover i {
  transform: scale(1.5);
  background: #2A0A3F;
}

/* ==============================
   CONTACT SECTION
============================== */

.tcgf-contact {
  display: grid;
  gap: 14px;
}

.tcgf-crow {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px;
  border-radius: 16px;
  border: 2px solid transparent;

  transition:
    background .25s,
    border-color .25s,
    transform .25s;
}

.tcgf-crow:hover {
  background: rgba(255, 255, 255, .3);
  border-color: rgba(74, 20, 112, .35);
  transform: translateX(4px);
}

.tcgf-cic {
  width: 38px;
  height: 38px;
  border-radius: 12px;

  background: #2A0A3F;
  color: #FFFFFF;

  display: grid;
  place-items: center;
  flex-shrink: 0;

  transition:
    transform .4s cubic-bezier(.3, 1.6, .5, 1),
    background .25s;
}

.tcgf-crow:hover .tcgf-cic {
  transform: rotate(360deg) scale(1.1);
  background: #4A1470;
  color: #FFFFFF;
}

.tcgf-crow p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #2A0A3F;
}

/* ==============================
   BOTTOM SECTION
============================== */

.tcgf-bottom {
  margin-top: 48px;
  padding-top: 24px;

  border-top: 2px dashed rgba(42, 10, 63, .35);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

@media (min-width: 768px) {
  .tcgf-bottom {
    flex-direction: row;
    justify-content: space-between;
  }
}

/* ==============================
   VISITOR COUNTERS
============================== */

.tcgf-visit {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
}

.tcgf-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;

  background: rgba(255, 255, 255, .55);
  border: 2px solid rgba(42, 10, 63, .3);

  font-weight: 600;
  color: #2A0A3F;
}

.tcgf-pill b {
  color: #4A1470;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
}

.tcgf-live {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4A1470;
  flex-shrink: 0;
  animation: tcgf-ping 1.6s infinite;
}

/* ==============================
   COPYRIGHT
============================== */

.tcgf-copy {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
  color: #4A1470;
}

/* ==============================
   LEGAL LINKS
============================== */

.tcgf-legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 18px;
  font-size: 13px;
}

.tcgf-legal a {
  position: relative;
  color: #2A0A3F;
  text-decoration: none;

  transition: color .2s;
}

.tcgf-legal a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  height: 2px;
  width: 0;
  background: #4A1470;
  transition: width .3s;
}

.tcgf-legal a:hover {
  color: #4A1470;
}

.tcgf-legal a:hover::after {
  width: 100%;
}

/* ==============================
   KEYBOARD ACCESSIBILITY
============================== */

.tcgf a:focus-visible {
  outline: 3px solid #4A1470;
  outline-offset: 4px;
  border-radius: 4px;
}

/* ==============================
   REDUCED MOTION
============================== */

@media (prefers-reduced-motion: reduce) {
  .tcgf,
  .tcgf *,
  .tcgf *::before,
  .tcgf *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
`;

const MARQUEE = [
  "Expert Coaches",
  "Modern Facilities",
  "Proven Results",
  "Flexible Plans",
  "Champions Made Here",
];

export default function Footer() {
  const { total, live } = useVisitors();

  return (
    <footer className="tcgf">
      <style>{styles}</style>

      {/* Top scrolling strip */}
      <div className="tcgf-strip" aria-hidden="true">
        <div className="tcgf-strip-track">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>
              {t} <span style={{ padding: 0 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Decorative background animations */}
      <div
        className="tcgf-blob"
        aria-hidden="true"
        style={{
          width: 320,
          height: 320,
          background: "#4A1470",
          opacity: 0.12,
          top: 40,
          left: -100,
          animation: "tcgf-float 14s ease-in-out infinite",
        }}
      />

      <div
        className="tcgf-blob"
        aria-hidden="true"
        style={{
          width: 260,
          height: 260,
          background: "#FFFFFF",
          opacity: 0.3,
          bottom: -60,
          right: "10%",
          animation: "tcgf-float 16s ease-in-out infinite reverse",
        }}
      />

      <div className="tcgf-wrap">
        <div className="tcgf-grid">

          {/* Brand Section */}
          <div>
            <div className="tcgf-brand">
              <div className="tcgf-logo">
                <img
                  src="/TikoneCricketGurukul1.png"
                  alt="Tikone Cricket Gurukul Logo"
                />
              </div>

              <span className="tcgf-title">
                Tikone Cricket Gurukul
              </span>
            </div>

            <p className="tcgf-about">
              Professional cricket coaching with state-of-the-art facilities.
              Join hundreds of students who have transformed their game with our
              expert coaching.
            </p>

            {/* Social Media */}
            <div className="tcgf-social">

              <a
                href="https://www.instagram.com/officialtikonecricketgurukul/"
                target="_blank"
                rel="noreferrer"
                className="tcgf-soc"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>

              {/* X */}
              <a
                href="https://x.com/main_tcg?s=21"
                target="_blank"
                rel="noreferrer"
                className="tcgf-soc"
                aria-label="X"
              >
                <span>X</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1QUmmojSSn/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="tcgf-soc"
                aria-label="Facebook"
              >
                <span>f</span>
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.com/@officialtikonecricketgurukul?igshid=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noreferrer"
                className="tcgf-soc"
                aria-label="Threads"
              >
                <span>@</span>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@officialtikonecricketgurukul?si=23hnVurVkNuVoqbk"
                target="_blank"
                rel="noreferrer"
                className="tcgf-soc"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div className="tcgf-col">
            <h3>Quick Links</h3>

            <ul>
              {[
                { to: "/#", label: "Home" },
                { to: "/admin/login", label: "Admin Portal" },
                { to: "/student/login", label: "Student Portal" },
                { to: "/student/register", label: "Register" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="tcgf-qlink">
                    <ArrowRight size={16} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="tcgf-col">
            <h3>Our Services</h3>

            <ul>
              {[
                "Batting Training",
                "Bowling Practice",
                "Fielding Skills",
                "Match Practice",
                "Fitness Training",
              ].map((service) => (
                <li key={service} className="tcgf-serv">
                  <i aria-hidden="true" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="tcgf-col">
            <h3>Contact Us</h3>

            <div className="tcgf-contact">

              <div className="tcgf-crow">
                <div className="tcgf-cic">
                  <MapPin size={18} />
                </div>

                <p>
                  Boat Club, near Kazu Devi Temple, Sector 33, Thergaon, Pune –
                  411033
                </p>
              </div>

              <div className="tcgf-crow">
                <div className="tcgf-cic">
                  <Phone size={18} />
                </div>

                <p>
                  +91 9881332092
                  <br />
                  +91 9881998200
                </p>
              </div>

              <div className="tcgf-crow">
                <div className="tcgf-cic">
                  <Mail size={18} />
                </div>

                <p style={{ wordBreak: "break-all" }}>
                  tikonecricketgurukul@gmail.com
                </p>
              </div>

              <div className="tcgf-crow">
                <div className="tcgf-cic">
                  <Clock size={18} />
                </div>

                <p>
                  Mon–Sat: 4:00 PM – 7:00 PM
                  <br />
                  Sun: 7:30 AM – 9:30 AM
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="tcgf-bottom">

          {/* Visitor Counters */}
          <div className="tcgf-visit">

            <div className="tcgf-pill">
              <span className="tcgf-live" aria-hidden="true" />

              <span>Live:</span>

              <b>
                <AnimatedNumber value={live} />
              </b>
            </div>

            <div className="tcgf-pill">
              <span>Total:</span>

              <b>
                <AnimatedNumber value={total} />
              </b>
            </div>

          </div>

          {/* Copyright */}
          <p className="tcgf-copy">
            © 2026 Tikone Cricket Gurukul | All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="tcgf-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
