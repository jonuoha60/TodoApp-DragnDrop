import React from "react";
import "./css/Types.css"

import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export const TypesCompleted = ({id, title, deleteTask}) => {
   const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})

   const style = {
    transition,
    transform: CSS.Transform.toString(transform), 
   }
    return <div ref={setNodeRef} {...attributes}
     {...listeners}
     style={style}
     className="task-top-completed">
        
        {title}
        <p>Completed</p>
        </div>
}