import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,           // Optional but recommended to prevent duplicate emails
    lowercase: true,
    trim: true,
  },
  password: {
    required: true,
    type: String,
  },
  image: {
    type: String, // Store the image URL (path)
    default: '',
  },
  
})

const EmployeeModel = mongoose.model("register", EmployeeSchema)
export default EmployeeModel