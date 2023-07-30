import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    channel: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
