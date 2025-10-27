import mongoose, { Document, Schema } from "mongoose";

export type Status = "Pending" | "In Progress" | "Resolved";
export type Priority = "Low" | "Medium" | "High";

export interface IComplaint extends Document {
  title: string;
  description: string;
  category?: string;
  priority?: Priority;
  status: Status;
  userId: string;
  userEmail: string;
  dateSubmitted: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, default: "General", trim: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    dateSubmitted: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint ||
  mongoose.model<IComplaint>("Complaint", ComplaintSchema);