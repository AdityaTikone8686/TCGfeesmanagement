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

    if (!title.trim() || !file) {
      setError("Please enter a title and select a file.");
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

  const styles = {
    container: {
      padding: "24px",
      color: "inherit",
    },
    form: {
      padding: "22px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      marginBottom: "30px",
      maxWidth: "650px",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginTop: "8px",
      marginBottom: "16px",
      border: "1px solid #ccc",
      borderRadius: "7px",
      boxSizing: "border-box",
    },
    button: {
      padding: "11px 18px",
      border: "none",
      borderRadius: "7px",
      cursor: "pointer",
      fontWeight: "600",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
      gap: "20px",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: "12px",
      overflow: "hidden",
      minWidth: 0,
    },
    preview: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
      background: "#eee",
      display: "block",
    },
    cardBody: {
      padding: "14px",
    },
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "22px",
        }}
      >
        <div>
          <h2>Media Management</h2>
          <p>Upload and manage your cricket academy photos and videos.</p>
        </div>

        <button
          style={styles.button}
          onClick={fetchMedia}
          disabled={loading}
        >
          <RefreshCw size={15} style={{ marginRight: "6px" }} />
          Refresh
        </button>
      </div>

      {/* Upload Form */}
      <form style={styles.form} onSubmit={handleUpload}>
        <h3>
          <Upload size={19} style={{ verticalAlign: "middle" }} /> Upload
          New Media
        </h3>

        <label>Title *</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter media title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          style={{
            ...styles.input,
            minHeight: "85px",
            resize: "vertical",
          }}
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Select Image or Video *</label>
        <input
          style={styles.input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />

        {file && (
          <p>
            Selected: {file.name} ({formatSize(file.size)})
          </p>
        )}

        <button
          type="submit"
          disabled={uploading || !token}
          style={{
            ...styles.button,
            background: "#e63946",
            color: "#fff",
            opacity: uploading || !token ? 0.6 : 1,
          }}
        >
          {uploading ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
                style={{ verticalAlign: "middle" }}
              />{" "}
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} style={{ verticalAlign: "middle" }} /> Upload
              Media
            </>
          )}
        </button>
      </form>

      {/* Messages */}
      {error && (
        <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
      )}

      {success && (
        <p style={{ color: "green", marginBottom: "15px" }}>{success}</p>
      )}

      {/* Media Gallery */}
      <h3>
        Uploaded Media ({media.length})
      </h3>

      {loading ? (
        <p>Loading media...</p>
      ) : media.length === 0 ? (
        <p>No uploaded media found.</p>
      ) : (
        <div style={styles.grid}>
          {media.map((item) => {
            const mediaUrl = `${BACKEND_URL}${item.url}`;

            return (
              <div key={item.id} style={styles.card}>
                {item.mediaType === "image" ? (
                  <img
                    src={mediaUrl}
                    alt={item.title}
                    style={styles.preview}
                  />
                ) : (
                  <video
                    src={mediaUrl}
                    controls
                    preload="metadata"
                    style={styles.preview}
                  />
                )}

                <div style={styles.cardBody}>
                  <h4>{item.title}</h4>

                  <p style={{ fontSize: "13px", color: "#777" }}>
                    {item.description || "No description"}
                  </p>

                  <p style={{ fontSize: "12px" }}>
                    {item.mediaType === "image" ? (
                      <ImageIcon size={14} />
                    ) : (
                      <Video size={14} />
                    )}{" "}
                    {item.mediaType} · {formatSize(item.size)}
                  </p>

                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      ...styles.button,
                      background: "#dc3545",
                      color: "white",
                      width: "100%",
                    }}
                  >
                    <Trash2
                      size={15}
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaManagement;
