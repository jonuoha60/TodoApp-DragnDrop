import React from "react";
import "./css/Types.css"

import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export const Types = ({id, title, deleteTask}) => {
   const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})

   const style = {
    transition,
    transform: CSS.Transform.toString(transform), 
   }
    return(
    <div style={style}
    className="task-buttondel">
    <div ref={setNodeRef} {...attributes}
     {...listeners}
     
     className="task-top">
       
        {title}
       
        </div>
        <div
         className="delete-task-button">
 <button onClick={deleteTask}>X</button> 
            </div>
            </div>
    )
}