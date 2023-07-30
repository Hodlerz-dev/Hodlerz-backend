import mongoose, { Schema, model } from "mongoose";

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    channels: [
      {
        name: { type: String, required: true },
        description: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
        messages: [
          {
            sender: { type: Schema.Types.ObjectId, ref: "User" },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);
