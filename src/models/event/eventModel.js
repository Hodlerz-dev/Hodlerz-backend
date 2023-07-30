import mongoose, { Schema } from "mongoose";
// import { google } from "googlemaps";

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    organizer: { type: Schema.Types.ObjectId, ref: "User" },
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followersOfAttendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    brozOfAttendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// index
// eventSchema.index({ location: "2dsphere" });

export const Event = mongoose.model("Event", eventSchema);
