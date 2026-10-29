import { useState } from "react";

const LOGO = "/cropped_circle_image-removebg-preview.png";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgr {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  position: relative; overflow: hidden; min-height: 100vh; padding-bottom: 60px;
  background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 55%, #fff0fa 100%); background-size: 200% 200%;
  animation: tcgr-bg 14s ease infinite;
}
.tcgr * { box-sizing: border-box; }
@keyframes tcgr-bg { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
@keyframes tcgr-float { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(30px,-26px) scale(1.12) } }
@keyframes tcgr-bob { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-20px) rotate(8deg) } }
@keyframes tcgr-rise { from { opacity: 0; transform: translateY(30px) scale(.97) } to { opacity: 1; transform: none } }
@keyframes tcgr-slide { from { opacity: 0; transform: translateX(40px) } to { opacity: 1; transform: none } }
@keyframes tcgr-shimmer { to { background-position: 200% center } }
@keyframes tcgr-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.4) } }
@keyframes tcgr-ping { 0% { box-shadow: 0 0 0 0 rgba(198,255,61,.9) } 100% { box-shadow: 0 0 0 12px rgba(198,255,61,0) } }
@keyframes tcgr-pop { 0% { transform: scale(0) rotate(-30deg) } 60% { transform: scale(1.2) rotate(8deg) } 100% { transform: scale(1) rotate(0) } }
@keyframes tcgr-confetti { 0% { transform: translateY(-20px) rotate(0); opacity: 0 } 15% { opacity: 1 } 100% { transform: translateY(380px) rotate(540deg); opacity: 0 } }
@keyframes tcgr-draw { to { stroke-dashoffset: 0 } }

.tcgr-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
.tcgr-ball { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%); box-shadow: inset -5px -7px 12px rgba(0,0,0,.25), 0 10px 20px rgba(42,10,63,.25); }
.tcgr-ball::after { content: ''; position: absolute; inset: 8% 45%; border-left: 2px dashed rgba(255,255,255,.7); border-right: 2px dashed rgba(255,255,255,.7); border-radius: 50%; }

