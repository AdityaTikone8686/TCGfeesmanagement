import getGridFSBucket from "../config/gridfs.js";
import mongoose from "mongoose";
import fs from "fs";

// ==========================================
// UPLOAD IMAGE / VIDEO
// ==========================================

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image or video",
      });
    }

    const { title, description } = req.body;

    if (!title || !title.trim()) {
      fs.unlink(req.file.path, () => {});

      return res.status(400).json({
        message: "Media title is required",
      });
    }

    const mediaType = req.file.mimetype.startsWith("image/")
      ? "image"
      : req.file.mimetype.startsWith("video/")
      ? "video"
      : null;

    if (!mediaType) {
      fs.unlink(req.file.path, () => {});

      return res.status(400).json({
        message: "Only images and videos are allowed",
      });
    }

    const bucket = getGridFSBucket();

    const uploadStream = bucket.openUploadStream(
      req.file.originalname,
      {
        metadata: {
          title: title.trim(),
          description: description?.trim() || "",
          mediaType,
          mimeType: req.file.mimetype,
          uploadedBy: req.user.id,
        },
      }
    );

    const readStream = fs.createReadStream(req.file.path);

    readStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      fs.unlink(req.file.path, () => {});

      res.status(201).json({
        success: true,
        message: "Media uploaded successfully",
        media: {
          id: uploadStream.id,
          title: title.trim(),
          description: description?.trim() || "",
          mediaType,
          filename: req.file.originalname,
        },
      });
    });

    uploadStream.on("error", (error) => {
      fs.unlink(req.file.path, () => {});
      next(error);
    });

    readStream.on("error", (error) => {
      fs.unlink(req.file.path, () => {});
      uploadStream.abort();
      next(error);
    });

  } catch (error) {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    next(error);
  }
};

// ==========================================
// GET ALL MEDIA
// ==========================================

export const getAllMedia = async (req, res, next) => {
  try {
    const bucket = getGridFSBucket();

    const files = await bucket
      .find({})
      .sort({ uploadDate: -1 })
      .toArray();

    const media = files.map((file) => ({
      id: file._id,
      title: file.metadata?.title || file.filename,
      description: file.metadata?.description || "",
      mediaType: file.metadata?.mediaType,
      mimeType: file.metadata?.mimeType,
      filename: file.filename,
      size: file.length,
      uploadDate: file.uploadDate,
      url: `/api/media/${file._id}/stream`,
    }));

    res.json({
      success: true,
      count: media.length,
      media,
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// STREAM IMAGE / VIDEO
// ==========================================

export const streamMedia = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid media ID",
      });
    }

    const bucket = getGridFSBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files.length) {
      return res.status(404).json({
        message: "Media not found",
      });
    }

    const file = files[0];

    res.set("Content-Type", file.metadata?.mimeType || "application/octet-stream");
    res.set("Content-Length", file.length);
    res.set("Accept-Ranges", "bytes");
    res.set("Cache-Control", "public, max-age=3600");

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", (error) => {
      if (!res.headersSent) {
        next(error);
      } else {
        res.destroy(error);
      }
    });

    downloadStream.pipe(res);

  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE MEDIA
// ==========================================

export const deleteMedia = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid media ID",
      });
    }

    const bucket = getGridFSBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files.length) {
      return res.status(404).json({
        message: "Media not found",
      });
    }

    await bucket.delete(fileId);

    res.json({
      success: true,
      message: "Media deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};
