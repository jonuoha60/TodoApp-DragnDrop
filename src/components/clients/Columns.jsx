import React from "react";
import "./css/Column.css";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Types } from "./types";

export const Column = ({ tasks, deleteTask }) => {
    return (
        <>
            <div className="column-task-top">
                <h1 className="task-header">Task</h1>
                <p>Add a task Here</p>

                <div className="column-task">
                    <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
                        {tasks.map((task) => (
                            <div key={task._id}> {/* The key here is task._id */}
                                <Types
                                    id={task._id}
                                    title={task.content}
                                    deleteTask={() => {
                                        deleteTask(task._id);
                                    }}
                                />
                            </div>
                        ))}
                    </SortableContext>
                </div>
            </div>
        </>
    );
};
