import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const products = [
  { id: 1, name: "NEW BALANCE TC 100i KASHMIR WILLOW CRICKET BAT", img: "/dsc wildfire ember.webp", mrp: "₹2,319", price: 2899, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 2, name: "GRAY-NICOLLS JUMBO KASHMIR WILLOW CRICKET BAT", img: "/gray nicols jumbo.webp", mrp: "₹7,799", price: 5849, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 3, name: "DSC WILDFIRE FALCON KASHMIR WILLOW CRICKET BAT", img: "/dsc falcon.webp", mrp: "₹2,699", price: 2159, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 4, name: "SF CANNON KASHMIR WILLOW CRICKET BAT", img: "/sf cannon.webp", mrp: "₹1,632", price: 2040, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 5, name: "KOOKABURA PLAYERS EDITION KASHMIR WILLOW CRICKET BAT", img: "/kookbura players edition.webp", mrp: "₹6,299", price: 5039, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 6, name: "GRAY-NICOLLS SUPRA BLAZER KASHMIR WILLOW CRICKET BAT", img: "/Gray-Nicolls_Supra_Blazer_Kashmir_Willow_Cricket_Bat-01_1500x.webp", mrp: "₹3,999", price: 2999, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 7, name: "DSC WILDFIRE EMBER KASHMIR WILLOW CRICKET BAT", img: "/dsc wildfire ember.webp", mrp: "₹2,699", price: 2159, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 8, name: "SG KLR FLICKER KASHMIR WILLOW CRICKET BAT", img: "/sg klr flicker.webp", mrp: "₹2,699", price: 2159, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 9, name: "SS PLAYER JUMBO KASHMIR WILLOW CRICKET BAT", img: "/ss player jambo.webp", mrp: "₹3,300", price: 2784, discount: "16% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 10, name: "SG STROKEWELL CLASSIC KASHMIR WILLOW CRICKET BAT", img: "/sg strokewell classic.webp", mrp: "₹3,499", price: 3149, discount: "10% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 11, name: "KOOKABURA PRODIGY 2L0 KASHMIR WILLOW CRICKET BAT", img: "/kookabura prodigy 2.0.webp", mrp: "₹2,490", price: 1992, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 12, name: "NEW BALANCE DC 100i KASHMIR WILLOW CRICKET BAT", img: "/nb dc 100i.webp", mrp: "₹2,899", price: 2319, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 13, name: "NEW BALANCE TC 200i KASHMIR WILLOW CRICKET BAT", img: "/nb tc 200i.webp", mrp: "₹3,399", price: 2719, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 14, name: "DSC MASTER 2000 KASHMIR WILLOW CRICKET BAT", img: "/dsc master 2000.webp", mrp: "₹2,959", price: 2219, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 15, name: "SS SKY SUPER KASHMIR WILLOW CRICKET BAT", img: "/ss sky super.webp", mrp: "₹2,650", price: 2120, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 16, name: "DSC WILDFIRE FLARE KASHMIR WILLOW CRICKET BAT", img: "/dsc wildfire flare.webp", mrp: "₹2,899", price: 2174, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 17, name: "DSC WILDFIRE HEAT KASHMIR WILLOW CRICKET BAT", img: "/dsc wildfire heat.webp", mrp: "₹3,075", price: 2306, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 18, name: "DSC WILDFIRE VOLCANO KASHMIR WILLOW CRICKET BAT", img: "/dsc wildfire volcano.webp", mrp: "₹2,775", price: 2081, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 19, name: "KOOKABURA AURA PRO 9.0 KASHMIR WILLOW CRICKET BAT", img: "/kookabura aura.webp", mrp: "₹2,699", price: 2159, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 20, name: "DSC WILDFIRE MAGMA KASHMIR WILLOW CRICKET BAT", img: "/dsc wildfire magma.webp", mrp: "₹3,275", price: 2459, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 21, name: "DSC PENTAZONE KASHMIR WILLOW CRICKET BAT", img: "/dsc pentazone.webp", mrp: "₹3,409", price: 2556, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 22, name: "SG THUNDER PLUS KASHMIR WILLOW CRICKET BAT", img: "/sg thunder plus.webp", mrp: "₹2,499", price: 1874, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 23, name: "SS 281 KASHMIR WILLOW CRICKET BAT", img: "/ss 281.webp", mrp: "₹3,130", price: 2347, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 24, name: "TON MAXIMUS KASHMIR WILLOW CRICKET BAT", img: "/ss ton maximus.webp", mrp: "₹2,930", price: 2472, discount: "16% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 25, name: "SG KLR SPARK KASHMIR WILLOW CRICKET BAT", img: "/sg klr spark.webp", mrp: "₹2,899", price: 2319, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 26, name: "SG RSD KASHMIR WILLOW CRICKET BAT", img: "/SG_RSD_Spark_Kashmir_Willow_Cricket_Bat_1066x.webp", mrp: "₹2,749", price: 2199, discount: "20% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 27, name: "MRF CHAMP KASHMIR WILLOW CRICKET BAT", img: "/mrf chaamp best.webp", mrp: "₹2,820", price: 2115, discount: "25% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 28, name: "SS GUTSY KASHMIR WILLOW CRICKET BAT", img: "/ss gutsyy.jpg", mrp: "₹3,110", price: 2706, discount: "13% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 29, name: "SS KLASSEN KASHMIR WILLOW CRICKET BAT", img: "/ss klassen.jpg", mrp: "₹3,010", price: 2619, discount: "13% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 30, name: "SS CLUB VELLUM KASHMIR WILLOW CRICKET BAT", img: "/ss club vellum.jpg", mrp: "₹3,010", price: 2619, discount: "13% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 31, name: "SS SUPER POWER KASHMIR WILLOW CRICKET BAT", img: "/ss super power.jpg", mrp: "₹2,970", price: 2584, discount: "13% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 32, name: "SS POWER KASHMIR WILLOW CRICKET BAT", img: "/ss power kashmir.jpg", mrp: "₹2,920", price: 2540, discount: "13% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 33, name: "SS TILAK VERMA KASHMIR WILLOW CRICKET BAT", img: "/ss tilak.jpg", mrp: "₹2,453", price: 2820, discount: "13% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 34, name: "SS SKY STUNNER KASHMIR WILLOW CRICKET BAT", img: "/ss sky stunner.jpg", mrp: "₹2,453", price: 2820, discount: "13% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 35, name: "SS SHIVAM DUBE KASHMIR WILLOW CRICKET BAT", img: "/ss shivam dube'.jpg", mrp: "₹2,453", price: 2820, discount: "13% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 36, name: "SS JOSH KASHMIR WILLOW CRICKET BAT", img: "/ss josh.jpg", mrp: "₹2,590", price: 2253, discount: "13% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 37, name: "SS IKON KASHMIR WILLOW CRICKET BAT", img: "/shopping.webp", mrp: "₹2,590", price: 2253, discount: "13% OFF", desc: "Kashmir Willow", category: "Bat", size: "h-40" },
  { id: 38, name: "GRAY NICOLLS GN2 SUPRA ENGLISH WILLOW CRICKET BAT", img: "/Gray-Nicolls_GN2_Supra_English_Willow_Cricket_Bat-01_1500x.webp", mrp: "₹9,349", price: 7479, discount: "20% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 39, name: "MRF GENIUS GRAND ENGLISH WILLOW CRICKET BAT", img: "/MRF_Genius_Grand_Cricket_Bat-01_1500x.webp", mrp: "₹44,249", price: 39824, discount: "10% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 40, name: "KOOKABURRA EMPOWER PRO 3.0 ENGLISH WILLOW CRICKET BAT", img: "/Kookaburra_Empower_Pro_3.0_English_Willow_Cricket_Bat-01_1500x.webp", mrp: "₹24,499", price: 19599, discount: "20% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 41, name: "SS TON GLORY ENGLISH WILLOW CRICKET BAT", img: "/SS_Ton_Glory_English_Willow_Cricket_Bat-01_1500x.webp", mrp: "₹17,900", price: 14320, discount: "20% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 42, name: "GM DIAMOND 505 ENGLISH WILLOW CRICKET BAT", img: "/GM_Diamond_505_English_Willow_Cricket_Bat-01_1500x.webp", mrp: "₹17,749", price: 14199, discount: "20% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 43, name: "SG CENTURY CLASSIC ENGLISH WILLOW CRICKET BAT", img: "/SG_Century_Classic_English_Willow_Cricket_Bat-01_e9399ea7-3701-495e-8e9e-c00a95c988f3_1500x.webp", mrp: "₹13,999", price: 10499, discount: "25% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 44, name: "SF STANLITE ENGLISH WILLOW CRICKET BAT", img: "/SF_Stanlite_English_Willow_Cricket_Bat-01_1500x.webp", mrp: "₹15,600", price: 14040, discount: "10% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 45, name: "CEAT HITMAN JR CRICKET ENGLISH WILLOW BAT", img: "/71Gtb5_F3kL._SY879_375x.webp", mrp: "₹19,679", price: 14759, discount: "25% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 46, name: "SS DEVILS GREEN ENGLISH WILLOW CRICKET BAT", img: "/SS_Devils_Green_English_Willow_Cricket_Bat-01_1500x.webp", mrp: "₹25,400", price: 19050, discount: "25% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 47, name: "DSC KRUNCH 3.0 ENGLISH WILLOW CRICKET BAT", img: "/DSC_Krunch_3.0_English_Willow_Cricket_Bat-01_1500x.webp", mrp: "₹27,199", price: 19124, discount: "30% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 48, name: "SG SAVAGE ENGLISH WILLOW CRICKET BAT", img: "/cricket_bat.webp", mrp: "₹27,999", price: 22399, discount: "29% OFF", desc: "English Willow", category: "Bat", size: "h-40" },
  { id: 49, name: "Cricket Ball", img: "/cricket_ball1.jpg", mrp: "₹699", price: 499, discount: "29% OFF", desc: "Leather Ball", category: "Ball", size: "h-28" },
  { id: 50, name: "Kit Bag", img: "/kitbag_1.webp", mrp: "₹3,999", price: 2999, discount: "25% OFF", desc: "Water Resistant", category: "Kit Bag", size: "h-32" },
  { id: 51, name: "Batting Gloves", img: "/cricket_gloves.jpg", mrp: "₹1,799", price: 1299, discount: "28% OFF", desc: "Premium Grip", category: "Gloves", size: "h-32" },
  { id: 52, name: "Keeping Gloves", img: "/cricket_keeping.jpg", mrp: "₹1,999", price: 1499, discount: "25% OFF", desc: "High Protection", category: "Gloves", size: "h-32" },
  { id: 53, name: "Cricket Dress", img: "/cricket-dress.jpg", mrp: "₹1,299", price: 999, discount: "23% OFF", desc: "Team Kit", category: "Dress", size: "h-32" },
];

