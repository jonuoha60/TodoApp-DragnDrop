import mongoose from "mongoose";

const completedTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // Reference to the Employee (user)
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, required: true },  // Add this line to track when the task was completed

});

// Create the model
const CompletedTask = mongoose.model("completedTask", completedTaskSchema);

export default CompletedTask;
