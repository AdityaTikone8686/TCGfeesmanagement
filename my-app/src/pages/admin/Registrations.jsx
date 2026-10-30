import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
  Search,
  RefreshCw,
  AlertCircle,
  Users,
  Sun,
  CalendarDays,
  ClipboardList,
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  History,
  Trash2,
  UserPlus,
  Mail,
  X,
  Save,
  Layers,
} from "lucide-react";

const LOGO = "/cropped_circle_image-removebg-preview.png";
const API = "https://tikonecricketgurukulbackend.onrender.com/api/admin/registrations";

/* ------------------------------------------------------------------
   THEME (same as LandingPage / AdminLogin / AdminDashboard)
   Pink #FFA8E0 · Plum #2A0A3F · Lime #C6FF3D · Cream #FFF6FC
------------------------------------------------------------------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tr {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  min-height: 100vh; position: relative; overflow-x: hidden;
  background: linear-gradient(135deg, #fff0fa 0%, var(--cream) 50%, var(--pink-soft) 100%);
}
.tr * { box-sizing: border-box; }
.tr h1, .tr h2, .tr b.tr-display { font-family: 'Bricolage Grotesque', 'DM Sans', sans-serif; letter-spacing: -0.02em; }

@keyframes tr-spin { to { transform: rotate(360deg) } }
@keyframes tr-pop-in { 0% { opacity: 0; transform: scale(.94) translateY(16px) } 100% { opacity: 1; transform: none } }
@keyframes tr-float { 0%,100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-18px) rotate(6deg) } }

.tr-grid { position: absolute; inset: 0; pointer-events: none; opacity: .45;
  background-image: linear-gradient(rgba(42,10,63,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(42,10,63,.06) 1px, transparent 1px);
  background-size: 44px 44px; -webkit-mask-image: radial-gradient(circle at 60% 20%, #000 10%, transparent 70%); mask-image: radial-gradient(circle at 60% 20%, #000 10%, transparent 70%); }
.tr-ball { position: absolute; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%);
  box-shadow: inset -5px -7px 12px rgba(0,0,0,.25), 0 10px 20px rgba(42,10,63,.2); }
.tr-ball::after { content: ''; position: absolute; inset: 8% 45% 8% 45%; border-left: 2px dashed rgba(255,255,255,.7); border-right: 2px dashed rgba(255,255,255,.7); border-radius: 50%; }

/* header */
.tr-header { position: relative; z-index: 2; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding: 16px 28px; background: var(--plum); border-bottom: 3px solid var(--plum); }
.tr-brand { display: flex; align-items: center; gap: 14px; }
.tr-logo { width: 56px; height: 56px; border-radius: 16px; background: #fff; border: 3px solid var(--lime); overflow: hidden; transform: rotate(-3deg); flex-shrink: 0; }
.tr-logo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tr-brand h1 { margin: 0; color: #fff; font-size: 20px; font-weight: 800; line-height: 1.1; }
.tr-brand p { margin: 3px 0 0; color: var(--pink); font-size: 13px; font-weight: 600; }

/* buttons */
.tr-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; font: inherit; font-weight: 700; font-size: 14px; color: var(--plum); background: var(--lime); border: 2px solid var(--plum); border-radius: 14px; cursor: pointer; transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s; }
.tr-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.55), transparent); transform: skewX(-20deg); transition: left .7s; }
.tr-btn:hover:not(:disabled)::before { left: 140%; }
.tr-btn:hover:not(:disabled) { transform: translateY(-3px) rotate(-1deg); box-shadow: 5px 5px 0 var(--pink); }
.tr-btn:active:not(:disabled) { transform: none; box-shadow: none; }
.tr-btn:disabled { opacity: .65; cursor: not-allowed; }
.tr-btn:focus-visible, .tr-input:focus-visible, .tr-chip:focus-visible { outline: 3px solid var(--plum-2); outline-offset: 3px; }
.tr-btn.spinning svg { animation: tr-spin 1s linear infinite; }

.tr-body { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; padding: 28px 20px 48px; }