/* header */
.tcgr-header { position: relative; z-index: 2; background: var(--plum); border-bottom: 3px solid var(--plum); padding: 16px 28px; display: flex; align-items: center; gap: 16px; }
.tcgr-logo { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: #fff; border: 3px solid var(--pink); box-shadow: 0 0 0 4px rgba(255,168,224,.3); animation: tcgr-ping 2.4s infinite; transition: transform .4s cubic-bezier(.3,1.6,.5,1); }
.tcgr-logo:hover { transform: rotate(360deg) scale(1.08); }
.tcgr-htitle { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -.02em; margin: 0 0 2px; color: #fff;
  background: linear-gradient(90deg, #fff, var(--pink), #fff, var(--pink)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcgr-shimmer 6s linear infinite; }
.tcgr-hsub { margin: 0; color: var(--lime); font-size: 13px; font-weight: 600; }

/* stepper */
.tcgr-wrap { position: relative; z-index: 2; max-width: 760px; margin: 0 auto; padding: 0 16px; }
.tcgr-progress { display: flex; align-items: center; margin: 34px 0 22px; background: #fff; border: 3px solid var(--plum); border-radius: 22px; box-shadow: 6px 6px 0 var(--plum); padding: 10px 18px; animation: tcgr-rise .6s both; }
.tcgr-stepitem { display: flex; align-items: center; }
.tcgr-stepbtn { display: flex; align-items: center; gap: 8px; padding: 6px 0; border: none; background: none; font-family: inherit; font-size: 13px; font-weight: 700; cursor: default; color: rgba(42,10,63,.45); transition: color .3s; }
.tcgr-stepbtn.active { color: var(--plum); }
.tcgr-stepbtn.done { color: var(--plum-2); cursor: pointer; }
.tcgr-stepbtn.done:hover .tcgr-num { transform: rotate(-12deg) scale(1.12); }
.tcgr-num { width: 30px; height: 30px; border-radius: 10px; display: grid; place-items: center; font-size: 13px; font-weight: 800; flex-shrink: 0; border: 2px solid var(--plum); background: #fff; color: var(--plum); transition: transform .3s cubic-bezier(.3,1.6,.5,1), background .3s; }
.tcgr-stepbtn.active .tcgr-num { background: var(--plum); color: var(--lime); animation: tcgr-pop .5s both; }
.tcgr-stepbtn.done .tcgr-num { background: var(--lime); }
.tcgr-sep { flex: 1; height: 4px; border-radius: 4px; background: rgba(42,10,63,.15); margin: 0 12px; position: relative; overflow: hidden; }
.tcgr-sep::after { content: ''; position: absolute; inset: 0; background: var(--plum); transform: scaleX(0); transform-origin: left; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
.tcgr-sep.fill::after { transform: scaleX(1); }
@media (max-width: 560px) { .tcgr-stepbtn .lbl { display: none; } .tcgr-stepbtn.active .lbl { display: inline; } .tcgr-progress { padding: 10px 12px; } }

/* form */
.tcgr-form { animation: tcgr-slide .5s cubic-bezier(.2,.8,.2,1) both; }
.tcgr-st { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(1.6rem, 4vw, 2.1rem); letter-spacing: -.02em; margin: 0 0 4px; }
.tcgr-ss { margin: 0 0 18px; font-size: 14px; color: rgba(42,10,63,.72); }
.tcgr-card { background: #fff; border: 3px solid var(--plum); border-radius: 26px; padding: 22px; margin-bottom: 18px; transition: transform .3s, box-shadow .3s; animation: tcgr-rise .6s both; animation-delay: var(--d, 0ms); }
.tcgr-card:hover { transform: translateY(-4px); box-shadow: 8px 8px 0 var(--plum); }
.tcgr-cardt { font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 800; margin: 0 0 14px; }

.tcgr-offer { display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin-bottom: 18px; border-radius: 16px; background: var(--lime); border: 3px solid var(--plum); box-shadow: 4px 4px 0 var(--plum); animation: tcgr-rise .6s both; }
.tcgr-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--plum); flex-shrink: 0; animation: tcgr-pulse 1.4s ease-in-out infinite; }
.tcgr-offer p { margin: 0; font-size: 14px; font-weight: 700; }

.tcgr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 560px) { .tcgr-row { grid-template-columns: 1fr; gap: 0; } }
.tcgr-field { margin-bottom: 16px; }
.tcgr-label { display: block; font-size: 12px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: var(--plum-2); margin-bottom: 6px; }
.tcgr-input { width: 100%; padding: 13px 14px; font-size: 15px; font-family: inherit; font-weight: 500; color: var(--plum); background: var(--cream); border: 2px solid var(--plum); border-radius: 14px; outline: none; transition: transform .25s, box-shadow .25s, background .25s; }
.tcgr-input::placeholder { color: rgba(42,10,63,.4); }
.tcgr-input:focus { background: #fff; transform: translateY(-2px); box-shadow: 5px 5px 0 var(--pink); }
textarea.tcgr-input { resize: vertical; min-height: 78px; }

.tcgr-radios { display: flex; flex-wrap: wrap; gap: 10px; }
.tcgr-opt { padding: 10px 18px; border-radius: 999px; border: 2px solid var(--plum); background: #fff; color: var(--plum); font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; user-select: none; transition: transform .25s cubic-bezier(.3,1.6,.5,1), background .25s, color .25s, box-shadow .25s; }
.tcgr-opt:hover { transform: translateY(-3px) rotate(-1.5deg); background: var(--pink-soft); box-shadow: 3px 3px 0 var(--plum); }
.tcgr-opt.on { background: var(--plum); color: var(--lime); box-shadow: 3px 3px 0 var(--lime); }
.tcgr-opt.off { display: inline-flex; align-items: center; gap: 8px; background: #ffe1e6; border-color: #c0123b; color: #9c0f30; cursor: not-allowed; background-image: repeating-linear-gradient(45deg, transparent 0 8px, rgba(192,18,59,.08) 8px 16px); }
.tcgr-opt.off:hover { transform: none; box-shadow: none; background-color: #ffe1e6; }
.tcgr-opt.off small { font-size: 12px; font-weight: 600; color: #c0123b; }

.tcgr-btns { display: flex; gap: 12px; margin-top: 6px; }
.tcgr-btn { position: relative; overflow: hidden; padding: 15px 22px; border-radius: 16px; border: 2px solid var(--plum); font-family: inherit; font-size: 15px; font-weight: 800; cursor: pointer; transition: transform .25s, box-shadow .25s, background .25s; }
.tcgr-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcgr-btn:hover::before { left: 140%; }
.tcgr-btn:hover { transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0 var(--plum); }
.tcgr-btn:active { transform: translateY(0); box-shadow: none; }
.tcgr-btn.primary { flex: 1; background: var(--plum); color: var(--lime); }
.tcgr-btn.primary:hover { background: var(--plum-2); box-shadow: 6px 6px 0 var(--lime); }
.tcgr-btn.secondary { background: #fff; color: var(--plum); }
.tcgr-btn.secondary:hover { background: var(--pink-soft); }

/* review */
.tcgr-rrow { display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 2px dashed rgba(42,10,63,.18); font-size: 14px; transition: padding .25s, background .25s; }
.tcgr-rrow:last-child { border-bottom: none; }
.tcgr-rrow:hover { background: var(--pink-soft); padding-inline: 10px; border-radius: 10px; }
.tcgr-rrow span:first-child { color: rgba(42,10,63,.65); font-weight: 600; }
.tcgr-rrow span:last-child { font-weight: 800; text-align: right; max-width: 60%; word-break: break-word; }
.tcgr-check { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; cursor: pointer; }
.tcgr-check:last-child { margin-bottom: 0; }
.tcgr-check input { appearance: none; -webkit-appearance: none; width: 24px; height: 24px; flex-shrink: 0; margin-top: 1px; border-radius: 8px; border: 2px solid var(--plum); background: #fff; cursor: pointer; display: grid; place-items: center; transition: background .2s, transform .25s cubic-bezier(.3,1.6,.5,1); }
.tcgr-check input::after { content: '✓'; font-weight: 800; font-size: 14px; color: var(--plum); transform: scale(0); transition: transform .25s cubic-bezier(.3,1.6,.5,1); }
.tcgr-check input:checked { background: var(--lime); transform: rotate(-6deg) scale(1.08); }
.tcgr-check input:checked::after { transform: scale(1); }
.tcgr-check label { font-size: 14px; line-height: 1.5; color: rgba(42,10,63,.85); cursor: pointer; font-weight: 500; }

/* success */
.tcgr-success { position: relative; text-align: center; background: #fff; border: 3px solid var(--plum); border-radius: 32px; box-shadow: 14px 14px 0 var(--plum); padding: 48px 28px 40px; margin-top: 40px; overflow: hidden; animation: tcgr-rise .7s both; }
.tcgr-slogo { width: 92px; height: 92px; border-radius: 50%; object-fit: cover; background: #fff; border: 4px solid var(--plum); box-shadow: 0 0 0 6px var(--lime); margin: 0 auto 22px; display: block; animation: tcgr-pop .7s .15s both; }
.tcgr-success h2 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; letter-spacing: -.02em; font-size: clamp(1.7rem, 5vw, 2.4rem); margin: 0 0 10px; }
.tcgr-success > p { font-size: 15px; line-height: 1.7; color: rgba(42,10,63,.75); margin: 0 auto 26px; max-width: 480px; }
.tcgr-ref { display: inline-block; padding: 16px 30px; border-radius: 20px; background: var(--plum); color: var(--lime); border: 3px solid var(--plum); box-shadow: 6px 6px 0 var(--pink); animation: tcgr-pop .6s .4s both; }
.tcgr-ref small { display: block; font-size: 12px; font-weight: 700; color: var(--pink); margin-bottom: 4px; }
.tcgr-ref b { font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; letter-spacing: .05em; }
.tcgr-conf { position: absolute; top: 0; width: 10px; height: 16px; border-radius: 3px; opacity: 0; animation: tcgr-confetti 2.8s ease-in infinite; animation-delay: var(--cd); left: var(--cl); background: var(--cc); }

@media (prefers-reduced-motion: reduce) { .tcgr, .tcgr * { animation: none !important; transition: none !important; } }
`;

function Field({ label, children, style }) {
  return (
    <div className="tcgr-field" style={style}>
      <label className="tcgr-label">{label}</label>
      {children}
    </div>
  );
}

function Input({ id, value, onChange, ...props }) {
  return (
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="tcgr-input"
      {...props}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="tcgr-input"
    >
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="tcgr-radios">
      {options.map((o) => (
        <div
          key={o}
          className={`tcgr-opt ${value === o ? "on" : ""}`}
          onClick={() => onChange(o)}
        >
          {o}
        </div>
      ))}
    </div>
  );
}

function Step1({ data, setData, onNext }) {
  const set = (k) => (v) => setData((d) => ({ ...d, [k]: v }));
  return (
    <div className="tcgr-form">
      <p className="tcgr-st">Personal details</p>
      <p className="tcgr-ss">Tell us about the player joining the academy</p>
      <div className="tcgr-offer">
        <div className="tcgr-dot" />
        <p>Early enrollment discount active — limited seats remaining</p>
      </div>
      <div className="tcgr-card" style={{ "--d": "80ms" }}>
        <div className="tcgr-row">
          <Field label="First name">
            <Input value={data.fname} onChange={set("fname")} placeholder="e.g. Rohit" />
          </Field>
          <Field label="Last name">
            <Input value={data.lname} onChange={set("lname")} placeholder="e.g. Sharma" />
          </Field>
        </div>
        <div className="tcgr-row">
          <Field label="Date of birth">
            <Input type="date" value={data.dob} onChange={set("dob")} />
          </Field>
          <Field label="Gender">
            <Select
              value={data.gender}
              onChange={set("gender")}
              options={[{ value: "", label: "Select" }, "Male", "Female", "Other"]}
            />
          </Field>
        </div>
      </div>
      <div className="tcgr-card" style={{ "--d": "160ms" }}>
        <p className="tcgr-cardt">Parent / guardian details</p>
        <Field label="Parent / guardian name">
          <Input value={data.parent} onChange={set("parent")} placeholder="Full name" />
        </Field>
        <div className="tcgr-row">
          <Field label="Mobile number">
            <Input type="tel" value={data.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Email address">
            <Input type="email" value={data.email} onChange={set("email")} placeholder="name@email.com" />
          </Field>
        </div>
        <Field label="Address">
          <textarea
            value={data.address}
            onChange={(e) => set("address")(e.target.value)}
            placeholder="House no., area, city..."
            className="tcgr-input"
          />
        </Field>
      </div>
      <div className="tcgr-btns">
        <button className="tcgr-btn primary" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}

function Step2({ data, setData, onNext, onBack }) {
  const set = (k) => (v) => setData((d) => ({ ...d, [k]: v }));
  return (
    <div className="tcgr-form">
      <p className="tcgr-st">Batch & skill level</p>
      <p className="tcgr-ss">Choose the right program for the player</p>
      <div className="tcgr-card" style={{ "--d": "80ms" }}>
        <Field label="Skill level">
          <RadioGroup
            options={["Beginner", "Intermediate", "Advanced", "Elite / competitive"]}
            value={data.level}
            onChange={set("level")}
          />
        </Field>
        <Field label="Preferred role">
          <RadioGroup
            options={["Batting", "Bowling", "All-rounder", "Wicket-keeper"]}
            value={data.role}
            onChange={set("role")}
          />
        </Field>
      </div>
      <div className="tcgr-card" style={{ "--d": "160ms" }}>
        <Field label="Preferred batch timing">
          <div className="tcgr-radios">
            <div className="tcgr-opt off">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9c0f30" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              <span>Morning (6–8 AM)</span>
              <small>— this slot is not available</small>
            </div>
            {["Evening (5–7 PM)", "Weekend only"].map((o) => (
              <div key={o} className={`tcgr-opt ${data.batch === o ? "on" : ""}`} onClick={() => set("batch")(o)}>{o}</div>
            ))}
          </div>
        </Field>
        <Field label="Program duration">
          <Select
            value={data.duration}
            onChange={set("duration")}
            options={["1 month (trial)", "3 months", "6 months", "Annual membership"]}
          />
        </Field>
        <Field label="Any prior experience or notes">
          <textarea
            value={data.notes}
            onChange={(e) => set("notes")(e.target.value)}
            placeholder="e.g. played school cricket for 2 years..."
            className="tcgr-input"
          />
        </Field>
      </div>
      <div className="tcgr-btns">
        <button className="tcgr-btn secondary" onClick={onBack}>← Back</button>
        <button className="tcgr-btn primary" onClick={onNext}>Review →</button>
      </div>
    </div>
  );
}

function Step3({ data, onBack, onSubmit }) {
  const [tos, setTos] = useState(false);
  const [medical, setMedical] = useState(false);
  const [updates, setUpdates] = useState(true);

  const rows = [
    ["Player name", `${data.fname} ${data.lname}`],
    ["Date of birth", data.dob || "—"],
    ["Gender", data.gender || "—"],
    ["Parent / guardian", data.parent || "—"],
    ["Mobile", data.phone],
    ["Email", data.email || "—"],
    ["Skill level", data.level],
    ["Role", data.role],
    ["Batch timing", data.batch],
    ["Program", data.duration],
  ];

  const handleSubmit = () => {
    if (!tos || !medical) {
      alert("Please agree to both mandatory checkboxes to proceed.");
      return;
    }
    onSubmit();
  };

  return (
    <div className="tcgr-form">
      <p className="tcgr-st">Review & confirm</p>
      <p className="tcgr-ss">Check your details before submitting</p>
      <div className="tcgr-card" style={{ "--d": "80ms" }}>
        {rows.map(([label, val]) => (
          <div key={label} className="tcgr-rrow">
            <span>{label}</span>
            <span>{val}</span>
          </div>
        ))}
      </div>
      <div className="tcgr-card" style={{ "--d": "160ms" }}>
        <div className="tcgr-check">
          <input id="tcgr-tos" type="checkbox" checked={tos} onChange={(e) => setTos(e.target.checked)} />
          <label htmlFor="tcgr-tos">I agree to the academy's terms, training schedule, and fee policy.</label>
        </div>
        <div className="tcgr-check">
          <input id="tcgr-med" type="checkbox" checked={medical} onChange={(e) => setMedical(e.target.checked)} />
          <label htmlFor="tcgr-med">I confirm the player is medically fit to participate in physical training.</label>
        </div>
        <div className="tcgr-check">
          <input id="tcgr-upd" type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} />
          <label htmlFor="tcgr-upd">Send me WhatsApp updates about schedules and events.</label>
        </div>
      </div>
      <div className="tcgr-btns">
        <button className="tcgr-btn secondary" onClick={onBack}>← Back</button>
        <button className="tcgr-btn primary" onClick={handleSubmit}>Submit registration</button>
      </div>
    </div>
  );
}

const CONFETTI = Array.from({ length: 22 }, (_, i) => ({
  l: `${(i * 4.7 + 3) % 100}%`,
  d: `${(i % 7) * 0.35}s`,
  c: ["#FFA8E0", "#C6FF3D", "#2A0A3F", "#FF7FD0"][i % 4],
}));

function Success({ refNum }) {
  return (
    <div className="tcgr-success">
      {CONFETTI.map((p, i) => (
        <span key={i} className="tcgr-conf" style={{ "--cl": p.l, "--cd": p.d, "--cc": p.c }} />
      ))}
      <img src={LOGO} alt="TCG logo" className="tcgr-slogo" />
      <h2>Registration submitted!</h2>
      <p>
        Welcome to Tikone Cricket Gurukul. Our team will contact you within 24 hours to confirm your batch and share payment details.
      </p>
      <div className="tcgr-ref">
        <small>Your reference number</small>
        <b>{refNum}</b>
      </div>
    </div>
  );
}

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [refNum] = useState("TCG-2025-" + Math.floor(1000 + Math.random() * 9000));

  const [personalData, setPersonalData] = useState({
    fname: "", lname: "", dob: "", gender: "",
    parent: "", phone: "", email: "", address: "",
  });
  const [batchData, setBatchData] = useState({
    level: "Beginner", role: "Batting",
    batch: "Morning (6–8 AM)", duration: "3 months", notes: "",
  });

  const handleFinalSubmit = async () => {
    const allData = {
      refNum,
      ...personalData,
      ...batchData,
    };

    try {
      const res = await fetch(
        "https://tikonecricketgurukulbackend.onrender.com/api/register", // or localhost
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(allData),
        }
      );

      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const goNext1 = () => {
    if (!personalData.fname || !personalData.lname || !personalData.phone) {
      alert("Please fill in first name, last name, and mobile number.");
      return;
    }
    setStep(2);
  };

  const steps = ["Personal info", "Batch & level", "Confirm"];

  return (
    <div className="tcgr">
      <style>{css}</style>
      <div className="tcgr-blob" style={{ width: 360, height: 360, background: "#fff", opacity: 0.55, top: 80, left: -100, animation: "tcgr-float 12s ease-in-out infinite" }} />
      <div className="tcgr-blob" style={{ width: 300, height: 300, background: "var(--lime)", opacity: 0.28, bottom: -80, right: -60, animation: "tcgr-float 15s ease-in-out infinite reverse" }} />
      <div className="tcgr-ball" style={{ width: 40, height: 40, top: 130, right: "7%", animation: "tcgr-bob 6s ease-in-out infinite" }} />
      <div className="tcgr-ball" style={{ width: 24, height: 24, bottom: 120, left: "5%", animation: "tcgr-bob 5s ease-in-out infinite .8s" }} />

      <div className="tcgr-header">
        <img src={LOGO} alt="Tikone Cricket Gurukul logo" className="tcgr-logo" />
        <div>
          <h1 className="tcgr-htitle">Tikone Cricket Gurukul</h1>
          <p className="tcgr-hsub">Player Registration</p>
        </div>
      </div>

      <div className="tcgr-wrap">
        {!submitted && (
          <div className="tcgr-progress">
            {steps.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <div key={n} className="tcgr-stepitem" style={{ flex: i < steps.length - 1 ? 1 : "none" }}>
                  <button
                    className={`tcgr-stepbtn ${active ? "active" : ""} ${done ? "done" : ""}`}
                    onClick={() => done && setStep(n)}
                  >
                    <span className="tcgr-num">{done ? "✓" : n}</span>
                    <span className="lbl">{label}</span>
                  </button>
                  {i < steps.length - 1 && <div className={`tcgr-sep ${done ? "fill" : ""}`} />}
                </div>
              );
            })}
          </div>
        )}

        {!submitted ? (
          <>
            {step === 1 && <Step1 data={personalData} setData={setPersonalData} onNext={goNext1} />}
            {step === 2 && <Step2 data={batchData} setData={setBatchData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <Step3 data={{ ...personalData, ...batchData }} onBack={() => setStep(2)} onSubmit={handleFinalSubmit} />}
          </>
        ) : (
          <Success refNum={refNum} />
        )}
      </div>
    </div>
  );
}
