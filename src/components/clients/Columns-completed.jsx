import React from "react";
import "./css/Column.css"
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable"
import { TypesCompleted } from "./Types-completed";

export const ColumnComplete = ({ tasks }) => {
    return (
        <>
        <div className="column-task-top">
        <h1 className="task-header">Completed</h1>
        <p>Drag Here if Completed</p>

    <div className="column-completed">
    <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
    {tasks.map((task)=> (
        <TypesCompleted id={task._id} title={task.content} key={task._id}/>
))}
</SortableContext>
</div>
</div>
</>
    )
}