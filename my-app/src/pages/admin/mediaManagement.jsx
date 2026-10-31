import React, { useEffect, useState } from "react";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Video,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { mediaAPI } from "../../services/mediaAPI";

const BACKEND_URL =
  "https://tikonecricketgurukulbackend.onrender.com";

/* ------------------------------------------------------------------
   THEME  (same tokens as the landing, cart and checkout pages)
   Pink  : #FFA8E0  (brand / background)
   Plum  : #2A0A3F  (contrast: text, dark sections, buttons)
   Lime  : #C6FF3D  (cricket-ball accent pop)
   Cream : #FFF6FC  (soft surfaces)
   Fonts : Bricolage Grotesque (headings) + DM Sans (body)
------------------------------------------------------------------- */
const themeStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcg {
  --pink: #FFA8E0;
  --pink-soft: #FFD3F0;
  --pink-deep: #FF7FD0;
  --plum: #2A0A3F;
  --plum-2: #4A1470;
  --lime: #C6FF3D;
  --cream: #FFF6FC;
  position: relative;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: var(--plum);
  background: linear-gradient(180deg, var(--pink-soft) 0%, var(--cream) 100%);
  overflow: hidden;
}
.tcg h1, .tcg h2, .tcg h3, .tcg h4 {
  font-family: 'Bricolage Grotesque', 'DM Sans', sans-serif;
  letter-spacing: -0.02em;
}
.tcg * { box-sizing: border-box; }

