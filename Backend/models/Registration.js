import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  refNum: String,
  fname: String,
  lname: String,
  dob: String,
  gender: String,
  parent: String,
  phone: String,
  email: String,
  address: String,
  level: String,
  role: String,
  batch: String,
  duration: String,
  notes: String,
  createdAt: Date,
});

export default mongoose.model("Registration", registrationSchema);
