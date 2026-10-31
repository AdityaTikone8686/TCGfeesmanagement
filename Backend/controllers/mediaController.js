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
        success: false,
        message: "Invalid media ID",
      });
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const bucket = getGridFSBucket();

    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files.length) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const file = files[0];
    const fileSize = file.length;
    const contentType =
      file.metadata?.mimeType || "application/octet-stream";

    const range = req.headers.range;

    res.setHeader("Content-Type", contentType);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "public, max-age=3600");

    // Normal request: send the complete file
    if (!range) {
      res.status(200);
      res.setHeader("Content-Length", fileSize);

      const downloadStream = bucket.openDownloadStream(fileId);

      downloadStream.on("error", (error) => {
        if (!res.headersSent) {
          next(error);
        } else {
          res.destroy(error);
        }
      });

      return downloadStream.pipe(res);
    }

    // Handle video byte-range requests
    const match = range.match(/^bytes=(\d*)-(\d*)$/);

    if (!match || (!match[1] && !match[2])) {
      res.setHeader("Content-Range", `bytes */${fileSize}`);
      return res.status(416).end();
    }

    let start;
    let end;

    if (!match[1]) {
      // Suffix range: bytes=-500 means last 500 bytes
      const suffixLength = Number(match[2]);

      if (suffixLength <= 0) {
        res.setHeader("Content-Range", `bytes */${fileSize}`);
        return res.status(416).end();
      }

      start = Math.max(fileSize - suffixLength, 0);
      end = fileSize - 1;
    } else {
      start = Number(match[1]);
      end = match[2] ? Number(match[2]) : fileSize - 1;
    }

    if (
      start >= fileSize ||
      start < 0 ||
      end < start
    ) {
      res.setHeader("Content-Range", `bytes */${fileSize}`);
      return res.status(416).end();
    }

    end = Math.min(end, fileSize - 1);

    const contentLength = end - start + 1;

    res.status(206);
    res.setHeader(
      "Content-Range",
      `bytes ${start}-${end}/${fileSize}`
    );
    res.setHeader("Content-Length", contentLength);

    // GridFS end position is exclusive, so use end + 1
    const downloadStream = bucket.openDownloadStream(fileId, {
      start,
      end: end + 1,
    });

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
