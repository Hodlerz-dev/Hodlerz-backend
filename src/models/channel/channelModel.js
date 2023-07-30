import mongoose, { Schema } from "mongoose";

const channelSchema = new Schema(
  {
    name: { type: String, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

export const Channel = mongoose.model("Channel", channelSchema);
