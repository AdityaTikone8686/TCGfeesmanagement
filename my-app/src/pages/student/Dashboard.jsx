import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { paymentsAPI, paymentRequestAPI, subscriptionsAPI } from '../../services/api'
import { CreditCard, Book, LogOut, DollarSign, Award, Menu, X, Upload, History, Home, Star, Trophy, UserCircle, TrendingUp, CalendarCheck, CheckCircle, Users as UsersIcon, Mail, Phone } from 'lucide-react'

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgd-root {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  min-height: 100vh;
display: flex;
position: relative;
overflow-x: clip;
  background: linear-gradient(135deg, var(--cream) 0%, var(--pink-soft) 55%, var(--pink) 130%);
}
.tcgd-root *, .tcgd-root *::before, .tcgd-root *::after { box-sizing: border-box; }
.tcgd-root h1, .tcgd-root h2, .tcgd-root h3 { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -.02em; margin: 0; }
.tcgd-root p { margin: 0; }

@keyframes tcgd-float { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-22px) rotate(10deg) } }
@keyframes tcgd-blob { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(24px,-30px) scale(1.12) } }
@keyframes tcgd-in { from { opacity: 0; transform: translateY(22px) scale(.97) } to { opacity: 1; transform: none } }
@keyframes tcgd-shimmer { to { background-position: 200% center } }
@keyframes tcgd-spin { to { transform: rotate(360deg) } }
@keyframes tcgd-bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes tcgd-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.12) } }
@keyframes tcgd-ping { 0% { box-shadow: 0 0 0 0 rgba(198,255,61,.9) } 100% { box-shadow: 0 0 0 14px rgba(198,255,61,0) } }
@keyframes tcgd-slide { from { opacity: 0; transform: translateX(-18px) } to { opacity: 1; transform: none } }

.tcgd-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.tcgd-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: .55; animation: tcgd-blob 12s ease-in-out infinite; }
.tcgd-ball { position: absolute; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%); box-shadow: inset -3px -4px 8px rgba(0,0,0,.25), 0 6px 12px rgba(42,10,63,.2); animation: tcgd-float 6s ease-in-out infinite; opacity: .8; }

