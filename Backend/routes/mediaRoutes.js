import express from "express";
import multer from "multer";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

import {
  uploadMedia,
  getAllMedia,
  streamMedia,
  deleteMedia,
} from "../controllers/mediaController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// MULTER CONFIGURATION
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `${randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Upload JPG, PNG, WEBP, GIF, MP4 or WEBM."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // Maximum 100 MB
  },
});

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all gallery media
router.get("/", getAllMedia);

// Stream individual image/video
router.get("/:id/stream", streamMedia);

// ==========================================
// ADMIN-ONLY ROUTES
// ==========================================

// Upload image/video
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("file"),
  uploadMedia
);

// Delete media
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteMedia
);

export default router;
