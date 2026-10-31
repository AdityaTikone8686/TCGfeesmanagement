import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let bucket;

const getGridFSBucket = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB is not connected");
  }

  if (!bucket) {
    bucket = new GridFSBucket(db, {
      bucketName: "mediaFiles",
    });

    console.log("MongoDB GridFS initialized");
  }

  return bucket;
};

export default getGridFSBucket;
