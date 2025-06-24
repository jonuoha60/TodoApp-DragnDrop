import React, { useEffect, useState } from "react";
import {closestCorners, useSensors, PointerSensor, DndContext, KeyboardSensor, TouchSensor, useSensor} from "@dnd-kit/core";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/Task.css"
import { Column } from "./Columns";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ColumnComplete } from "./Columns-completed";

export default function Task() {

    const [tasks, setTasks] = useState([])
    const [completedtasks, setCompletedTasks] = useState([])
    const [error, setError] = useState("")
    const [input, setInput] = useState("")
    const [userId, setUserId] = useState(null)
    const navigate = useNavigate();
    const location = useLocation(); // To access location passed via navigate
    


    const addTaskToDB = async (userId, task) => {
        try {
            const response = await fetch(`http://localhost:5000/api/todoapp/AddTask?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
    
            if (!response.ok) {
                throw new Error("Failed to add task.");
            }
    
            const result = await response.json();
            console.log("Task added successfully:", result);
    
            // Ensure the backend sends the task with an ID
            return result.task;  // Assuming the backend sends back the added task with an id
        } catch (err) {
            console.error("Error:", err);
        }
    };
    
    

    useEffect(() => {
        const userFromState = location.state?.userId;

        const userFromStorage = localStorage.getItem("userId");

        setUserId(userFromState || userFromStorage);

      }, [location.state]);
    

    //    useEffect(() => {

    //       // Recheck localStorage for userId and email after logout
    //       const userFromStorage = localStorage.getItem("userId");
    //       if (!userFromStorage) {
    //         // No user logged in, navigate to login page
    //         navigate("/login");
    //       }
    //     }, [navigate]);
    

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem("taskes")) || [];
        const savedCompletedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
        setCompletedTasks(savedCompletedTasks)
        setTasks(savedTasks);
    }, []);

    useEffect(() => {
        if(!userId) return
        const fetchTask = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/todoapp/GetTask?userId=${userId}`);
                const data = await response.json();
                console.log("Fetched data:", data);
        
                if (data && data.tasks) {
                    const tasks = data.tasks.map(task => {
                        // Ensure each task has a valid 'id'
                        if (!task._id) {
                            console.error("Task missing ID:", task);
                        }
                        return task;
                    });
                    setTasks(tasks);
                    localStorage.setItem("taskes", JSON.stringify(tasks));
                    console.log("Fetched tasks:", tasks);
                } else {
                    console.error("No tasks found in response:", data);
                }
        
                if (!response.ok) {
                    throw new Error("Failed to fetch tasks, try again.");
                }
        
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        };
        
    fetchTask()
    }, [userId])


    
      

    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!input) return;
        if (input.trim() === "") return;
    
        if (tasks.some(task => task.content.toLowerCase() === input.toLowerCase())) {
            setError("You already have this task");
            return;
        }
    
        if (completedtasks.some(task => task.content.toLowerCase() === input.toLowerCase())) {
            setError("You already completed this task");
            return;
        }
    
        const storedUserId = localStorage.getItem("userId");
    
        // Create a new task object without an id for now
        const newNote = {
            userId: storedUserId,
            content: input,
            createdAt: new Date().toISOString(),
        };
    
        // Add the task to the backend and await for the result to get the task with an id
        const result = await addTaskToDB(storedUserId, newNote);
    
        if (result) {
            // The task returned from the backend now has the id
            setTasks(prevTasks => {
                const updatedTasks = [...prevTasks, result];
                localStorage.setItem("taskes", JSON.stringify(updatedTasks)); // Save tasks with `id` in localStorage
                return updatedTasks;
            });
        }
    
        setError("");
        setInput(""); // Clear input field after submission
    };
    

    const deleteTask = async (id) => {
        console.log("Task ID:", id, "user ID:", userId);  // Debug: Check if the ID is correctly passed

        if (!userId) return;
    
        try {
            // Make the DELETE request to the backend
            const response = await fetch(`http://localhost:5000/api/todoapp/DeleteTask?userId=${userId}&taskId=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            console.log("Task deleted:", data);
    
            if (!response.ok) {
                throw new Error("Failed to delete task.");
            }
    
            // Only update the frontend state and localStorage after the backend confirms deletion
            setTasks((prevTasks) => {
                const updatedTasks = prevTasks.filter((task) => task._id !== id);
                localStorage.setItem("taskes", JSON.stringify(updatedTasks));
                return updatedTasks;
            });
    
            setCompletedTasks((prevCompleted) => {
                const updatedCompleted = prevCompleted.filter((task) => task._id !== id);
                localStorage.setItem("completedTasks", JSON.stringify(updatedCompleted));
                return updatedCompleted;
            });
    
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };
    
    const deleteAllTask = async (id) => {
        console.log("Task ID:", id, "user ID:", userId);  // Debug: Check if the ID is correctly passed

        if (!userId) return;
    
        try {
            // Make the DELETE request to the backend
            const response = await fetch(`http://localhost:5000/api/todoapp/DeleteAllTasks?userId=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            console.log("Task deleted:", data);
    
            if (!response.ok) {
                throw new Error("Failed to delete task.");
            }
    
            // Only update the frontend state and localStorage after the backend confirms deletion
            setTasks([]);
        setCompletedTasks([]);
        localStorage.setItem("taskes", JSON.stringify([]));
        localStorage.setItem("completedTasks", JSON.stringify([]));
    
           
    
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    useEffect(() => {
        if (!userId) return;
        const fetchCompletedTasks = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/todoapp/GetCompletedTasks?userId=${userId}`);
                const data = await response.json();
                console.log("Fetched completed tasks:", data);
    
                if (data && data.tasks) {
                    const completedTasks = data.tasks.map(task => {
                        // Ensure each completed task has a valid 'id'
                        if (!task._id) {
                            console.error("Completed task missing ID:", task);
                        }
                        return task;
                    });
                    setCompletedTasks(completedTasks);
                    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
                } else {
                    console.error("No completed tasks found in response:", data);
                }
    
                if (!response.ok) {
                    throw new Error("Failed to fetch completed tasks.");
                }
    
            } catch (err) {
                console.error("Error fetching completed tasks:", err);
            }
        };
    
        fetchCompletedTasks();
    }, [userId]);
    
      
    const handleDragEnd = async (event) => {
        const { active, over } = event;
    
        if (!over) return;
    
        const activeId = active.id;
        
        // Find out which column the task is coming from
        const isTaskInTodo = tasks.some(task => task._id === activeId);
        const isTaskInCompleted = completedtasks.some(task => task._id === activeId);
    
        // Move task from "tasks" to "completedtasks"
        if (isTaskInTodo) {
            const taskToMove = tasks.find(task => task._id === activeId);
            
            if (!taskToMove) return;
    
            // Update local tasks state (remove from tasks)
            const updatedTasks = tasks.filter(task => task._id !== activeId);
            setTasks(updatedTasks);
    
            // Add the task to completed tasks and update local state
            const updatedCompletedTasks = [...completedtasks, taskToMove];
            setCompletedTasks(updatedCompletedTasks);
    
            // Save to localStorage
            localStorage.setItem("taskes", JSON.stringify(updatedTasks));
            localStorage.setItem("completedTasks", JSON.stringify(updatedCompletedTasks));
    
            // Optionally, send this data to the backend (you might already have this logic in place)
            await moveTaskToCompletedBackend(taskToMove);
        }
    
        // Move task from "completedtasks" to "tasks"
        else if (isTaskInCompleted) {
            const taskToMove = completedtasks.find(task => task._id === activeId);
            
            if (!taskToMove) return;
    
            // Update local completed tasks state (remove from completedtasks)
            const updatedCompletedTasks = completedtasks.filter(task => task._id !== activeId);
            setCompletedTasks(updatedCompletedTasks);
    
            // Add the task back to tasks and update local state
            const updatedTasks = [...tasks, taskToMove];
            setTasks(updatedTasks);
    
            // Save to localStorage
            localStorage.setItem("taskes", JSON.stringify(updatedTasks));
            localStorage.setItem("completedTasks", JSON.stringify(updatedCompletedTasks));
    
            // Optionally, send this data to the backend
            await moveTaskToTasksBackend(taskToMove);
        }
    };
    
    const moveTaskToCompletedBackend = async (task) => {
        try {
            const { userId, _id: taskId } = task;  // Destructure to get both userId and taskId
    
            if (!userId || !taskId) {
                console.error("Missing userId or taskId");
                return;  // Stop execution if either is missing
            }
    
            const response = await fetch('http://localhost:5000/api/todoapp/MoveToCompleted', {
                method: 'PUT',
                headers: {
                    
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, taskId }),  // Send both userId and taskId
            });
    
            const data = await response.json();
            console.log(data);  // Log the response from the backend
    
            if (response.ok) {
                console.log("Task moved to completed successfully.");
            } else {
                console.error("Failed to move task to completed:", data.message);
            }
        } catch (error) {
            console.error("Error moving task to completed:", error);
        }
    };
    
    
    const moveTaskToTasksBackend = async (task) => {
        try {
            const { userId, _id: taskId } = task;  // Destructure to get both userId and taskId
    
            if (!userId || !taskId) {
                console.error("Missing userId or taskId");
                return;  // Stop execution if either is missing
            }
    
            const response = await fetch('http://localhost:5000/api/todoapp/MoveToTasks', {
                method: 'PUT',
                headers: {
                    
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, taskId }),  // Send both userId and taskId
            });
    
            const data = await response.json();
            console.log(data);  // Log the response from the backend
    
            if (response.ok) {
                console.log("Task moved to completed successfully.");
            } else {
                console.error("Failed to move task to completed:", data.message);
            }
        } catch (error) {
            console.error("Error moving task to completed:", error);
        }
    };
    
    

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    console.log(tasks)
    console.log(completedtasks)

    return (
        <>
        <div className="task-app">
            <div className="task-container">
                <header>
                    <h1>My Task</h1><br />
                    <p>Add, complete, remove and remind yourself of the task/assignments at hand!</p>

                </header>

               <DndContext 
               sensors={sensors}
               onDragEnd={handleDragEnd}
               collisionDetection={closestCorners}>
               <div className="task-form-container">
  <form onSubmit={handleSubmit}>
    <div className="task-input">
      <input
        type="text"
        placeholder="Enter a task"
        className="input"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      
    </div>
    <button className="task-button">Add Task</button>
   
  </form>
    <div className="clear-task-button">
                <button 
                className="clear"
  onClick={deleteAllTask}
>
  Clear All Tasks
</button>


                </div>
  <div className="task-error">
      {error && <p>{error}</p>}
      </div>
</div>

<div className="tasks">

<Column tasks={tasks} deleteTask={deleteTask} />
                <ColumnComplete tasks={completedtasks}/>
                </div>
              
               </DndContext>
            </div>
        </div>
        </>
    )
}