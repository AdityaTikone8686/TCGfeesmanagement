import { useState } from "react";

const LOGO = "/cropped_circle_image-removebg-preview.png";

const theme = {
  green: "#1a5c2a",
  greenMid: "#2d8a45",
  greenLight: "#e8f5ec",
  greenBorder: "#c3e6cb",
  greenText: "#b8eac2",
  amber: "#f59f00",
  amberBg: "#fff8e1",
  amberBorder: "#ffe082",
  amberText: "#7a5500",
};

const styles = {
  page: {
    background: "#f4faf5",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    background: theme.green,
    padding: "14px 28px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logoImg: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
    border: "2px solid rgba(255,255,255,0.3)",
  },
  headerTitle: { color: "#fff", fontSize: "17px", fontWeight: 600, margin: "0 0 2px" },
  headerSub: { color: theme.greenText, fontSize: "12px", margin: 0 },
  progressBar: {
    background: theme.greenMid,
    padding: "0 28px",
    display: "flex",
    alignItems: "center",
  },
  stepSep: { flex: 1, height: "1px", background: "rgba(255,255,255,0.2)", margin: "0 8px" },
  formArea: { padding: "20px 28px 28px" },
  sectionTitle: { fontSize: "15px", fontWeight: 500, color: "#1a1a1a", margin: "0 0 4px" },
  sectionSub: { fontSize: "12.5px", color: "#666", margin: "0 0 16px" },
  card: {
    background: "#fff",
    border: `0.5px solid ${theme.greenBorder}`,
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "14px",
  },
  offerStrip: {
    background: theme.amberBg,
    border: `0.5px solid ${theme.amberBorder}`,
    borderRadius: "8px",
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },
  offerDot: {
    width: "7px", height: "7px",
    background: theme.amber, borderRadius: "50%", flexShrink: 0,
  },
  offerText: { fontSize: "12.5px", color: theme.amberText, fontWeight: 500, margin: 0 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  fieldWrap: { marginBottom: "14px" },
  label: { display: "block", fontSize: "12px", fontWeight: 500, color: "#666", marginBottom: "5px" },
  input: {
    width: "100%", padding: "9px 12px", fontSize: "14px",
    border: `0.5px solid ${theme.greenBorder}`, borderRadius: "8px",
    background: "#f9fdf9", color: "#1a1a1a", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  },
  radioGroup: { display: "flex", flexWrap: "wrap", gap: "8px" },
  radioOpt: (sel) => ({
    border: `0.5px solid ${sel ? theme.green : theme.greenBorder}`,
    borderRadius: "8px", padding: "8px 14px", fontSize: "13px",
    cursor: "pointer", userSelect: "none", transition: "all 0.12s",
    background: sel ? theme.greenLight : "#f9fdf9",
    color: sel ? theme.green : "#666",
    fontWeight: sel ? 500 : 400,
  }),
  btnRow: { display: "flex", gap: "10px", marginTop: "6px" },
  btnPrimary: {
    flex: 1, background: theme.green, color: "#fff", border: "none",
    borderRadius: "10px", padding: "13px", fontSize: "14px",
    fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  },
  btnSecondary: {
    background: "#fff", color: theme.green,
    border: `0.5px solid ${theme.green}`, borderRadius: "10px",
    padding: "13px 20px", fontSize: "14px", fontWeight: 500,
    cursor: "pointer", fontFamily: "inherit",
  },
  stepBtn: (active, done) => ({
    display: "flex", alignItems: "center", gap: "6px",
    padding: "10px 0", fontSize: "12px", fontWeight: 500,
    color: active ? "#fff" : done ? theme.greenText : "rgba(255,255,255,0.5)",
    cursor: "pointer", background: "none", border: "none", fontFamily: "inherit",
  }),
  stepNum: (active, done) => ({
    width: "22px", height: "22px", borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: "11px", fontWeight: 600, flexShrink: 0,
    background: active ? "#fff" : done ? theme.greenText : "rgba(255,255,255,0.15)",
    color: active ? theme.green : done ? theme.green : "rgba(255,255,255,0.6)",
  }),
  reviewRow: {
    display: "flex", justifyContent: "space-between",
    padding: "5px 0", borderBottom: `0.5px solid ${theme.greenLight}`,
    fontSize: "13.5px",
  },
  checkRow: { display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" },
  checkLabel: { fontSize: "13px", color: "#666", lineHeight: 1.4 },
  successScreen: { textAlign: "center", padding: "36px 28px" },
  refCard: {
    background: "#fff", border: `0.5px solid ${theme.greenBorder}`,
    borderRadius: "10px", padding: "14px 16px", marginBottom: "20px",
  },
};

function Field({ label, children, style }) {
  return (
    <div style={{ ...styles.fieldWrap, ...style }}>
      <label style={styles.label}>{label}</label>
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
      style={styles.input}
      {...props}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.input}
    >
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div style={styles.radioGroup}>
      {options.map((o) => (
        <div
          key={o}
          style={styles.radioOpt(value === o)}
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
    <div style={styles.formArea}>
      <p style={styles.sectionTitle}>Personal details</p>
      <p style={styles.sectionSub}>Tell us about the player joining the academy</p>
      <div style={styles.offerStrip}>
        <div style={styles.offerDot} />
        <p style={styles.offerText}>Early enrollment discount active — limited seats remaining</p>
      </div>
      <div style={styles.card}>
        <div style={styles.row}>
          <Field label="First name">
            <Input value={data.fname} onChange={set("fname")} placeholder="e.g. Rohit" />
          </Field>
          <Field label="Last name">
            <Input value={data.lname} onChange={set("lname")} placeholder="e.g. Sharma" />
          </Field>
        </div>
        <div style={styles.row}>
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
      <div style={styles.card}>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "#1a1a1a", margin: "0 0 12px" }}>
          Parent / guardian details
        </p>
        <Field label="Parent / guardian name">
          <Input value={data.parent} onChange={set("parent")} placeholder="Full name" />
        </Field>
        <div style={styles.row}>
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
            style={{ ...styles.input, resize: "vertical", minHeight: "68px" }}
          />
        </Field>
      </div>
      <div style={styles.btnRow}>
        <button style={styles.btnPrimary} onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}

function Step2({ data, setData, onNext, onBack }) {
  const set = (k) => (v) => setData((d) => ({ ...d, [k]: v }));
  return (
    <div style={styles.formArea}>
      <p style={styles.sectionTitle}>Batch & skill level</p>
      <p style={styles.sectionSub}>Choose the right program for the player</p>
      <div style={styles.card}>
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
      <div style={styles.card}>
        <Field label="Preferred batch timing">
          <div style={styles.radioGroup}>
            <div style={{border:"0.5px solid #f09595",borderRadius:"8px",padding:"8px 14px",background:"#fcebeb",display:"flex",alignItems:"center",gap:"8px",cursor:"not-allowed",userSelect:"none"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a32d2d" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              <span style={{fontSize:"13px",color:"#a32d2d",fontWeight:500}}>Morning (6–8 AM)</span>
              <span style={{fontSize:"11.5px",color:"#e24b4a"}}>— this slot is not available</span>
            </div>
            {["Evening (5–7 PM)", "Weekend only"].map((o) => (
              <div key={o} style={styles.radioOpt(data.batch === o)} onClick={() => set("batch")(o)}>{o}</div>
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
            style={{ ...styles.input, resize: "vertical", minHeight: "68px" }}
          />
        </Field>
      </div>
      <div style={styles.btnRow}>
        <button style={styles.btnSecondary} onClick={onBack}>← Back</button>
        <button style={styles.btnPrimary} onClick={onNext}>Review →</button>
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
    <div style={styles.formArea}>
      <p style={styles.sectionTitle}>Review & confirm</p>
      <p style={styles.sectionSub}>Check your details before submitting</p>
      <div style={styles.card}>
        {rows.map(([label, val]) => (
          <div key={label} style={styles.reviewRow}>
            <span style={{ color: "#666" }}>{label}</span>
            <span style={{ fontWeight: 500, color: "#1a1a1a", textAlign: "right", maxWidth: "60%" }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={styles.card}>
        <div style={styles.checkRow}>
          <input type="checkbox" checked={tos} onChange={(e) => setTos(e.target.checked)} style={{ marginTop: "2px", accentColor: theme.green, width: "15px", height: "15px" }} />
          <label style={styles.checkLabel}>I agree to the academy's terms, training schedule, and fee policy.</label>
        </div>
        <div style={styles.checkRow}>
          <input type="checkbox" checked={medical} onChange={(e) => setMedical(e.target.checked)} style={{ marginTop: "2px", accentColor: theme.green, width: "15px", height: "15px" }} />
          <label style={styles.checkLabel}>I confirm the player is medically fit to participate in physical training.</label>
        </div>
        <div style={styles.checkRow}>
          <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} style={{ marginTop: "2px", accentColor: theme.green, width: "15px", height: "15px" }} />
          <label style={styles.checkLabel}>Send me WhatsApp updates about schedules and events.</label>
        </div>
      </div>
      <div style={styles.btnRow}>
        <button style={styles.btnSecondary} onClick={onBack}>← Back</button>
        <button style={styles.btnPrimary} onClick={handleSubmit}>Submit registration</button>
      </div>
    </div>
  );
}

function Success({ refNum }) {
  return (
    <div style={styles.successScreen}>
      <img
        src={LOGO}
        alt="TCG logo"
        style={{ width: "72px", height: "72px", borderRadius: "50%", margin: "0 auto 16px", display: "block", border: `3px solid ${theme.greenBorder}` }}
      />
      <h2 style={{ fontSize: "19px", fontWeight: 600, color: theme.green, margin: "0 0 8px" }}>
        Registration submitted!
      </h2>
      <p style={{ fontSize: "14px", color: "#666", margin: "0 0 20px", lineHeight: 1.6 }}>
        Welcome to Tikone Cricket Gurukul. Our team will contact you within 24 hours to confirm your batch and share payment details.
      </p>
      <div style={styles.refCard}>
        <p style={{ fontSize: "11px", color: "#666", margin: "0 0 4px" }}>Your reference number</p>
        <p style={{ fontSize: "22px", fontWeight: 600, color: theme.green, margin: 0, letterSpacing: "0.04em" }}>{refNum}</p>
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
      "https://tikonecricketgurukul.in/api/register", // or localhost
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
    <div style={styles.page}>
      <div style={styles.header}>
        <img src={LOGO} alt="Tikone Cricket Gurukul logo" style={styles.logoImg} />
        <div>
          <h1 style={styles.headerTitle}>Tikone Cricket Gurukul</h1>
          <p style={styles.headerSub}>Player Registration</p>
        </div>
      </div>

      {!submitted && (
        <div style={styles.progressBar}>
          {steps.map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
                <button style={styles.stepBtn(active, done)} onClick={() => done && setStep(n)}>
                  <span style={styles.stepNum(active, done)}>{done ? "✓" : n}</span>
                  {label}
                </button>
                {i < steps.length - 1 && <div style={styles.stepSep} />}
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
  );
}
