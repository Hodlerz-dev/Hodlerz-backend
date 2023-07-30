import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    pseudo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: { type: String, default: "./uploads/profile/random-user.png" },
    twitter: { type: String },
    country: { type: String },
    city: { type: String },
    job: { type: String },
    sideProject: { type: String },
    followersInCommon: { type: [String] },
    followers: { type: [String] },
    following: { type: [String] },
    likes: { type: [String] },
    brozInCommon: { type: [String] },
    broz: { type: [String] },
    followingBroz: { type: [String] },
    skillz: { type: String, max: 1024 },
    interests: { type: String, max: 1024 },
    learning: { type: String, max: 1024 },
    bag: { type: [String] },
    eventsOrganized: { type: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
