import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import EmployeeModel from './models/User.js';
import bcrypt from 'bcryptjs';

import Task from './models/Task.js';
import CompletedTask from './models/CompletedTask.js';

import jwt from 'jsonwebtoken';
import profilePics from './UserProfilePic.js';  

const app = express(); // Initialize the app




// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/peopledb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Registration Route

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email already exists
    const existingEmployee = await EmployeeModel.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    const randomProfilePic = profilePics[Math.floor(Math.random() * profilePics.length)];
    const imageUrl = `/images/${randomProfilePic}`;


    // Hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new EmployeeModel({
      email,
      password: hashedPassword,
      image: imageUrl,
    });

    await newEmployee.save();


    res.status(201).json({
      message: "Registration successful",
      user: newEmployee,
    });
  } catch (err) {
    console.error('Error in /register:', err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});




// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await EmployeeModel.findOne({ email });

    if (!user) {
      return res.status(404).json("Email does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json("Password is incorrect");
    }

    // You can still create your own JWT if needed, or use Firebase token on client side
    const token = jwt.sign(
      { userId: user._id },  // Use Firebase UID here
      "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Success",
      token,
      userId: user._id,       
      email: user.email,
      image: user.image,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});




app.post('/api/todoapp/AddTask', async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    const {  content, userId, uploadedAt } = req.body;

    // Validate  userId
   

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Create and save the new task
    const newTask = new Task({
      content,
      userId,
      uploadedAt: uploadedAt || new Date() // Default to current date if not provided
    });

    const savedTask = await newTask.save();

    return res.status(201).json({ message: "Task added successfully", task: savedTask });
  } catch (err) {
    console.error("Error details:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});




app.delete('/api/todoapp/DeleteTask', async (req, res) => {
  const { userId, taskId } = req.query;

  // Validate userId and taskId presence
  if (!userId || !taskId) {
    return res.status(400).json({ message: "User ID and Task ID are required" });
  }

  // Validate if taskId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid Task ID format", taskId });
  }

  try {
    // Find and delete the task
    const taskDeleted = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!taskDeleted) {
      return res.status(404).json({ message: "Task not found or doesn't belong to user" });
    }

    res.status(200).json({ message: "Task deleted successfully", taskDeleted });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});

app.delete('/api/todoapp/DeleteAllTasks', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
  }

  try {
      // Remove all tasks for the user from the database
      await Task.deleteMany({ userId });

      return res.status(200).json({ message: "All tasks deleted." });
  } catch (err) {
      console.error("Error deleting tasks:", err);
      return res.status(500).json({ message: "Failed to delete tasks." });
  }
});

// API endpoint to move task from "tasks" to "completed"
// Get Completed Tasks
app.get('/api/todoapp/GetCompletedTasks', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ message: "User Id is required" });
  }

  try {
    const tasks = await CompletedTask.find({ userId });
    res.status(200).json({ message: "Completed tasks retrieved successfully", tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving tasks", error: error.message });
  }
});

// Move Task to Completed
app.put('/api/todoapp/MoveToCompleted', async (req, res) => {
  const { userId, taskId } = req.body;

  if (!userId || !taskId) {
      return res.status(400).json({ message: "Missing userId or taskId." });
  }

  try {
      const task = await Task.findOneAndDelete({ _id: taskId, userId });

      if (!task) {
          return res.status(404).json({ message: "Task not found." });
      }

      const completedTask = new CompletedTask({
          ...task.toObject(),
          completedAt: new Date().toISOString(),
      });

      await completedTask.save();

      return res.status(200).json({ message: "Task moved to completed." });
  } catch (err) {
      console.error("Error moving task:", err);  // Log detailed error
      return res.status(500).json({ message: "Failed to move task.", error: err.message });
  }
});


// Move Task back to "Tasks"
app.put('/api/todoapp/MoveToTasks', async (req, res) => {
  const { userId, taskId } = req.body;

  if (!userId || !taskId) {
    return res.status(400).json({ message: "Missing userId or taskId." });
}
  
  try {
      // Find the task and remove it from the "completed" collection
      const completedTask = await CompletedTask.findOneAndDelete({ _id: taskId, userId });

      if (!completedTask) {
          return res.status(404).json({ message: "Completed task not found." });
      }

      // Add the task back to the "tasks" collection
      const task = new Task({
          ...completedTask.toObject(),
          createdAt: new Date().toISOString(),
      });
      await task.save();

      return res.status(200).json({ message: "Task moved back to tasks." });
  } catch (err) {
      console.error("Error moving completed task:", err);
      return res.status(500).json({ message: "Failed to move completed task." });
  }
});


app.get('/api/todoapp/GetTask', async(req, res) => {
  const { userId } = req.query;

  if(!userId) {
    return res.status(400).json
  }

  try {
    const tasks = await Task.find({ userId });

    res.status(200).json({ message: 'Files retrieved successfully', tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving files', error: error.message });
  }
})






app.get("/api/Users", (req,res)=>{
    res.json({"users": ["firstuser","seconduser","thirduser"]})
})



// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});