/* stats */
.tr-stats { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); margin-bottom: 26px; }
.tr-stat { position: relative; overflow: hidden; padding: 20px; background: #fff; border: 3px solid var(--plum); border-radius: 24px; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; animation: tr-pop-in .6s both; }
.tr-stat::before { content: ''; position: absolute; width: 110px; height: 110px; border-radius: 50%; background: var(--pink); top: -55px; right: -55px; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
.tr-stat:hover { transform: translateY(-6px) rotate(-1deg); box-shadow: 8px 8px 0 var(--plum); }
.tr-stat:hover::before { transform: scale(2.6); }
.tr-stat-ic { position: relative; width: 40px; height: 40px; margin-bottom: 12px; border-radius: 13px; background: var(--plum); color: var(--lime); display: grid; place-items: center; }
.tr-stat small { position: relative; display: block; font-size: 13px; font-weight: 700; color: rgba(42,10,63,.7); }
.tr-stat strong { position: relative; display: block; margin-top: 4px; font-family: 'Bricolage Grotesque', sans-serif; font-size: 34px; font-weight: 800; line-height: 1; }

/* filters */
.tr-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 20px; }
.tr-search { position: relative; flex: 1; min-width: 220px; }
.tr-search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); }
.tr-input { width: 100%; height: 48px; padding: 0 14px 0 40px; font: inherit; font-weight: 500; color: var(--plum); background: #fff; border: 2px solid var(--plum); border-radius: 14px; outline: none; transition: box-shadow .2s, transform .2s; }
.tr-input:focus { transform: translateY(-2px); box-shadow: 4px 4px 0 var(--lime), 4px 4px 0 2px var(--plum); }
.tr-input::placeholder { color: rgba(42,10,63,.45); }
.tr-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.tr-chip { padding: 9px 16px; font: inherit; font-size: 13px; font-weight: 700; color: var(--plum); background: #fff; border: 2px solid var(--plum); border-radius: 999px; cursor: pointer; transition: transform .2s, background .2s, box-shadow .2s; }
.tr-chip:hover { transform: translateY(-2px) rotate(-1deg); background: var(--pink-soft); }
.tr-chip.on { background: var(--plum); color: var(--lime); box-shadow: 3px 3px 0 var(--lime); }

/* table card */
.tr-card { background: #fff; border: 3px solid var(--plum); border-radius: 28px; box-shadow: 10px 10px 0 var(--plum); overflow: hidden; animation: tr-pop-in .7s .1s both; }
.tr-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.tr-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px; }
.tr-table th { padding: 13px 16px; text-align: left; font-size: 13px; font-weight: 700; white-space: nowrap; background: var(--plum); color: var(--pink); }
.tr-table td { padding: 13px 16px; border-bottom: 2px dashed rgba(42,10,63,.15); white-space: nowrap; background: #fff; transition: background .2s; }
.tr-table tbody tr:hover td { background: var(--cream); }
.tr-table .ref { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; font-weight: 700; }
.tr-table .name { font-weight: 700; }
.tr-table .muted { color: rgba(42,10,63,.6); font-size: 13px; }
.tr-table .clip { max-width: 210px; overflow: hidden; text-overflow: ellipsis; }

/* ACTION column: pinned to the right edge so Manage is always visible while scrolling */
.tr-table th.tr-act, .tr-table td.tr-act { position: sticky; right: 0; z-index: 2; text-align: center; box-shadow: -10px 0 14px -10px rgba(42,10,63,.45); }
.tr-table th.tr-act { z-index: 3; background: var(--plum); }
.tr-manage { padding: 8px 14px; }

.tr-pill { display: inline-flex; padding: 3px 11px; border-radius: 999px; font-size: 12px; font-weight: 800; background: var(--lime); border: 2px solid var(--plum); }

.tr-state { padding: 56px 16px; text-align: center; font-weight: 600; color: rgba(42,10,63,.7); }
.tr-state.err { color: #8a0b5c; }
.tr-state svg { margin-bottom: 10px; }
.tr-spinner { width: 38px; height: 38px; margin: 0 auto 14px; border-radius: 50%; border: 4px solid var(--pink-soft); border-top-color: var(--plum); animation: tr-spin .8s linear infinite; }

.tr-foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; padding: 14px 20px; border-top: 3px solid var(--plum); background: var(--pink-soft); font-size: 13px; font-weight: 600; }

@media (prefers-reduced-motion: reduce) {
  .tr, .tr *, .tr *::before, .tr *::after { animation: none !important; transition: none !important; }
}
`;

export default function Registrations() {
  const { token, isAdmin } = useAuth();

  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const [data, setData] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [availableBatches, setAvailableBatches] = useState([]);
  const [batchesList, setBatchesList] = useState([]);
  const [feePlans, setFeePlans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const [editFields, setEditFields] = useState([]);
  const [editValues, setEditValues] = useState({});

  const [actionForm, setActionForm] = useState({
    reason: "",
    remarks: "",
    batchId: "",
    feePlanId: "",
    paymentRequestId: "",
    transactionId: "",
    notes: "",
    skipPayment: false,
    screenshot: "",
  });

  const resetActionForm = () => {
    setActionForm({
      reason: "",
      remarks: "",
      batchId: "",
      feePlanId: "",
      paymentRequestId: "",
      transactionId: "",
      notes: "",
      skipPayment: false,
      screenshot: "",
    });
  };

  const apiRequest = async (path, method = "GET", body = null) => {
    const response = await fetch(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(body !== null ? { body: JSON.stringify(body) } : {}),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Request failed");
    }

    return result;
  };

  const load = useCallback(async (requestedPage = 1) => {
    setLoading(true);
    setError(null);

    try {
      if (!token || !isAdmin) {
        throw new Error("Please log in using your admin account.");
      }

      const params = new URLSearchParams({
        page: String(requestedPage),
        limit: "10",
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (batchFilter !== "All") {
        params.append("batch", batchFilter);
      }

      const result = await apiRequest(`?${params.toString()}`);

      setData(Array.isArray(result.data) ? result.data : []);
      setStatsData(result.stats || {});

      setAvailableBatches(
        Array.isArray(result.filters?.batches)
          ? result.filters.batches
          : []
      );

      setPagination(
        result.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1,
        }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAdmin, search, batchFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      load(page);
    }, 300);

    return () => clearTimeout(timer);
  }, [load, page]);

  const loadBatchesAndPlans = async () => {
    try {
      const [batchResult, feeResult] = await Promise.all([
        apiRequest("/meta/batches"),
        apiRequest("/meta/fee-plans"),
      ]);

      setBatchesList(batchResult.data || []);
      setFeePlans(feeResult.data || []);
    } catch (err) {
      setNotice(err.message);
    }
  };

  // Opens the registration details modal (used by the Manage button)
  const openRegistration = async (id) => {
    try {
      setActionLoading(true);

      const result = await apiRequest(`/${id}`);

      setSelected(result.data);
      setModal("view");
    } catch (err) {
      setNotice(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const refreshSelected = async () => {
    if (selected?.registration?._id) {
      const result = await apiRequest(
        `/${selected.registration._id}`
      );

      setSelected(result.data);
    }
  };

  const openAction = async (type) => {
    resetActionForm();

    if (type === "batch" || type === "paymentRequest") {
      await loadBatchesAndPlans();
    }

    if (type === "edit") {
      try {
        const fields = selected?.editableFields || [];

        setEditFields(fields);

        const values = {};

        fields.forEach((field) => {
          values[field.key] =
            selected.registration?.[field.key] ?? "";
        });

        setEditValues(values);
      } catch (err) {
        setNotice(err.message);
        return;
      }
    }

    setModal(type);
  };

  const performAction = async (request, successMessage) => {
    try {
      setActionLoading(true);

      await request();

      setModal("");
      setNotice(successMessage);

      await load(page);

      if (selected?.registration?._id) {
        await openRegistration(selected.registration._id);
      }
    } catch (err) {
      setNotice(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // EDIT REGISTRATION
  const saveEdit = async () => {
    await performAction(
      () =>
        apiRequest(
          `/${selected.registration._id}`,
          "PATCH",
          editValues
        ),
      "Registration updated successfully."
    );
  };

  // STATUS MANAGEMENT
  const updateStatus = async (action) => {
    if (
      ["reject", "waitlist"].includes(action) &&
      actionForm.reason.trim().length < 3
    ) {
      setNotice("Please enter a reason.");
      return;
    }

    await performAction(
      () =>
        apiRequest(
          `/${selected.registration._id}/status`,
          "POST",
          {
            action,
            reason: actionForm.reason,
            remarks: actionForm.remarks,
          }
        ),
      `Registration ${action} action completed successfully.`
    );
  };

  // ASSIGN BATCH
  const assignBatch = async () => {
    if (!actionForm.batchId) {
      setNotice("Please select a batch.");
      return;
    }

    await performAction(
      () =>
        apiRequest(
          `/${selected.registration._id}/batch`,
          "PUT",
          { batchId: actionForm.batchId }
        ),
      "Batch assigned successfully."
    );
  };

  // CREATE PAYMENT REQUEST
  const createPaymentRequest = async () => {
    if (!actionForm.feePlanId) {
      setNotice("Please select a fee plan.");
      return;
    }

    await performAction(
      () =>
        apiRequest(
          `/${selected.registration._id}/payment-request`,
          "POST",
          {
            feePlanId: actionForm.feePlanId,
            notes: actionForm.notes,
          }
        ),
      "Payment request created successfully."
    );
  };

  // RECORD PAYMENT PROOF
  const recordPaymentProof = async () => {
    if (
      !actionForm.paymentRequestId ||
      (!actionForm.screenshot && !actionForm.transactionId.trim())
    ) {
      setNotice("Select a payment request and provide payment proof.");
      return;
    }

    await performAction(
      () =>
        apiRequest(
          `/${selected.registration._id}/payment/proof`,
          "POST",
          {
            paymentRequestId: actionForm.paymentRequestId,
            screenshot: actionForm.screenshot,
            transactionId: actionForm.transactionId,
          }
        ),
      "Payment proof recorded. Verification is still required."
    );
  };

  // VERIFY PAYMENT
  const verifyPayment = async () => {
    if (!actionForm.paymentRequestId) {
      setNotice("Select a payment request.");
      return;
    }

    await performAction(
      () =>
        apiRequest(
          `/${selected.registration._id}/payment/verify`,
          "POST",
          {
            paymentRequestId: actionForm.paymentRequestId,
            transactionId: actionForm.transactionId,
            remarks: actionForm.remarks,
          }
        ),
      "Payment verified successfully."
    );
  };

  // REJECT PAYMENT
  const rejectPayment = async () => {
    if (
      !actionForm.paymentRequestId ||
      actionForm.reason.trim().length < 3
    ) {
      setNotice("Select a payment request and enter a rejection reason.");
      return;
    }

    await performAction(
      () =>
        apiRequest(
          `/${selected.registration._id}/payment/reject`,
          "POST",
          {
            paymentRequestId: actionForm.paymentRequestId,
            reason: actionForm.reason,
          }
        ),
      "Payment rejected."
    );
  };

  // CONVERT TO STUDENT
  const convertToStudent = async () => {
    const confirmed = window.confirm(
      "Convert this registration into a student account?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const result = await apiRequest(
        `/${selected.registration._id}/convert`,
        "POST",
        {
          skipPayment: actionForm.skipPayment,
          remarks: actionForm.remarks,
        }
      );

      const student = result.data?.student;
      const password = result.data?.temporaryPassword;

      setModal("");

      setNotice(
        `Student created successfully. Student ID: ${
          student?.studentId || "Created"
        }` +
          (password ? ` | Temporary password: ${password}` : "")
      );

      await load(page);
      await openRegistration(selected.registration._id);
    } catch (err) {
      setNotice(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // SEND NOTIFICATION
  const sendNotification = async () => {
    const type = window.prompt(
      "Enter notification type:\napproved\nrejected\nwaitlisted\nbatch_assigned\npayment_instructions\npayment_confirmed\nadmission_confirmed"
    );

    if (!type) return;

    const allowedTypes = [
      "approved",
      "rejected",
      "waitlisted",
      "batch_assigned",
      "payment_instructions",
      "payment_confirmed",
      "admission_confirmed",
    ];

    if (!allowedTypes.includes(type.trim())) {
      setNotice("Invalid notification type.");
      return;
    }

    await performAction(
      () =>
        apiRequest(
          `/${selected.registration._id}/notify`,
          "POST",
          { type: type.trim() }
        ),
      "Notification sent successfully."
    );
  };

  // DELETE REGISTRATION
  const deleteRegistration = async () => {
    if (actionForm.reason.trim().length < 3) {
      setNotice("Please provide a deletion reason.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this registration?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await apiRequest(
        `/${selected.registration._id}`,
        "DELETE",
        { reason: actionForm.reason }
      );

      setModal("");
      setSelected(null);
      setNotice("Registration deleted successfully.");

      await load(page);
    } catch (err) {
      setNotice(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // PAYMENT SCREENSHOT
  const handleScreenshot = (file) => {
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setNotice("Please upload a PNG, JPG or WEBP image.");
      return;
    }

    if (file.size > 1.8 * 1024 * 1024) {
      setNotice("Image must be smaller than 1.8 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setActionForm((prev) => ({
        ...prev,
        screenshot: reader.result,
      }));
    };

    reader.onerror = () => {
      setNotice("Could not read the image.");
    };

    reader.readAsDataURL(file);
  };

  const batches = ["All", ...availableBatches];

  const stats = [
    {
      label: "Total registrations",
      value: statsData.total || 0,
      Icon: Users,
    },
    {
      label: "Pending applications",
      value: statsData.pending || 0,
      Icon: ClipboardList,
    },
    {
      label: "Approved registrations",
      value: statsData.approved || 0,
      Icon: Sun,
    },
    {
      label: "Converted students",
      value: statsData.converted || 0,
      Icon: CalendarDays,
    },
  ];

  const reg = selected?.registration;
  const payments = selected?.payments || [];
  const history = selected?.history || [];

  const formInput = {
    width: "100%",
    padding: "11px 13px",
    border: "2px solid #2A0A3F",
    borderRadius: 10,
    font: "inherit",
    color: "#2A0A3F",
    background: "#fff",
    marginTop: 6,
  };

  const labelStyle = {
    display: "block",
    marginBottom: 13,
    fontSize: 13,
    fontWeight: 700,
  };

  const modalOverlay = {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(25, 5, 35, .72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  };

  const modalBox = {
    width: "min(760px, 100%)",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#FFF6FC",
    border: "3px solid #2A0A3F",
    borderRadius: 22,
    padding: 22,
    boxShadow: "8px 8px 0 #FFA8E0",
  };

  const actionButton = {
    padding: "9px 13px",
    background: "#C6FF3D",
    color: "#2A0A3F",
    border: "2px solid #2A0A3F",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
    margin: "4px",
  };

  const closeModal = () => {
    setModal("");
    resetActionForm();
  };

  return (
    <div className="tr">
      <style>{styles}</style>

      <div className="tr-grid" />

      <div
        className="tr-ball"
        style={{
          width: 34,
          height: 34,
          top: "22%",
          right: "5%",
          animation: "tr-float 6s ease-in-out infinite",
        }}
      />

      <div
        className="tr-ball"
        style={{
          width: 22,
          height: 22,
          bottom: "10%",
          left: "4%",
          animation: "tr-float 5s ease-in-out infinite .8s",
        }}
      />

      {/* HEADER */}
      <header className="tr-header">
        <div className="tr-brand">
          <div className="tr-logo">
            <img src={LOGO} alt="TCG logo" />
          </div>

          <div>
            <h1>Tikone Cricket Gurukul</h1>
            <p>Admin — registrations dashboard</p>
          </div>
        </div>

        <button
          className={`tr-btn ${loading ? "spinning" : ""}`}
          onClick={() => load(page)}
          disabled={loading}
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </header>

      <div className="tr-body">
        {/* STATISTICS */}
        <div className="tr-stats">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="tr-stat"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="tr-stat-ic">
                <s.Icon size={19} />
              </div>

              <small>{s.label}</small>
              <strong>{s.value}</strong>
            </div>
          ))}
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="tr-filters">
          <div className="tr-search">
            <Search size={16} color="#2A0A3F" />

            <input
              className="tr-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, phone or ref no..."
              aria-label="Search registrations"
            />
          </div>

          <div className="tr-chips">
            {batches.map((b) => (
              <button
                key={b}
                className={`tr-chip ${batchFilter === b ? "on" : ""}`}
                onClick={() => {
                  setBatchFilter(b);
                  setPage(1);
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* REGISTRATION TABLE */}
        <div className="tr-card">
          {loading ? (
            <div className="tr-state">
              <div className="tr-spinner" />
              Loading registrations...
            </div>
          ) : error ? (
            <div className="tr-state err" role="alert">
              <AlertCircle size={34} />
              <div>Could not load data: {error}</div>
            </div>
          ) : data.length === 0 ? (
            <div className="tr-state">No registrations found.</div>
          ) : (
            <div className="tr-scroll">
              <table className="tr-table">
                <thead>
                  <tr>
                    {[
                      "Ref no",
                      "Player name",
                      "Phone",
                      "Email",
                      "Batch",
                      "Level",
                      "Role",
                      "Program",
                      "Status",
                      "Registered",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                    <th className="tr-act">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((r) => (
                    <tr key={r._id}>
                      <td className="ref">
                        {r.refNum || r.registrationNumber || "—"}
                      </td>

                      <td className="name">
                        {r.fname || r.firstName || ""}{" "}
                        {r.lname || r.lastName || ""}
                      </td>

                      <td>{r.phone || "—"}</td>
                      <td className="clip" title={r.email || ""}>
                        {r.email || "—"}
                      </td>

                      <td>
                        {(r.batchName || r.batch) ? (
                          <span className="tr-pill">
                            {r.batchName || r.batch}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td>{r.level || "—"}</td>
                      <td>{r.role || r.playingRole || "—"}</td>
                      <td>{r.duration || r.program || "—"}</td>

                      <td>
                        <span className="tr-pill">
                          {(r.status || "pending").replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="muted">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </td>

                      {/* ACTION: Manage opens the existing details modal */}
                      <td className="tr-act">
                        <button
                          type="button"
                          className="tr-btn tr-manage"
                          onClick={() => openRegistration(r._id)}
                          disabled={actionLoading}
                          aria-label={`Manage registration ${
                            r.refNum || r.registrationNumber || ""
                          }`}
                        >
                          <Eye size={15} />
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div className="tr-foot">
              <span>
                Showing <strong>{data.length}</strong> registrations
                out of <strong>{pagination.total}</strong>
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <button
                  className="tr-btn"
                  disabled={page <= 1 || loading}
                  onClick={() =>
                    setPage((p) => Math.max(1, p - 1))
                  }
                >
                  Previous
                </button>

                <strong>
                  {pagination.page} / {pagination.pages}
                </strong>

                <button
                  className="tr-btn"
                  disabled={page >= pagination.pages || loading}
                  onClick={() =>
                    setPage((p) =>
                      Math.min(pagination.pages, p + 1)
                    )
                  }
                >
                  Next
                </button>
              </div>

              <span>Tikone Cricket Gurukul — Admin</span>
            </div>
          )}
        </div>
      </div>

      {/* NOTICE */}
      {notice && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 2000,
            maxWidth: 380,
            padding: 15,
            background: "#2A0A3F",
            color: "#fff",
            border: "2px solid #C6FF3D",
            borderRadius: 12,
            boxShadow: "4px 4px 0 #FFA8E0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 15,
            }}
          >
            <span>{notice}</span>

            <button
              onClick={() => setNotice("")}
              style={{
                background: "transparent",
                border: 0,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* REGISTRATION DETAILS MODAL */}
      {modal === "view" && reg && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <h2>Registration Details</h2>

              <button
                onClick={closeModal}
                style={actionButton}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p>
              <strong>Status:</strong>{" "}
              <span className="tr-pill">
                {(reg.status || "pending").replaceAll("_", " ")}
              </span>
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 12,
              }}
            >
              {Object.entries(reg).map(([key, value]) => {
                if (
                  [
                    "_id",
                    "__v",
                    "createdAt",
                    "updatedAt",
                    "approvedBy",
                    "rejectedBy",
                  ].includes(key) ||
                  value === null ||
                  typeof value === "object"
                ) {
                  return null;
                }

                return (
                  <div
                    key={key}
                    style={{
                      background: "#fff",
                      border: "1px solid #e6c9df",
                      borderRadius: 10,
                      padding: 11,
                    }}
                  >
                    <small style={{ color: "#76547f" }}>
                      {key.replace(/([A-Z])/g, " $1")}
                    </small>

                    <div style={{ fontWeight: 700, marginTop: 4 }}>
                      {String(value)}
                    </div>
                  </div>
                );
              })}
            </div>

            <h3>Admin Actions</h3>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <button
                style={actionButton}
                onClick={() => openAction("edit")}
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                style={actionButton}
                onClick={() => openAction("review")}
              >
                <Eye size={14} /> Review
              </button>

              <button
                style={actionButton}
                onClick={() => openAction("approve")}
              >
                <CheckCircle size={14} /> Approve
              </button>

              <button
                style={actionButton}
                onClick={() => openAction("reject")}
              >
                <XCircle size={14} /> Reject
              </button>

              <button
                style={actionButton}
                onClick={() => openAction("waitlist")}
              >
                <Clock size={14} /> Waitlist
              </button>

              <button
                style={actionButton}
                onClick={() => updateStatus("reopen")}
              >
                Reopen
              </button>

              <button
                style={actionButton}
                onClick={() => openAction("batch")}
              >
                <Layers size={14} /> Assign batch
              </button>

              <button
                style={actionButton}
                onClick={() => openAction("paymentRequest")}
              >
                <CreditCard size={14} /> Payment request
              </button>

              <button
                style={actionButton}
                onClick={() => openAction("proof")}
              >
                Record payment proof
              </button>

              <button
                style={actionButton}
                onClick={() => openAction("verify")}
              >
                Verify payment
              </button>

              <button
                style={actionButton}
                onClick={() => openAction("rejectPayment")}
              >
                Reject payment
              </button>

              <button
                style={actionButton}
                onClick={() => openAction("convert")}
              >
                <UserPlus size={14} /> Convert student
              </button>

              <button
                style={actionButton}
                onClick={sendNotification}
              >
                <Mail size={14} /> Notify
              </button>

              <button
                style={{
                  ...actionButton,
                  background: "#ffd0d0",
                }}
                onClick={() => openAction("delete")}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>

            <h3>Payment Requests</h3>

            {payments.length === 0 ? (
              <p>No payment requests found.</p>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment._id}
                  style={{
                    background: "#fff",
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 8,
                    border: "1px solid #e6c9df",
                  }}
                >
                  <strong>Amount:</strong> ₹{payment.amount}
                  <br />
                  <strong>Status:</strong> {payment.status}
                  <br />
                  <strong>Description:</strong>{" "}
                  {payment.description || "—"}
                  {payment.transactionId && (
                    <>
                      <br />
                      <strong>Transaction ID:</strong>{" "}
                      {payment.transactionId}
                    </>
                  )}
                  {payment.screenshot && (
                    <div style={{ marginTop: 8 }}>
                      <a
                        href={payment.screenshot}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View payment screenshot
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}

            <h3>
              <History size={17} style={{ verticalAlign: "middle" }} />{" "}
              Registration History
            </h3>

            {history.length === 0 ? (
              <p>No history available.</p>
            ) : (
              history.map((item, index) => (
                <div
                  key={item._id || index}
                  style={{
                    borderLeft: "3px solid #2A0A3F",
                    padding: "5px 12px",
                    marginBottom: 10,
                    background: "#fff",
                  }}
                >
                  <strong>
                    {item.action || item.status || "Update"}
                  </strong>

                  <div>{item.remarks || item.reason || ""}</div>

                  <small>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString("en-IN")
                      : ""}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {modal === "edit" && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Edit Registration</h2>

            {editFields.length === 0 ? (
              <p>No editable fields were returned by the backend.</p>
            ) : (
              editFields.map((field) => (
                <label key={field.key} style={labelStyle}>
                  {field.key.replace(/([A-Z])/g, " $1")}

                  {field.options?.length ? (
                    <select
                      style={formInput}
                      value={editValues[field.key] ?? ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select</option>

                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      style={formInput}
                      value={editValues[field.key] ?? ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <input
                      style={formInput}
                      type={
                        field.type === "number"
                          ? "number"
                          : field.type === "date"
                          ? "date"
                          : "text"
                      }
                      value={editValues[field.key] ?? ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                    />
                  )}
                </label>
              ))
            )}

            <button
              style={actionButton}
              onClick={saveEdit}
              disabled={actionLoading || editFields.length === 0}
            >
              <Save size={15} /> Save Changes
            </button>

            <button style={actionButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* STATUS MODALS */}
      {["review", "approve", "reject", "waitlist"].includes(modal) && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>
              {modal.charAt(0).toUpperCase() + modal.slice(1)} Registration
            </h2>

            {["reject", "waitlist"].includes(modal) && (
              <label style={labelStyle}>
                Reason *
                <textarea
                  style={formInput}
                  value={actionForm.reason}
                  onChange={(e) =>
                    setActionForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Enter reason..."
                />
              </label>
            )}

            <label style={labelStyle}>
              Admin remarks
              <textarea
                style={formInput}
                value={actionForm.remarks}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }))
                }
                placeholder="Optional remarks..."
              />
            </label>

            <button
              style={actionButton}
              disabled={actionLoading}
              onClick={() => updateStatus(modal)}
            >
              Confirm
            </button>

            <button style={actionButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* BATCH MODAL */}
      {modal === "batch" && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Assign Batch</h2>

            <label style={labelStyle}>
              Select batch

              <select
                style={formInput}
                value={actionForm.batchId}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    batchId: e.target.value,
                  }))
                }
              >
                <option value="">Select batch</option>

                {batchesList.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name} — {batch.timing || "Timing not specified"}
                    {batch.available !== undefined
                      ? ` (${batch.available} seats available)`
                      : ""}
                  </option>
                ))}
              </select>
            </label>

            <button
              style={actionButton}
              onClick={assignBatch}
              disabled={actionLoading}
            >
              Assign Batch
            </button>

            <button style={actionButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT REQUEST MODAL */}
      {modal === "paymentRequest" && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Create Payment Request</h2>

            <label style={labelStyle}>
              Select fee plan

              <select
                style={formInput}
                value={actionForm.feePlanId}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    feePlanId: e.target.value,
                  }))
                }
              >
                <option value="">Select fee plan</option>

                {feePlans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name || plan.title || "Fee plan"} — ₹
                    {plan.amount || plan.price || plan.fee || 0}
                  </option>
                ))}
              </select>
            </label>

            <label style={labelStyle}>
              Notes

              <textarea
                style={formInput}
                value={actionForm.notes}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Optional payment instructions..."
              />
            </label>

            <button
              style={actionButton}
              onClick={createPaymentRequest}
              disabled={actionLoading}
            >
              Create Request
            </button>

            <button style={actionButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT PROOF MODAL */}
      {modal === "proof" && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Record Payment Proof</h2>

            <label style={labelStyle}>
              Payment request

              <select
                style={formInput}
                value={actionForm.paymentRequestId}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    paymentRequestId: e.target.value,
                  }))
                }
              >
                <option value="">Select payment request</option>

                {payments
                  .filter((p) => p.status === "pending")
                  .map((payment) => (
                    <option key={payment._id} value={payment._id}>
                      ₹{payment.amount} — {payment.description}
                    </option>
                  ))}
              </select>
            </label>

            <label style={labelStyle}>
              Transaction ID

              <input
                style={formInput}
                value={actionForm.transactionId}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    transactionId: e.target.value,
                  }))
                }
                placeholder="Enter transaction ID"
              />
            </label>

            <label style={labelStyle}>
              Payment screenshot

              <input
                style={formInput}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => handleScreenshot(e.target.files?.[0])}
              />
            </label>

            <button
              style={actionButton}
              onClick={recordPaymentProof}
              disabled={actionLoading}
            >
              Save Payment Proof
            </button>

            <button style={actionButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* VERIFY PAYMENT MODAL */}
      {modal === "verify" && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Verify Payment</h2>

            <label style={labelStyle}>
              Payment request

              <select
                style={formInput}
                value={actionForm.paymentRequestId}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    paymentRequestId: e.target.value,
                  }))
                }
              >
                <option value="">Select payment request</option>

                {payments
                  .filter((p) => p.status === "pending")
                  .map((payment) => (
                    <option key={payment._id} value={payment._id}>
                      ₹{payment.amount} — {payment.description}
                      {payment.proofSubmittedAt
                        ? " (Proof submitted)"
                        : ""}
                    </option>
                  ))}
              </select>
            </label>

            <label style={labelStyle}>
              Transaction ID

              <input
                style={formInput}
                value={actionForm.transactionId}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    transactionId: e.target.value,
                  }))
                }
              />
            </label>

            <label style={labelStyle}>
              Remarks

              <textarea
                style={formInput}
                value={actionForm.remarks}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }))
                }
              />
            </label>

            <button
              style={actionButton}
              onClick={verifyPayment}
              disabled={actionLoading}
            >
              Verify Payment
            </button>

            <button style={actionButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* REJECT PAYMENT MODAL */}
      {modal === "rejectPayment" && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Reject Payment</h2>

            <label style={labelStyle}>
              Payment request

              <select
                style={formInput}
                value={actionForm.paymentRequestId}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    paymentRequestId: e.target.value,
                  }))
                }
              >
                <option value="">Select payment request</option>

                {payments
                  .filter((p) => p.status === "pending")
                  .map((payment) => (
                    <option key={payment._id} value={payment._id}>
                      ₹{payment.amount} — {payment.description}
                    </option>
                  ))}
              </select>
            </label>

            <label style={labelStyle}>
              Rejection reason *

              <textarea
                style={formInput}
                value={actionForm.reason}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
              />
            </label>

            <button
              style={actionButton}
              onClick={rejectPayment}
              disabled={actionLoading}
            >
              Reject Payment
            </button>

            <button style={actionButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CONVERT STUDENT MODAL */}
      {modal === "convert" && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Convert to Student</h2>

            <p>
              This action creates a student account from the selected
              registration.
            </p>

            <label
              style={{
                ...labelStyle,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <input
                type="checkbox"
                checked={actionForm.skipPayment}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    skipPayment: e.target.checked,
                  }))
                }
              />

              Skip payment verification (admin-authorised waiver)
            </label>

            <label style={labelStyle}>
              Remarks

              <textarea
                style={formInput}
                value={actionForm.remarks}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }))
                }
              />
            </label>

            <button
              style={actionButton}
              onClick={convertToStudent}
              disabled={actionLoading}
            >
              <UserPlus size={15} /> Convert Student
            </button>

            <button style={actionButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {modal === "delete" && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Delete Registration</h2>

            <p>This action cannot be undone.</p>

            <label style={labelStyle}>
              Deletion reason *

              <textarea
                style={formInput}
                value={actionForm.reason}
                onChange={(e) =>
                  setActionForm((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                placeholder="Enter reason for deletion..."
              />
            </label>

            <button
              style={{
                ...actionButton,
                background: "#ffb7b7",
              }}
              onClick={deleteRegistration}
              disabled={actionLoading}
            >
              <Trash2 size={15} /> Confirm Delete
            </button>

            <button style={actionButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ACTION LOADING */}
      {actionLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3000,
            background: "rgba(42,10,63,.25)",
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 18,
              borderRadius: 14,
              fontWeight: 800,
              border: "2px solid #2A0A3F",
            }}
          >
            Please wait...
          </div>
        </div>
      )}
    </div>
  );
}
      )}
    </div>