const categories = ["All", "Bat", "Ball", "Kit Bag", "Gloves", "Dress"];

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgs {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  position: relative; overflow: hidden; min-height: 100vh;
  background: linear-gradient(180deg, var(--pink) 0%, var(--pink-soft) 280px, var(--cream) 640px);
  padding: 48px 0 90px;
}
.tcgs * { box-sizing: border-box; }
@keyframes tcgs-float { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(28px,-24px) scale(1.12) } }
@keyframes tcgs-bob { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-18px) rotate(8deg) } }
@keyframes tcgs-shimmer { to { background-position: 200% center } }
@keyframes tcgs-rise { from { opacity: 0; transform: translateY(36px) scale(.96) } to { opacity: 1; transform: none } }
@keyframes tcgs-pop { 0% { transform: scale(.3) } 60% { transform: scale(1.4) } 100% { transform: scale(1) } }
@keyframes tcgs-wiggle { 0%,100% { transform: rotate(-5deg) } 50% { transform: rotate(5deg) } }
@keyframes tcgs-grid-in { from { opacity: 0 } to { opacity: 1 } }

.tcgs-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
.tcgs-ball { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%); box-shadow: inset -5px -7px 12px rgba(0,0,0,.25), 0 10px 20px rgba(42,10,63,.25); }
.tcgs-ball::after { content: ''; position: absolute; inset: 8% 45%; border-left: 2px dashed rgba(255,255,255,.7); border-right: 2px dashed rgba(255,255,255,.7); border-radius: 50%; }
.tcgs-wrap { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; padding: 0 16px; }

