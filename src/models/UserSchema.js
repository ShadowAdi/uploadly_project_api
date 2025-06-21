import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  name: {
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

export const UserModel = new mongoose.Model("User", UserSchema);