/* ---------- Sidebar ---------- */
.tcgd-overlay { position: fixed; inset: 0; z-index: 25; background: rgba(42,10,63,.55); backdrop-filter: blur(3px); animation: tcgd-in .25s both; }
.tcgd-side {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}
.tcgd-side.is-open { transform: none; }
@media (min-width: 768px) {
  .tcgd-side { position: sticky; height: 100vh; transform: none; flex-shrink: 0; box-shadow: 4px 0 0 var(--plum); }
  .tcgd-overlay, .tcgd-menu-btn, .tcgd-side-x { display: none !important; }
}
.tcgd-side-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 18px 18px 14px; border-bottom: 3px solid var(--plum); background: linear-gradient(135deg, var(--pink), var(--pink-soft)); }
.tcgd-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
.tcgd-logo { width: 64px; height: 64px; flex-shrink: 0; border-radius: 16px; overflow: hidden; background: #fff; border: 3px solid var(--plum); box-shadow: 3px 3px 0 var(--plum); transition: transform .4s cubic-bezier(.3,1.6,.5,1); }
.tcgd-logo:hover { transform: rotate(-6deg) scale(1.06); }
.tcgd-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
.tcgd-brand-name { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 17px; line-height: 1.1; letter-spacing: -.02em; color: var(--plum); }
.tcgd-side-x { width: 36px; height: 36px; border-radius: 12px; border: 2px solid var(--plum); background: #fff; color: var(--plum); display: grid; place-items: center; cursor: pointer; flex-shrink: 0; transition: transform .25s cubic-bezier(.3,1.6,.5,1), background .2s, color .2s; }
.tcgd-side-x:hover { transform: rotate(90deg); background: var(--plum); color: var(--lime); }

.tcgd-profile { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px 16px 8px; }
.tcgd-avatar { width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; background: var(--pink-soft); color: var(--plum); border: 3px solid var(--plum); box-shadow: 0 0 0 5px var(--lime); animation: tcgd-ping 2.4s infinite; margin-bottom: 12px; }
.tcgd-pname { font-weight: 800; font-size: 16px; color: var(--plum); word-break: break-word; }
.tcgd-pmail { font-size: 12px; color: rgba(42,10,63,.65); word-break: break-all; margin-top: 2px; }
.tcgd-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 13px; border-radius: 999px; font-size: 12px; font-weight: 800; background: var(--plum); color: var(--lime); margin-top: 10px; }

.tcgd-nav { flex: 1; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.tcgd-nav-btn { position: relative; overflow: hidden; width: 100%; display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 14px; border: 2px solid transparent; background: transparent; color: var(--plum); font-family: inherit; font-size: 14.5px; font-weight: 700; cursor: pointer; text-align: left; transition: transform .25s cubic-bezier(.3,1.6,.5,1), background .2s, border-color .2s, box-shadow .2s; animation: tcgd-slide .5s both; animation-delay: calc(var(--i) * 80ms + 150ms); }
.tcgd-nav-btn:hover { background: var(--pink-soft); border-color: var(--plum); transform: translateX(5px); }
.tcgd-nav-btn.is-active { background: var(--plum); color: var(--lime); border-color: var(--plum); box-shadow: 4px 4px 0 var(--pink); }
.tcgd-nav-btn svg { flex-shrink: 0; transition: transform .35s cubic-bezier(.3,1.6,.5,1); }
.tcgd-nav-btn:hover svg { transform: rotate(-10deg) scale(1.15); }

.tcgd-side-foot { padding: 16px 14px 18px; border-top: 3px solid var(--plum); background: var(--cream); }
.tcgd-welcome { text-align: center; padding: 12px; margin-bottom: 12px; border-radius: 14px; background: var(--lime); border: 2px solid var(--plum); box-shadow: 3px 3px 0 var(--plum); }
.tcgd-welcome p:first-child { font-size: 13.5px; font-weight: 800; }
.tcgd-welcome p:last-child { font-size: 11.5px; font-weight: 600; opacity: .75; word-break: break-all; }

/* ---------- Buttons ---------- */
.tcgd-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 18px; border-radius: 14px; border: 2px solid var(--plum); background: var(--plum); color: var(--lime); font-family: inherit; font-size: 14px; font-weight: 800; cursor: pointer; transition: transform .25s, box-shadow .25s, background .25s, color .25s; }
.tcgd-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.35), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcgd-btn:hover:not(:disabled)::before { left: 140%; }
.tcgd-btn:hover:not(:disabled) { transform: translateY(-3px) rotate(-.6deg); box-shadow: 5px 5px 0 var(--pink); background: var(--plum-2); }
.tcgd-btn:active:not(:disabled) { transform: none; box-shadow: none; }
.tcgd-btn:disabled { opacity: .55; cursor: not-allowed; }
.tcgd-btn.is-out { background: #fff; color: var(--plum); }
.tcgd-btn.is-out:hover:not(:disabled) { background: var(--pink-soft); box-shadow: 5px 5px 0 var(--plum); }
.tcgd-btn.is-sm { padding: 8px 14px; font-size: 13px; border-radius: 12px; }
.tcgd-btn.is-block { width: 100%; padding: 14px; font-size: 15px; }
.tcgd-btn.is-lime { background: var(--lime); color: var(--plum); }
.tcgd-btn.is-lime:hover:not(:disabled) { background: #d6ff6b; box-shadow: 5px 5px 0 var(--plum); }
.tcgd-btn:focus-visible, .tcgd-nav-btn:focus-visible, .tcgd-menu-btn:focus-visible, .tcgd-side-x:focus-visible, .tcgd-input:focus-visible { outline: 3px solid var(--plum-2); outline-offset: 3px; }

/* ---------- Main ---------- */
.tcgd-main {
  margin-left: 280px;
  min-width: 0;
  min-height: 100vh;
}
.tcgd-menu-bar { display: flex; align-items: center; padding: 14px 16px 0; }
.tcgd-menu-btn { width: 46px; height: 46px; border-radius: 14px; border: 3px solid var(--plum); background: #fff; color: var(--plum); box-shadow: 3px 3px 0 var(--plum); display: grid; place-items: center; cursor: pointer; transition: transform .2s, background .2s; }
.tcgd-menu-btn:hover { background: var(--lime); transform: translateY(-2px); }
.tcgd-wrap { width: 100%; max-width: 1150px; margin: 0 auto; padding: 22px 16px 48px; display: flex; flex-direction: column; gap: 28px; }

/* Hero */
.tcgd-hero { position: relative; overflow: hidden; display: flex; flex-wrap: wrap; gap: 24px; align-items: center; justify-content: space-between; padding: 28px; background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 100%); border: 3px solid var(--plum); border-radius: 30px; box-shadow: 8px 8px 0 var(--plum); animation: tcgd-in .7s cubic-bezier(.2,.8,.2,1) both; }
.tcgd-hero-ball { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%); box-shadow: inset -3px -4px 8px rgba(0,0,0,.25), 0 6px 12px rgba(42,10,63,.2); animation: tcgd-float 5s ease-in-out infinite; }
.tcgd-hero-left { position: relative; z-index: 2; display: flex; align-items: center; gap: 20px; flex: 1 1 360px; min-width: 0; }
.tcgd-hero-logo { width: 88px; height: 88px; flex-shrink: 0; border-radius: 22px; overflow: hidden; background: #fff; border: 3px solid var(--plum); box-shadow: 4px 4px 0 var(--plum); transform: rotate(-4deg); transition: transform .4s cubic-bezier(.3,1.6,.5,1); }
.tcgd-hero-logo:hover { transform: rotate(4deg) scale(1.06); }
.tcgd-hero-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
.tcgd-hero h1 { font-weight: 800; line-height: 1.05; font-size: clamp(1.6rem, 4.6vw, 2.5rem); background: linear-gradient(90deg, var(--plum), #b0108a, var(--plum-2), #b0108a, var(--plum)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcgd-shimmer 5s linear infinite; word-break: break-word; }
.tcgd-hero-sub { margin-top: 6px; font-size: 16px; font-weight: 600; color: rgba(42,10,63,.8); }
.tcgd-tag { display: inline-flex; align-items: center; gap: 7px; margin-top: 12px; padding: 6px 14px; border-radius: 999px; background: #fff; border: 2px solid var(--plum); font-size: 12.5px; font-weight: 800; color: var(--plum); }
.tcgd-tag svg { color: #b0108a; }
.tcgd-hero-right { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.tcgd-mini-row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.tcgd-mini { min-width: 96px; display: flex; flex-direction: column; align-items: center; padding: 14px 12px; background: #fff; border: 3px solid var(--plum); border-radius: 18px; box-shadow: 4px 4px 0 var(--plum); animation: tcgd-in .6s both; animation-delay: calc(var(--i) * 110ms + 300ms); transition: transform .3s cubic-bezier(.3,1.6,.5,1), background .3s; }
.tcgd-mini:hover { transform: translateY(-5px) rotate(-2deg); background: var(--lime); }
.tcgd-mini svg { color: #b0108a; margin-bottom: 4px; transition: transform .5s cubic-bezier(.3,1.6,.5,1); }
.tcgd-mini:hover svg { transform: rotate(360deg); color: var(--plum); }
.tcgd-mini b { font-family: 'Bricolage Grotesque', sans-serif; font-size: 26px; font-weight: 800; line-height: 1; }
.tcgd-mini span { font-size: 11.5px; font-weight: 700; opacity: .65; margin-top: 3px; }
.tcgd-keep { font-size: 12px; font-weight: 700; color: rgba(42,10,63,.65); text-align: center; }

/* Cards */
.tcgd-sec { display: flex; flex-direction: column; gap: 24px; animation: tcgd-in .55s cubic-bezier(.2,.8,.2,1) both; }
.tcgd-grid4 { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
.tcgd-grid2 { display: grid; gap: 22px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); }
.tcgd-grid3 { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }

.tcgd-card { position: relative; background: #fff; border: 3px solid var(--plum); border-radius: 24px; box-shadow: 6px 6px 0 var(--plum); overflow: hidden; animation: tcgd-in .6s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i, 0) * 90ms); transition: transform .3s cubic-bezier(.3,1.6,.5,1), box-shadow .3s; }
.tcgd-card.is-hover:hover { transform: translate(-3px,-5px) rotate(-.4deg); box-shadow: 9px 11px 0 var(--plum); }
.tcgd-card-head { display: flex; align-items: center; gap: 10px; padding: 16px 20px; border-bottom: 3px solid var(--plum); background: var(--pink-soft); }
.tcgd-card-head h3 { font-size: 17px; font-weight: 800; }
.tcgd-ico { width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center; flex-shrink: 0; background: var(--plum); color: var(--lime); transition: transform .5s cubic-bezier(.3,1.6,.5,1), background .3s, color .3s; }
.tcgd-card:hover .tcgd-ico { transform: rotate(360deg); background: var(--lime); color: var(--plum); }
.tcgd-card-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.tcgd-card.c-lime .tcgd-card-head { background: var(--lime); }
.tcgd-card.c-pink .tcgd-card-head { background: var(--pink); }
.tcgd-card.c-cream .tcgd-card-head { background: var(--cream); }

.tcgd-stat .tcgd-card-head { padding: 12px 16px; }
.tcgd-stat .tcgd-card-head h3 { font-size: 14px; }
.tcgd-stat .tcgd-card-body { padding: 16px; gap: 6px; }
.tcgd-stat-val { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 22px; line-height: 1.15; word-break: break-word; }
.tcgd-stat-val.is-sm { font-size: 16px; font-family: 'DM Sans', sans-serif; font-weight: 700; }
.tcgd-hint { font-size: 12px; font-weight: 500; color: rgba(42,10,63,.6); }

/* Badges */
.tcgd-badge { display: inline-flex; align-items: center; align-self: flex-start; padding: 5px 14px; border-radius: 999px; border: 2px solid var(--plum); font-size: 13px; font-weight: 800; text-transform: capitalize; background: #fff; }
.tcgd-badge.b-active, .tcgd-badge.b-approved { background: var(--lime); color: var(--plum); }
.tcgd-badge.b-expired, .tcgd-badge.b-rejected { background: #ffb3c7; color: #6a0a2a; }
.tcgd-badge.b-cancelled, .tcgd-badge.b-default { background: #ececf1; color: #4a4a5a; }
.tcgd-badge.b-pending, .tcgd-badge.b-none { background: #fff1a8; color: #5a4300; }

/* Items */
.tcgd-list { display: flex; flex-direction: column; gap: 14px; }
.tcgd-item { padding: 16px; border: 2px solid var(--plum); border-radius: 18px; background: var(--cream); animation: tcgd-in .5s both; animation-delay: calc(var(--i, 0) * 70ms); transition: transform .25s cubic-bezier(.3,1.6,.5,1), box-shadow .25s; }
.tcgd-item:hover { transform: translateY(-3px); box-shadow: 4px 4px 0 var(--plum); }
.tcgd-item.i-active { background: #f1ffd0; }
.tcgd-item.i-expired { background: #ffe3ec; }
.tcgd-item-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
.tcgd-item h4 { margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -.02em; }
.tcgd-meta { font-size: 13px; font-weight: 500; color: rgba(42,10,63,.7); margin-top: 3px; }
.tcgd-meta.is-link { color: #b0108a; font-weight: 700; }
.tcgd-meta.is-faint { font-size: 12px; color: rgba(42,10,63,.55); }
.tcgd-note { margin-top: 12px; padding: 10px 14px; border-radius: 12px; background: #fff; border: 2px dashed var(--plum); }
.tcgd-note b { display: block; font-size: 13px; font-weight: 800; }
.tcgd-note span { font-size: 13px; color: rgba(42,10,63,.75); }
.tcgd-shot { max-width: min(100%, 300px); margin-top: 12px; border-radius: 14px; border: 3px solid var(--plum); display: block; }
.tcgd-empty { text-align: center; padding: 18px 8px; font-weight: 600; color: rgba(42,10,63,.65); display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; }

/* Forms */
.tcgd-field { display: flex; flex-direction: column; gap: 7px; }
.tcgd-label { font-size: 13px; font-weight: 800; color: var(--plum); }
.tcgd-input { width: 100%; padding: 12px 14px; border-radius: 14px; border: 2px solid var(--plum); background: #fff; color: var(--plum); font-family: inherit; font-size: 15px; font-weight: 500; transition: box-shadow .25s, transform .25s, background .25s; }
.tcgd-input::placeholder { color: rgba(42,10,63,.45); }
.tcgd-input:focus { outline: none; box-shadow: 4px 4px 0 var(--pink); transform: translateY(-2px); }
.tcgd-input[readonly] { background: var(--pink-soft); cursor: default; }
.tcgd-input[type=file] { padding: 9px; cursor: pointer; background: var(--cream); }
.tcgd-input[type=file]::file-selector-button { margin-right: 12px; padding: 8px 14px; border-radius: 10px; border: 2px solid var(--plum); background: var(--plum); color: var(--lime); font-family: inherit; font-weight: 800; cursor: pointer; }
.tcgd-ok { margin-top: 2px; font-size: 13px; font-weight: 800; color: #1c6b00; }

/* UPI */
.tcgd-qr { width: 190px; height: 190px; margin: 0 auto; border-radius: 20px; background: #fff; border: 3px solid var(--plum); box-shadow: 5px 5px 0 var(--plum); display: flex; align-items: center; justify-content: center; overflow: hidden; transition: transform .4s cubic-bezier(.3,1.6,.5,1); }
.tcgd-qr:hover { transform: rotate(-3deg) scale(1.04); }
.tcgd-qr img { width: 100%; height: 100%; object-fit: contain; }
.tcgd-kv { padding: 11px 14px; border-radius: 14px; border: 2px solid var(--plum); background: var(--cream); text-align: left; transition: transform .25s cubic-bezier(.3,1.6,.5,1), background .25s; }
.tcgd-kv:hover { transform: translateX(5px); background: var(--pink-soft); }
.tcgd-kv small { display: block; font-size: 12px; font-weight: 700; color: rgba(42,10,63,.6); }
.tcgd-kv strong { font-size: 15px; font-weight: 800; word-break: break-word; }
.tcgd-kv strong.mono { font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace; }

/* Steps */
.tcgd-steps { display: flex; flex-direction: column; gap: 12px; }
.tcgd-step { display: flex; align-items: flex-start; gap: 12px; font-size: 14.5px; font-weight: 600; animation: tcgd-slide .5s both; animation-delay: calc(var(--i) * 100ms + 200ms); }
.tcgd-step i { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: grid; place-items: center; font-style: normal; font-size: 13px; font-weight: 800; background: var(--plum); color: var(--lime); border: 2px solid var(--plum); transition: transform .4s cubic-bezier(.3,1.6,.5,1), background .3s, color .3s; }
.tcgd-step:hover i { transform: rotate(360deg) scale(1.15); background: var(--lime); color: var(--plum); }
.tcgd-step div { padding-top: 3px; }

/* Achievements */
.tcgd-ach { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; padding: 24px 18px; border: 3px solid var(--plum); border-radius: 24px; box-shadow: 6px 6px 0 var(--plum); animation: tcgd-in .6s both; animation-delay: calc(var(--i) * 120ms + 200ms); transition: transform .3s cubic-bezier(.3,1.6,.5,1), box-shadow .3s; }
.tcgd-ach:hover { transform: translate(-3px,-6px) rotate(-1deg); box-shadow: 9px 12px 0 var(--plum); }
.tcgd-ach.a1 { background: var(--lime); }
.tcgd-ach.a2 { background: var(--pink); }
.tcgd-ach.a3 { background: var(--pink-soft); }
.tcgd-ach svg { margin-bottom: 6px; color: var(--plum); }
.tcgd-ach .ic-bounce { animation: tcgd-bounce 1.8s ease-in-out infinite; }
.tcgd-ach .ic-pulse { animation: tcgd-pulse 1.8s ease-in-out infinite; }
.tcgd-ach .ic-spin { animation: tcgd-spin 8s linear infinite; }
.tcgd-ach b { font-family: 'Bricolage Grotesque', sans-serif; font-size: 20px; font-weight: 800; }
.tcgd-ach span { font-size: 13px; font-weight: 600; opacity: .75; }

.tcgd-actions { display: flex; flex-wrap: wrap; gap: 12px; }

/* Table */
.tcgd-tablewrap { overflow-x: auto; border: 3px solid var(--plum); border-radius: 18px; background: #fff; }
.tcgd-table { width: 100%; min-width: 620px; border-collapse: collapse; font-size: 14px; }
.tcgd-table th { text-align: left; padding: 12px 14px; background: var(--plum); color: var(--lime); font-weight: 800; font-size: 13px; white-space: nowrap; }
.tcgd-table td { padding: 12px 14px; border-bottom: 2px solid var(--pink-soft); font-weight: 500; }
.tcgd-table tbody tr { transition: background .2s; animation: tcgd-in .45s both; animation-delay: calc(var(--i, 0) * 50ms); }
.tcgd-table tbody tr:hover { background: var(--pink-soft); }
.tcgd-table tbody tr:last-child td { border-bottom: none; }
.tcgd-table .strong { font-weight: 800; }
.tcgd-table .cap { text-transform: capitalize; }

/* Loading / gate screens */
.tcgd-gate { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; text-align: center; font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum); background: linear-gradient(135deg, var(--cream), var(--pink-soft) 55%, var(--pink) 130%); }
.tcgd-gate h2 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(1.4rem, 5vw, 2rem); margin: 0 0 16px; }
.tcgd-gate-card { padding: 34px 30px; background: #fff; border: 3px solid var(--plum); border-radius: 28px; box-shadow: 8px 8px 0 var(--plum); animation: tcgd-in .6s both; }
.tcgd-spinner { width: 54px; height: 54px; margin: 0 auto 16px; border-radius: 50%; border: 5px solid var(--pink-soft); border-top-color: var(--plum); border-right-color: #b0108a; animation: tcgd-spin .9s linear infinite; }
.tcgd-inline-spin { text-align: center; padding: 18px; font-weight: 700; }

@media (max-width: 520px) {
  .tcgd-hero { padding: 20px; border-radius: 24px; box-shadow: 5px 5px 0 var(--plum); }
  .tcgd-hero-left { gap: 14px; }
  .tcgd-hero-logo { width: 70px; height: 70px; }
  .tcgd-card { box-shadow: 4px 4px 0 var(--plum); border-radius: 20px; }
  .tcgd-card-body { padding: 16px; }
  .tcgd-mini { min-width: 86px; }
}
@media (prefers-reduced-motion: reduce) { .tcgd-root *, .tcgd-gate * { animation: none !important; transition: none !important; } }
@media (min-width: 769px) {
  .tcgd-side {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    height: 100dvh;
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 0;
    transform: none;
    box-shadow: 4px 0 0 var(--plum);
  }

  .tcgd-main {
    margin-left: 280px;
    width: calc(100% - 280px);
  }

  .tcgd-overlay,
  .tcgd-menu-btn,
  .tcgd-side-x {
    display: none !important;
  }
}
@media (max-width: 768px) {
  .tcgd-side {
    position: fixed;
    top: 0;
    bottom: 0;
    left: -280px;
    width: 280px;
    height: 100vh;
    height: 100dvh;
    overflow-y: auto;
    z-index: 1000;
    transition: left 0.3s ease;
  }

  .tcgd-side.is-open {
    left: 0;
  }

  .tcgd-main {
    width: 100%;
    margin-left: 0;
  }
}
`


const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <Home size={19} /> },
  { id: 'payment', label: 'Pay Fees', icon: <DollarSign size={19} /> },
  { id: 'requests', label: 'Payment Requests', icon: <Upload size={19} /> },
  { id: 'history', label: 'Payment History', icon: <History size={19} /> },
]

const StudentDashboard = () => {
  const { user, userStatus, paymentStatus, refreshUserStatus, logout, loading } = useAuth()
  const [payments, setPayments] = useState([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDescription, setPaymentDescription] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [selectedFeePlan, setSelectedFeePlan] = useState('')
  const [feePlans, setFeePlans] = useState([])
  const [paymentRequests, setPaymentRequests] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [uploading, setUploading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)

  useEffect(() => {
    if (user?.email) {
      fetchPayments()
      fetchPaymentRequests()
      fetchSubscriptions()
      fetchFeePlans()
      // Refresh user status to get latest subscription info
      refreshUserStatus()
    }
  }, [user?.email])

  // Periodic refresh of user status to keep subscription info up-to-date
  useEffect(() => {
    if (user?.email) {
      const interval = setInterval(() => {
        refreshUserStatus()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [user?.email])

  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true)
      const paymentsData = await paymentsAPI.getPaymentsByEmail(localStorage.getItem('token'), user.email)
      setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData.payments || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setPaymentsLoading(false)
    }
  }

  const fetchPaymentRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      const requests = await paymentRequestAPI.getUserPaymentRequests(token)
      setPaymentRequests(requests)
    } catch (error) {
      console.error('Error fetching payment requests:', error)
    }
  }

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token')
      const subs = await subscriptionsAPI.getUserSubscriptions(token)
      console.log('Fetched subscriptions:', subs)
      setSubscriptions(subs)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    }
  }

  const fetchFeePlans = async () => {
    try {
      const plans = await subscriptionsAPI.getAllFeePlansPublic()
      setFeePlans(plans)
    } catch (error) {
      console.error('Error fetching fee plans:', error)
    }
  }

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      setScreenshot(file)
    }
  }

  const handleFeePlanChange = (e) => {
    const planId = e.target.value
    setSelectedFeePlan(planId)

    if (planId) {
      const selectedPlan = feePlans.find(plan => plan._id === planId)
      if (selectedPlan) {
        setPaymentAmount(selectedPlan.amount.toString())
        setPaymentDescription(`${selectedPlan.planName} - ${selectedPlan.durationInDays} days`)
      }
    } else {
      setPaymentAmount('')
      setPaymentDescription('')
    }
  }

  const handlePaymentSubmit = async () => {
    if (!paymentAmount || !paymentDescription || !screenshot) {
      alert('Please fill all fields and upload a screenshot')
      return
    }

    if (!selectedFeePlan) {
      alert('Please select a fee plan')
      return
    }

    try {
      setUploading(true)
      const token = localStorage.getItem('token')

      const formData = new FormData()
      formData.append('amount', paymentAmount)
      formData.append('description', paymentDescription)
      formData.append('screenshot', screenshot)
      formData.append('paymentMethod', 'UPI')
      formData.append('feePlanId', selectedFeePlan)

      await paymentRequestAPI.createPaymentRequest(token, formData)

      alert('Payment request submitted successfully! Admin will review and update your status.')
      setPaymentAmount('')
      setPaymentDescription('')
      setScreenshot(null)
      setSelectedFeePlan('')
      fetchPaymentRequests()
    } catch (error) {
      alert('Error submitting payment request: ' + error.message)
    } finally {
      setUploading(false)
    }
  }



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'b-active'
      case 'expired':
        return 'b-expired'
      case 'cancelled':
        return 'b-cancelled'
      default:
        return 'b-pending'
    }
  }

  const getPaymentRequestStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'b-approved'
      case 'rejected':
        return 'b-rejected'
      case 'pending':
        return 'b-pending'
      default:
        return 'b-default'
    }
  }

  const refreshStatusClick = async () => {
    setStatusLoading(true)
    await refreshUserStatus()
    setStatusLoading(false)
  }

  if (loading) {
    return (
      <div className="tcgd-gate">
        <style>{styles}</style>
        <div className="tcgd-gate-card">
          <div className="tcgd-spinner"></div>
          <h2 style={{ marginBottom: 0 }}>Loading...</h2>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="tcgd-gate">
        <style>{styles}</style>
        <div className="tcgd-gate-card">
          <h2>Please log in to view your dashboard</h2>
          <button type="button" className="tcgd-btn is-block" onClick={() => window.location.href = '/student/login'}>
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (user.isAdmin || user.role === 'admin') {
    window.location.href = '/admin/dashboard';
    return null;
  }

  const activeCount = subscriptions.filter(sub => sub.status === 'active').length
  const currentStatus = userStatus?.subscription?.status || paymentStatus?.subscription?.status

  return (
    <div className="tcgd-root">
      <style>{styles}</style>

      {/* Animated background */}
      <div className="tcgd-bg" aria-hidden="true">
        <span className="tcgd-blob" style={{ width: 320, height: 320, top: -80, left: '30%', background: '#FFA8E0' }} />
        <span className="tcgd-blob" style={{ width: 280, height: 280, bottom: -60, right: -40, background: '#C6FF3D', animationDelay: '3s', opacity: .35 }} />
        <span className="tcgd-ball" style={{ width: 26, height: 26, top: '18%', right: '8%' }} />
        <span className="tcgd-ball" style={{ width: 16, height: 16, bottom: '22%', left: '34%', animationDelay: '1.2s' }} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="tcgd-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`tcgd-side ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="tcgd-side-head">
          <div className="tcgd-brand">
            <div className="tcgd-logo">
              <img
                src="/TikoneCricketGurukul1.png"
                alt="Logo"
              />
            </div>
            <span className="tcgd-brand-name">Tikone Cricket Gurukul</span>
          </div>
          <button type="button" className="tcgd-side-x" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>

        <div className="tcgd-profile">
          <div className="tcgd-avatar"><UserCircle size={44} /></div>
          <span className="tcgd-pname">{user.name}</span>
          <span className="tcgd-pmail">{user.email}</span>
          <span className="tcgd-pill">Student</span>
        </div>

        <nav className="tcgd-nav">
          {SIDEBAR_ITEMS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              style={{ '--i': i }}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
              className={`tcgd-nav-btn ${activeSection === item.id ? 'is-active' : ''}`}
            >
              {item.icon}{item.label}
            </button>
          ))}
        </nav>

        <div className="tcgd-side-foot">
          <div className="tcgd-welcome">
            <p>Welcome, {user.name}</p>
            <p>{user.email}</p>
          </div>
          <button type="button" className="tcgd-btn is-out is-block" onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="tcgd-main">
        {/* Mobile sidebar toggle */}
        <div className="tcgd-menu-bar">
          <button type="button" className="tcgd-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={24} /></button>
        </div>

        <div className="tcgd-wrap">
          {/* Hero Section */}
          <div className="tcgd-hero">
            <span className="tcgd-hero-ball" style={{ width: 26, height: 26, top: 18, right: 24 }} />
            <span className="tcgd-hero-ball" style={{ width: 14, height: 14, bottom: 16, left: '46%', animationDelay: '.8s' }} />
            <div className="tcgd-hero-left">
              <div className="tcgd-hero-logo">
                <img
                  src="/TikoneCricketGurukul1.png"
                  alt="Logo"
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1>Welcome, {user.name}!</h1>
                <p className="tcgd-hero-sub">Ready to level up your cricket journey? 🏏</p>
                <span className="tcgd-tag"><Star size={15} /> Pimpri's Premier Cricket Academy</span>
              </div>
            </div>
            <div className="tcgd-hero-right">
              <div className="tcgd-mini-row">
                <div className="tcgd-mini" style={{ '--i': 0 }}>
                  <TrendingUp size={24} />
                  <b>{activeCount}</b>
                  <span>Active Subs</span>
                </div>
                <div className="tcgd-mini" style={{ '--i': 1 }}>
                  <CalendarCheck size={24} />
                  <b>{payments.length}</b>
                  <span>Payments</span>
                </div>
                <div className="tcgd-mini" style={{ '--i': 2 }}>
                  <CheckCircle size={24} />
                  <b>{paymentRequests.length}</b>
                  <span>Requests</span>
                </div>
              </div>
              <div className="tcgd-keep">Keep up the great work!</div>
            </div>
          </div>

          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="tcgd-sec">
              <div className="tcgd-grid4">
                <div className="tcgd-card tcgd-stat is-hover" style={{ '--i': 0 }}>
                  <div className="tcgd-card-head">
                    <span className="tcgd-ico"><UsersIcon size={17} /></span>
                    <h3>Name</h3>
                  </div>
                  <div className="tcgd-card-body">
                    <p className="tcgd-stat-val">{user.name}</p>
                  </div>
                </div>
                <div className="tcgd-card tcgd-stat c-pink is-hover" style={{ '--i': 1 }}>
                  <div className="tcgd-card-head">
                    <span className="tcgd-ico"><Mail size={17} /></span>
                    <h3>Email</h3>
                  </div>
                  <div className="tcgd-card-body">
                    <p className="tcgd-stat-val is-sm">{user.email}</p>
                  </div>
                </div>
                <div className="tcgd-card tcgd-stat c-lime is-hover" style={{ '--i': 2 }}>
                  <div className="tcgd-card-head">
                    <span className="tcgd-ico"><Phone size={17} /></span>
                    <h3>Phone</h3>
                  </div>
                  <div className="tcgd-card-body">
                    <p className="tcgd-stat-val is-sm">{user.phone}</p>
                  </div>
                </div>
                <div className="tcgd-card tcgd-stat c-cream is-hover" style={{ '--i': 3 }}>
                  <div className="tcgd-card-head">
                    <span className="tcgd-ico"><Award size={17} /></span>
                    <h3>Status</h3>
                  </div>
                  <div className="tcgd-card-body">
                    <span className={`tcgd-badge ${currentStatus ? getStatusColor(currentStatus) : 'b-none'}`}>
                      {userStatus?.subscription?.status || paymentStatus?.subscription?.status || 'No Subscription'}
                    </span>
                    {!userStatus?.subscription?.status && !paymentStatus?.subscription?.status && (
                      <p className="tcgd-hint">
                        Click "Refresh Status" to update
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Subscription Status */}
              <div className="tcgd-card c-lime">
                <div className="tcgd-card-head">
                  <span className="tcgd-ico"><CalendarCheck size={17} /></span>
                  <h3>Current Subscription Status</h3>
                </div>
                <div className="tcgd-card-body">
                  {subscriptions.length > 0 ? (
                    <div className="tcgd-list">
                      {subscriptions.filter(sub => sub.status === 'active').map((subscription, i) => (
                        <div key={subscription._id} className="tcgd-item i-active" style={{ '--i': i }}>
                          <div className="tcgd-item-top">
                            <div>
                              <h4>{subscription.plan?.planName || 'Active Plan'}</h4>
                              <p className="tcgd-meta">{formatCurrency(subscription.plan?.amount || 0)}</p>
                              <p className="tcgd-meta is-faint">
                                Valid until: {formatDate(subscription.endDate)}
                              </p>
                            </div>
                            <span className="tcgd-badge b-active">Active</span>
                          </div>
                          <p className="tcgd-meta is-faint" style={{ marginTop: 10 }}>
                            Started: {formatDate(subscription.startDate)}
                          </p>
                        </div>
                      ))}
                      {subscriptions.filter(sub => sub.status === 'expired').map((subscription, i) => (
                        <div key={subscription._id} className="tcgd-item i-expired" style={{ '--i': i }}>
                          <div className="tcgd-item-top">
                            <div>
                              <h4>{subscription.plan?.planName || 'Expired Plan'}</h4>
                              <p className="tcgd-meta">{formatCurrency(subscription.plan?.amount || 0)}</p>
                              <p className="tcgd-meta is-faint">
                                Expired on: {formatDate(subscription.endDate)}
                              </p>
                            </div>
                            <span className="tcgd-badge b-expired">Expired</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="tcgd-empty">
                      {subscriptions.length === 0 ? (
                        <>
                          No subscriptions found.
                          <button
                            type="button"
                            onClick={() => setActiveSection('payment')}
                            className="tcgd-btn is-sm"
                          >
                            Pay Fees
                          </button>
                        </>
                      ) : (
                        <>
                          No active subscriptions found.
                          <button
                            type="button"
                            onClick={() => setActiveSection('payment')}
                            className="tcgd-btn is-sm"
                          >
                            Pay Fees
                          </button>
                          <button
                            type="button"
                            onClick={refreshStatusClick}
                            className="tcgd-btn is-sm is-lime"
                            disabled={statusLoading}
                          >
                            {statusLoading ? 'Refreshing...' : 'Refresh Status'}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="tcgd-card c-pink">
                <div className="tcgd-card-head">
                  <span className="tcgd-ico"><Star size={17} /></span>
                  <h3>Quick Actions</h3>
                </div>
                <div className="tcgd-card-body">
                  <div className="tcgd-actions">
                    <button
                      type="button"
                      onClick={() => setActiveSection('payment')}
                      className="tcgd-btn"
                    >
                      Pay Fees
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('history')}
                      className="tcgd-btn is-out"
                    >
                      View Payment History
                    </button>
                    <button
                      type="button"
                      onClick={refreshStatusClick}
                      className="tcgd-btn is-out"
                      disabled={statusLoading}
                    >
                      {statusLoading ? 'Refreshing...' : 'Refresh Status'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="tcgd-grid3">
                <div className="tcgd-ach a1" style={{ '--i': 0 }}>
                  <Trophy size={42} className="ic-bounce" />
                  <b>35+ Champions</b>
                  <span>Produced by the Academy</span>
                </div>
                <div className="tcgd-ach a2" style={{ '--i': 1 }}>
                  <UsersIcon size={42} className="ic-pulse" />
                  <b>500+ Students</b>
                  <span>Enrolled so far</span>
                </div>
                <div className="tcgd-ach a3" style={{ '--i': 2 }}>
                  <Star size={42} className="ic-spin" />
                  <b>Expert Coaching</b>
                  <span>By National-level Coaches</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Section */}
          {activeSection === 'payment' && (
            <div className="tcgd-sec">
              <div className="tcgd-grid2">
                {/* Payment Form */}
                <div className="tcgd-card c-lime">
                  <div className="tcgd-card-head">
                    <span className="tcgd-ico"><DollarSign size={17} /></span>
                    <h3>Payment Details</h3>
                  </div>
                  <div className="tcgd-card-body">
                    <div className="tcgd-field">
                      <label className="tcgd-label" htmlFor="feePlan">Select Fee Plan</label>
                      <select
                        id="feePlan"
                        value={selectedFeePlan}
                        onChange={handleFeePlanChange}
                        className="tcgd-input"
                        required
                      >
                        <option value="">-- Select a Fee Plan --</option>
                        {feePlans.map(plan => (
                          <option key={plan._id} value={plan._id}>
                            {plan.planName} - ₹{plan.amount} ({plan.durationInDays} days)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="tcgd-field">
                      <label className="tcgd-label" htmlFor="paymentAmount">Amount (₹)</label>
                      <input
                        id="paymentAmount"
                        type="number"
                        placeholder="Amount will be auto-filled when you select a plan"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="tcgd-input"
                        readOnly
                      />
                    </div>
                    <div className="tcgd-field">
                      <label className="tcgd-label" htmlFor="paymentDescription">Description</label>
                      <input
                        id="paymentDescription"
                        placeholder="Description will be auto-filled when you select a plan"
                        value={paymentDescription}
                        onChange={(e) => setPaymentDescription(e.target.value)}
                        className="tcgd-input"
                        readOnly
                      />
                    </div>
                    <div className="tcgd-field">
                      <label className="tcgd-label" htmlFor="screenshot">Payment Screenshot</label>
                      <input
                        id="screenshot"
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="tcgd-input"
                      />
                      {screenshot && (
                        <div className="tcgd-ok">
                          ✓ {screenshot.name} selected
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handlePaymentSubmit}
                      disabled={!selectedFeePlan || !paymentAmount || !paymentDescription || !screenshot || uploading}
                      className="tcgd-btn is-block"
                    >
                      {uploading ? 'Submitting...' : 'Submit Payment Request'}
                    </button>
                  </div>
                </div>

                {/* UPI Payment Details */}
                <div className="tcgd-card c-pink" style={{ '--i': 1 }}>
                  <div className="tcgd-card-head">
                    <span className="tcgd-ico"><CreditCard size={17} /></span>
                    <h3>UPI Payment Details</h3>
                  </div>
                  <div className="tcgd-card-body">
                    {/* Placeholder for QR Code */}
                    <div className="tcgd-qr">
                      <img
                        src="/qr-code.jpg"
                        alt="QR Code"
                      />
                    </div>

                    <div className="tcgd-list" style={{ gap: 10 }}>
                      <div className="tcgd-kv">
                        <small>UPI ID</small>
                        <strong className="mono">-NOT YET STARTED-</strong>
                      </div>

                      <div className="tcgd-kv">
                        <small>Account Number</small>
                        <strong className="mono">-NOT YET STARTED-</strong>
                      </div>

                      <div className="tcgd-kv">
                        <small>IFSC Code</small>
                        <strong className="mono">-NOT YET STARTED-</strong>
                      </div>

                      <div className="tcgd-kv">
                        <small>Account Holder</small>
                        <strong>Deepmala Avinash Tikone</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="tcgd-card" style={{ '--i': 2 }}>
                <div className="tcgd-card-head">
                  <span className="tcgd-ico"><Book size={17} /></span>
                  <h3>Payment Instructions</h3>
                </div>
                <div className="tcgd-card-body">
                  <div className="tcgd-steps">
                    <div className="tcgd-step" style={{ '--i': 0 }}>
                      <i>1</i>
                      <div>Scan the QR code or use the UPI ID to make payment</div>
                    </div>
                    <div className="tcgd-step" style={{ '--i': 1 }}>
                      <i>2</i>
                      <div>Add your name and student ID in the payment note</div>
                    </div>
                    <div className="tcgd-step" style={{ '--i': 2 }}>
                      <i>3</i>
                      <div>Take a screenshot of the payment confirmation</div>
                    </div>
                    <div className="tcgd-step" style={{ '--i': 3 }}>
                      <i>4</i>
                      <div>Submit the payment request above with payment details</div>
                    </div>
                    <div className="tcgd-step" style={{ '--i': 4 }}>
                      <i>5</i>
                      <div>Contact admin with payment proof for status update</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Requests Section */}
          {activeSection === 'requests' && (
            <div className="tcgd-sec">
              <div className="tcgd-card c-pink">
                <div className="tcgd-card-head">
                  <span className="tcgd-ico"><Upload size={17} /></span>
                  <h3>My Payment Requests</h3>
                </div>
                <div className="tcgd-card-body">
                  {paymentRequests.length > 0 ? (
                    <div className="tcgd-list">
                      {paymentRequests.map((request, i) => (
                        <div key={request._id} className="tcgd-item" style={{ '--i': i }}>
                          <div className="tcgd-item-top">
                            <div>
                              <h4>{formatCurrency(request.amount)}</h4>
                              <p className="tcgd-meta">{request.description}</p>
                              {request.feePlan && (
                                <p className="tcgd-meta is-link">
                                  Plan: {request.feePlan.planName} ({request.feePlan.durationInDays} days)
                                </p>
                              )}
                              <p className="tcgd-meta is-faint">{formatDate(request.createdAt)}</p>
                            </div>
                            <span className={`tcgd-badge ${getPaymentRequestStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>

                          {request.screenshot && (
                            <img
                              src={request.screenshot}
                              alt="Payment Screenshot"
                              className="tcgd-shot"
                            />
                          )}

                          {request.adminNotes && (
                            <div className="tcgd-note">
                              <b>Admin Notes:</b>
                              <span>{request.adminNotes}</span>
                            </div>
                          )}

                          {request.approvedBy && (
                            <p className="tcgd-meta is-faint" style={{ marginTop: 10 }}>
                              {request.status === 'approved' ? 'Approved' : 'Rejected'} by {request.approvedBy.name} on {formatDate(request.approvedAt)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="tcgd-empty">No payment requests found</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payment History Section */}
          {activeSection === 'history' && (
            <div className="tcgd-sec">
              {/* Subscriptions */}
              <div className="tcgd-card c-lime">
                <div className="tcgd-card-head">
                  <span className="tcgd-ico"><CalendarCheck size={17} /></span>
                  <h3>Active Subscriptions</h3>
                </div>
                <div className="tcgd-card-body">
                  {subscriptions.length > 0 ? (
                    <div className="tcgd-list">
                      {subscriptions.map((subscription, i) => (
                        <div key={subscription._id} className="tcgd-item" style={{ '--i': i }}>
                          <div className="tcgd-item-top">
                            <div>
                              <h4>{subscription.plan?.planName || 'Subscription Plan'}</h4>
                              <p className="tcgd-meta">{formatCurrency(subscription.plan?.amount || 0)}</p>
                              <p className="tcgd-meta is-faint">
                                {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                              </p>
                            </div>
                            <span className={`tcgd-badge ${getStatusColor(subscription.status)}`}>
                              {subscription.status}
                            </span>
                          </div>

                          {subscription.payment && (
                            <div className="tcgd-note">
                              <b>Payment Details:</b>
                              <span>
                                {formatCurrency(subscription.payment.amount)} via {subscription.payment.method}
                              </span>
                              <p className="tcgd-meta is-faint">{formatDate(subscription.payment.createdAt)}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="tcgd-empty">No active subscriptions found</div>
                  )}
                </div>
              </div>

              {/* Payments */}
              <div className="tcgd-card c-pink" style={{ '--i': 1 }}>
                <div className="tcgd-card-head">
                  <span className="tcgd-ico"><History size={17} /></span>
                  <h3>All Payments</h3>
                </div>
                <div className="tcgd-card-body">
                  {paymentsLoading ? (
                    <div className="tcgd-inline-spin">Loading payments...</div>
                  ) : payments.length > 0 ? (
                    <div className="tcgd-tablewrap">
                      <table className="tcgd-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Description</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment, i) => (
                            <tr key={payment.id} style={{ '--i': i }}>
                              <td>{formatDate(payment.createdAt)}</td>
                              <td className="strong">{formatCurrency(payment.amount)}</td>
                              <td className="cap">{payment.method || 'UPI'}</td>
                              <td>{payment.description || 'Payment'}</td>
                              <td>
                                <span className="tcgd-badge b-active">
                                  Completed
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="tcgd-empty">No payment history found</div>
                  )}
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