/* heading */
.tcgs-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 40px; }
.tcgs-cartbtn { position: relative; width: 62px; height: 62px; border-radius: 20px; background: var(--plum); color: var(--lime); border: 3px solid var(--plum); display: grid; place-items: center; cursor: pointer; flex-shrink: 0; box-shadow: 4px 4px 0 var(--lime); transition: transform .3s cubic-bezier(.3,1.6,.5,1), box-shadow .3s; }
.tcgs-cartbtn:hover { transform: translateY(-4px) rotate(-6deg); box-shadow: 7px 7px 0 var(--lime); }
.tcgs-count { position: absolute; top: -12px; right: -12px; min-width: 28px; height: 28px; padding: 0 6px; border-radius: 999px; background: var(--lime); color: var(--plum); border: 3px solid var(--plum); font-weight: 800; font-size: 13px; display: grid; place-items: center; animation: tcgs-pop .5s cubic-bezier(.3,1.6,.5,1); }
.tcgs-title-box { text-align: center; flex: 1; }
.tcgs-chip { display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: 999px; background: var(--plum); color: var(--lime); font-size: 13px; font-weight: 700; }
.tcgs h1 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; letter-spacing: -.03em; line-height: 1.02; font-size: clamp(2.3rem, 7vw, 4.6rem); margin: 14px 0 12px;
  background: linear-gradient(90deg, var(--plum), #b0108a, var(--plum-2), #b0108a, var(--plum)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcgs-shimmer 5s linear infinite; }
.tcgs-sub { margin: 0; font-size: clamp(1rem, 2.2vw, 1.2rem); color: rgba(42,10,63,.78); }
.tcgs-spacer { width: 62px; flex-shrink: 0; }
@media (max-width: 639px) { .tcgs-spacer { display: none; } .tcgs-cartbtn { width: 52px; height: 52px; border-radius: 16px; } }

/* categories */
.tcgs-cats { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 14px; }
.tcgs-cat { padding: 10px 22px; border-radius: 999px; border: 2px solid var(--plum); background: #fff; color: var(--plum); font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; transition: transform .25s cubic-bezier(.3,1.6,.5,1), background .25s, color .25s, box-shadow .25s; }
.tcgs-cat:hover { transform: translateY(-4px) rotate(-2deg); background: var(--lime); box-shadow: 3px 3px 0 var(--plum); }
.tcgs-cat.on { background: var(--plum); color: var(--lime); box-shadow: 4px 4px 0 var(--lime); transform: translateY(-2px); }
.tcgs-found { text-align: center; font-weight: 600; font-size: 14px; color: rgba(42,10,63,.7); margin: 0 0 34px; }
.tcgs-found b { color: var(--plum); font-family: 'Bricolage Grotesque', sans-serif; font-size: 17px; }

/* grid + cards */
.tcgs-grid { display: grid; grid-template-columns: 1fr; gap: 26px; animation: tcgs-grid-in .3s both; }
@media (min-width: 640px) { .tcgs-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px) { .tcgs-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .tcgs-grid { grid-template-columns: repeat(4, 1fr); gap: 28px; } }

.tcgs-card { position: relative; background: #fff; border: 3px solid var(--plum); border-radius: 28px; padding: 16px; display: flex; flex-direction: column; overflow: hidden;
  opacity: 0; animation: tcgs-rise .65s cubic-bezier(.2,.8,.2,1) forwards; animation-delay: calc(var(--i, 0) * 55ms);
  transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; }
.tcgs-card:hover { transform: translateY(-10px) rotate(-1deg); box-shadow: 10px 10px 0 var(--plum); }
.tcgs-card:nth-child(even):hover { transform: translateY(-10px) rotate(1deg); }
.tcgs-off { position: absolute; top: 14px; right: 14px; z-index: 5; padding: 6px 12px; border-radius: 999px; background: var(--lime); color: var(--plum); border: 2px solid var(--plum); font-size: 11px; font-weight: 800; animation: tcgs-wiggle 2.6s ease-in-out infinite; }
.tcgs-imgbox { position: relative; display: flex; align-items: center; justify-content: center; border-radius: 20px; padding: 26px 16px; overflow: hidden; background: radial-gradient(circle at 50% 40%, #fff, var(--pink-soft)); }
.tcgs-imgbox::before { content: ''; position: absolute; width: 150px; height: 150px; border-radius: 50%; background: var(--pink); opacity: .55; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
.tcgs-card:hover .tcgs-imgbox::before { transform: scale(2.3); }
.tcgs-imgbox img { position: relative; z-index: 1; object-fit: contain; transition: transform .5s cubic-bezier(.3,1.4,.5,1); filter: drop-shadow(0 12px 14px rgba(42,10,63,.25)); }
.tcgs-card:hover .tcgs-imgbox img { transform: scale(1.14) rotate(-5deg); }

.tcgs-info { margin-top: 18px; display: flex; flex-direction: column; flex: 1; }
.tcgs-name { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 15px; line-height: 1.3; margin: 0; min-height: 45px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.tcgs-tag { display: inline-block; align-self: flex-start; margin-top: 10px; padding: 4px 12px; border-radius: 999px; background: var(--pink-soft); border: 2px solid var(--plum); font-size: 12px; font-weight: 700; }
.tcgs-mrp { margin: 14px 0 0; font-size: 14px; color: rgba(42,10,63,.5); text-decoration: line-through; }
.tcgs-price { margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; font-weight: 800; color: #c0127f; line-height: 1.1; }
.tcgs-btns { display: flex; gap: 10px; margin-top: auto; padding-top: 18px; }
.tcgs-btn { position: relative; overflow: hidden; flex: 1; padding: 11px 6px; border-radius: 14px; border: 2px solid var(--plum); font-family: inherit; font-size: 13px; font-weight: 800; cursor: pointer; transition: transform .25s, box-shadow .25s, background .25s; }
.tcgs-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.55), transparent); transform: skewX(-20deg); transition: left .6s; }
.tcgs-btn:hover::before { left: 140%; }
.tcgs-btn:hover { transform: translateY(-3px); box-shadow: 3px 3px 0 var(--plum); }
.tcgs-btn:active { transform: translateY(0); box-shadow: none; }
.tcgs-btn.add { background: var(--plum); color: var(--lime); }
.tcgs-btn.add:hover { background: var(--plum-2); }
.tcgs-btn.buy { background: var(--lime); color: var(--plum); }
.tcgs-btn.buy:hover { background: #d8ff75; }

@media (prefers-reduced-motion: reduce) { .tcgs, .tcgs * { animation: none !important; transition: none !important; } .tcgs-card { opacity: 1; } }
`;

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart, cartItems } = useCart();

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <>
      <Header />
      <style>{styles}</style>

      <div className="tcgs">
        <div className="tcgs-blob" style={{ width: 340, height: 340, background: "#fff", opacity: 0.55, top: -80, left: -90, animation: "tcgs-float 13s ease-in-out infinite" }} />
        <div className="tcgs-blob" style={{ width: 280, height: 280, background: "var(--lime)", opacity: 0.25, top: 120, right: -60, animation: "tcgs-float 16s ease-in-out infinite reverse" }} />
        <div className="tcgs-ball" style={{ width: 40, height: 40, top: 70, right: "9%", animation: "tcgs-bob 6s ease-in-out infinite" }} />
        <div className="tcgs-ball" style={{ width: 24, height: 24, top: 220, left: "5%", animation: "tcgs-bob 5s ease-in-out infinite .8s" }} />

        <div className="tcgs-wrap">
          {/* Heading */}
          <div className="tcgs-top">
            {/* Left Side Cart */}
            <div className="tcgs-cartwrap" style={{ position: "relative" }}>
              <button className="tcgs-cartbtn" aria-label="Cart">
                <ShoppingCart size={28} />
              </button>
              {/* Cart Count */}
              <span key={cartItems.length} className="tcgs-count">
                {cartItems.length}
              </span>
            </div>

            {/* Center Heading */}
            <div className="tcgs-title-box">
              <span className="tcgs-chip">
                <ShoppingBag size={15} /> Official TCG Store
              </span>
              <h1>Cricket Shop</h1>
              <p className="tcgs-sub">Find the best cricket gear for every player</p>
            </div>

            {/* Empty Space for Balance */}
            <div className="tcgs-spacer"></div>
          </div>

          {/* Categories */}
          <div className="tcgs-cats">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`tcgs-cat ${selectedCategory === category ? "on" : ""}`}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="tcgs-found">
            Showing <b>{filteredProducts.length}</b> products
          </p>

          {/* Products */}
          <div className="tcgs-grid" key={selectedCategory}>
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="tcgs-card"
                style={{ "--i": Math.min(index, 12) }}
              >
                <span className="tcgs-off">{product.discount}</span>

                {/* Image */}
                <div className="tcgs-imgbox">
                  <img
                    src={product.img}
                    alt={product.name}
                    className={`object-contain ${product.size}`}
                  />
                </div>

                {/* Info */}
                <div className="tcgs-info">
                  <h3 className="tcgs-name">{product.name}</h3>
                  <span className="tcgs-tag">{product.desc}</span>

                  {/* Price */}
                  <p className="tcgs-mrp">{product.mrp}</p>
                  <p className="tcgs-price">₹{Number(product.price).toLocaleString("en-IN")}</p>

                  {/* Buttons */}
                  <div className="tcgs-btns">
                    <button onClick={() => addToCart(product)} className="tcgs-btn add">
                      Add To Cart
                    </button>
                    <button className="tcgs-btn buy">Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ShopPage;
