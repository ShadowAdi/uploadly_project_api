import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    url: {
      type: String,
      default: "",
    },
    filename: {
      type: String,
      default: "",
    },
    uploadedAt: {
      type: Date,
    },
  },
});

export const UserModel = new mongoose.model("User", UserSchema);