/* ---------- keyframes ---------- */
@keyframes tcg-float { 0%,100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-22px) rotate(6deg) } }
@keyframes tcg-float-b { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(30px,-26px) scale(1.12) } }
@keyframes tcg-spin { to { transform: rotate(360deg) } }
@keyframes tcg-shimmer { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
@keyframes tcg-pop-in { 0% { opacity: 0; transform: scale(.7) translateY(20px) } 100% { opacity: 1; transform: scale(1) translateY(0) } }
@keyframes tcg-underline { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes tcg-card-in { 0% { opacity: 0; transform: translateY(28px) scale(.98) } 100% { opacity: 1; transform: none } }

/* ---------- decorative ---------- */
.tcg-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
.tcg-ball { position: absolute; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%);
  box-shadow: inset -6px -8px 14px rgba(0,0,0,.25), 0 12px 24px rgba(42,10,63,.25); }
.tcg-ball::after { content: ''; position: absolute; inset: 8% 45% 8% 45%; border-left: 2px dashed rgba(255,255,255,.7); border-right: 2px dashed rgba(255,255,255,.7); border-radius: 50%; }
.tcg-grid { position: absolute; inset: 0; pointer-events: none; opacity: .35;
  background-image: linear-gradient(rgba(42,10,63,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(42,10,63,.08) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(circle at 50% 30%, #000 20%, transparent 75%);
          mask-image: radial-gradient(circle at 50% 30%, #000 20%, transparent 75%); }

.tcg-inner { position: relative; z-index: 2; padding: 28px 20px 48px; max-width: 1200px; margin: 0 auto; }
@media (min-width: 768px) { .tcg-inner { padding: 36px 28px 64px; } }

/* ---------- header ---------- */
.tcg-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 30px; }
.tcg-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; font-weight: 700; font-size: 13px; background: var(--plum); color: var(--lime); animation: tcg-pop-in .7s both; }
.tcg-chip svg { animation: tcg-spin 6s linear infinite; }
.tcg-h1 { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800; line-height: 1.05; margin: 14px 0 0; animation: tcg-pop-in .8s .1s both; }
.tcg-shimmer { display: inline-block; background: linear-gradient(90deg, var(--plum) 0%, #b0108a 25%, var(--plum-2) 50%, #b0108a 75%, var(--plum) 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcg-shimmer 5s linear infinite; position: relative; }
.tcg-shimmer::after { content: ''; position: absolute; left: 0; right: 0; bottom: 2px; height: 9px; background: var(--lime); z-index: -1; border-radius: 6px; transform-origin: left; animation: tcg-underline 1.2s .8s both cubic-bezier(.2,.8,.2,1); }
.tcg-lead { margin: 12px 0 0; max-width: 520px; font-size: 1rem; line-height: 1.7; color: rgba(42,10,63,.8); animation: tcg-pop-in .8s .2s both; }

/* ---------- buttons ---------- */
.tcg-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 13px 24px; border-radius: 16px; font-family: inherit; font-weight: 700; font-size: 15px; text-decoration: none; border: 2px solid var(--plum); transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, background .25s, color .25s; cursor: pointer; }
.tcg-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.55), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcg-btn:hover:not(:disabled)::before { left: 140%; }
.tcg-btn:hover:not(:disabled) { transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0 var(--plum); }
.tcg-btn:active:not(:disabled) { transform: translateY(0); box-shadow: 0 0 0 var(--plum); }
.tcg-btn:focus-visible, .tcg-field:focus-visible, .tcg-delete:focus-visible { outline: 3px solid var(--plum); outline-offset: 3px; }
.tcg-btn:disabled { opacity: .5; cursor: not-allowed; }
.tcg-btn.primary { background: var(--plum); color: #fff; }
.tcg-btn.primary:hover:not(:disabled) { background: var(--plum-2); }
.tcg-btn.outline { background: #fff; color: var(--plum); }
.tcg-btn.outline:hover:not(:disabled) { background: var(--lime); }
.tcg-btn.lime { background: var(--lime); color: var(--plum); }
.tcg-btn.lime:hover:not(:disabled) { box-shadow: 6px 6px 0 var(--pink); }
.tcg-btn.danger { background: #fff; color: var(--plum); width: 100%; padding: 10px 16px; font-size: 14px; border-radius: 12px; }
.tcg-btn.danger:hover:not(:disabled) { background: var(--plum); color: var(--lime); box-shadow: 5px 5px 0 var(--lime); }
.tcg-spin { animation: tcg-spin 1s linear infinite; }
@media (max-width: 639px) { .tcg-head .tcg-btn { width: 100%; } }

/* ---------- upload card ---------- */
.tcg-card { position: relative; background: #fff; border: 3px solid var(--plum); border-radius: 28px; padding: 26px; max-width: 680px; margin-bottom: 36px; box-shadow: 10px 10px 0 var(--plum); }
@media (min-width: 640px) { .tcg-card { padding: 32px; } }
.tcg-card-title { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
.tcg-card-title .hic { width: 46px; height: 46px; border-radius: 15px; background: var(--plum); color: var(--lime); display: grid; place-items: center; flex-shrink: 0; transition: transform .5s cubic-bezier(.3,1.6,.5,1); }
.tcg-card:hover .tcg-card-title .hic { transform: rotate(-10deg) scale(1.06); }
.tcg-card-title h3 { margin: 0; font-size: 22px; font-weight: 800; }

.tcg-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 700; }
.tcg-group { margin-bottom: 18px; }
.tcg-field { width: 100%; font-family: inherit; font-size: 15px; font-weight: 500; padding: 12px 14px; border-radius: 14px; border: 2px solid var(--plum); background: var(--cream); color: var(--plum); transition: box-shadow .25s, background .25s, transform .25s; }
.tcg-field::placeholder { color: rgba(42,10,63,.4); }
.tcg-field:focus { outline: none; background: #fff; box-shadow: 5px 5px 0 var(--lime); transform: translate(-1px,-1px); }
textarea.tcg-field { min-height: 90px; resize: vertical; }
.tcg-file { padding: 10px; cursor: pointer; border-style: dashed; }
.tcg-file::file-selector-button { margin-right: 14px; padding: 8px 16px; border: 2px solid var(--plum); border-radius: 10px; background: var(--lime); color: var(--plum); font-family: inherit; font-weight: 700; font-size: 13px; cursor: pointer; transition: background .2s; }
.tcg-file::file-selector-button:hover { background: var(--pink); }
.tcg-picked { margin: -6px 0 18px; padding: 10px 14px; border-radius: 14px; background: var(--pink-soft); border: 2px dashed var(--plum); font-size: 13px; font-weight: 600; word-break: break-all; }

/* ---------- messages ---------- */
.tcg-msg { display: block; max-width: 680px; margin: 0 0 20px; padding: 12px 18px; border-radius: 16px; border: 3px solid var(--plum); font-weight: 700; font-size: 14px; animation: tcg-pop-in .5s both; }
.tcg-msg.err { background: var(--pink); box-shadow: 5px 5px 0 var(--plum); }
.tcg-msg.ok { background: var(--lime); box-shadow: 5px 5px 0 var(--plum); }

/* ---------- gallery ---------- */
.tcg-gh { display: flex; align-items: center; gap: 12px; margin: 0 0 22px; }
.tcg-gh h3 { margin: 0; font-size: 26px; font-weight: 800; }
.tcg-count { padding: 3px 14px; border-radius: 999px; background: var(--lime); border: 3px solid var(--plum); font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 16px; }
.tcg-state { display: inline-flex; align-items: center; gap: 12px; padding: 14px 22px; background: #fff; border: 3px solid var(--plum); border-radius: 20px; box-shadow: 6px 6px 0 var(--lime); font-weight: 700; }
.tcg-state svg { animation: tcg-spin 1s linear infinite; }
.tcg-state.static svg { animation: none; }

.tcg-media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 26px; }
.tcg-mcard { min-width: 0; display: flex; flex-direction: column; background: #fff; border: 3px solid var(--plum); border-radius: 28px; overflow: hidden; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; animation: tcg-card-in .6s cubic-bezier(.2,.8,.2,1) both; animation-delay: var(--d, 0ms); }
.tcg-mcard:hover { transform: translateY(-8px) rotate(-.8deg); box-shadow: 10px 10px 0 var(--plum); }
.tcg-preview { width: 100%; height: 190px; object-fit: cover; background: var(--pink-soft); border-bottom: 3px solid var(--plum); display: block; }
.tcg-mbody { flex: 1; display: flex; flex-direction: column; gap: 10px; padding: 18px; }
.tcg-mbody h4 { margin: 0; font-size: 19px; font-weight: 800; line-height: 1.2; word-break: break-word; }
.tcg-desc { margin: 0; font-size: 13px; line-height: 1.6; color: rgba(42,10,63,.7); }
.tcg-tag { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 800; border: 2px solid var(--plum); background: var(--pink); color: var(--plum); }
.tcg-tag.video { background: var(--lime); }
.tcg-mfoot { margin-top: auto; padding-top: 14px; border-top: 2px dashed rgba(42,10,63,.25); }

@media (prefers-reduced-motion: reduce) {
  .tcg *, .tcg *::before, .tcg *::after { animation: none !important; transition: none !important; }
}
`;

const MediaManagement = ({ token }) => {
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await mediaAPI.getAll();
      setMedia(data);
    } catch (err) {
      setError(err.message || "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
        setError("Please select an image or video.");
        return;
      }
    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      await mediaAPI.upload(formData, token);

      setSuccess("Media uploaded successfully!");

      setTitle("");
      setDescription("");
      setFile(null);

      e.target.reset();

      await fetchMedia();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this media?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await mediaAPI.delete(id, token);

      setMedia((previous) =>
        previous.filter((item) => item.id !== id)
      );

      setSuccess("Media deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete media");
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="tcg">
      <style>{themeStyles}</style>

      <div className="tcg-grid" />
      <div
        className="tcg-blob"
        style={{ width: 320, height: 320, background: "#fff", opacity: 0.55, top: -90, left: -90, animation: "tcg-float-b 12s ease-in-out infinite" }}
      />
      <div
        className="tcg-blob"
        style={{ width: 260, height: 260, background: "#C6FF3D", opacity: 0.3, bottom: -80, right: "10%", animation: "tcg-float-b 15s ease-in-out infinite reverse" }}
      />
      <div
        className="tcg-ball"
        style={{ width: 38, height: 38, top: 28, right: "7%", animation: "tcg-float 6s ease-in-out infinite" }}
      />
      <div
        className="tcg-ball"
        style={{ width: 22, height: 22, bottom: 40, left: "5%", animation: "tcg-float 5s ease-in-out infinite .8s" }}
      />

      <div className="tcg-inner">
        {/* Header */}
        <div className="tcg-head">
          <div>
            <span className="tcg-chip">
              <ImageIcon size={16} />
              <span>Admin Gallery</span>
            </span>
            <h1 className="tcg-h1">
              <span className="tcg-shimmer">Media Management</span>
            </h1>
            <p className="tcg-lead">
              Upload and manage your cricket academy photos and videos.
            </p>
          </div>

          <button
            type="button"
            className="tcg-btn outline"
            onClick={fetchMedia}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "tcg-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Upload Form */}
        <form className="tcg-card" onSubmit={handleUpload}>
          <div className="tcg-card-title">
            <div className="hic">
              <Upload size={22} />
            </div>
            <h3>Upload New Media</h3>
          </div>

          <div className="tcg-group">
            <label className="tcg-label" htmlFor="media-title">
              Title (Optional)
            </label>
            <input
              id="media-title"
              className="tcg-field"
              type="text"
              placeholder="Enter media title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="tcg-group">
            <label className="tcg-label" htmlFor="media-desc">
              Description (Optional)
            </label>
            <textarea
              id="media-desc"
              className="tcg-field"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="tcg-group">
            <label className="tcg-label" htmlFor="media-file">
              Select Image or Video (Optional)
            </label>
            <input
              id="media-file"
              className="tcg-field tcg-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {file && (
            <p className="tcg-picked">
              Selected: {file.name} ({formatSize(file.size)})
            </p>
          )}

          <button
            type="submit"
            className="tcg-btn lime"
            disabled={uploading || !token}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="tcg-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload size={18} /> Upload Media
              </>
            )}
          </button>
        </form>

        {/* Messages */}
        {error && (
          <p className="tcg-msg err" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="tcg-msg ok" role="status">
            {success}
          </p>
        )}

        {/* Media Gallery */}
        <div className="tcg-gh">
          <h3>Uploaded Media</h3>
          <span className="tcg-count">{media.length}</span>
        </div>

        {loading ? (
          <div className="tcg-state">
            <Loader2 size={20} /> Loading media...
          </div>
        ) : media.length === 0 ? (
          <div className="tcg-state static">
            <ImageIcon size={20} /> No uploaded media found.
          </div>
        ) : (
          <div className="tcg-media-grid">
            {media.map((item, index) => {
              const mediaUrl = `${BACKEND_URL}${item.url}`;

              return (
                <div
                  key={item.id}
                  className="tcg-mcard"
                  style={{ "--d": `${Math.min(index, 8) * 70}ms` }}
                >
                  {item.mediaType === "image" ? (
                    <img
                      src={mediaUrl}
                      alt={item.title}
                      className="tcg-preview"
                    />
                  ) : (
                    <video
                      src={mediaUrl}
                      controls
                      preload="metadata"
                      className="tcg-preview"
                    />
                  )}

                  <div className="tcg-mbody">
                    <h4>{item.title}</h4>

                    <p className="tcg-desc">
                      {item.description || "No description"}
                    </p>

                    <span
                      className={`tcg-tag ${
                        item.mediaType === "image" ? "" : "video"
                      }`}
                    >
                      {item.mediaType === "image" ? (
                        <ImageIcon size={14} />
                      ) : (
                        <Video size={14} />
                      )}
                      {item.mediaType} · {formatSize(item.size)}
                    </span>

                    <div className="tcg-mfoot">
                      <button
                        type="button"
                        className="tcg-btn danger tcg-delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManagement;
