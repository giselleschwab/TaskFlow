import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { DndContext, useDroppable, useDraggable, DragEndEvent } from '@dnd-kit/core';
import { FaRegClock, FaEllipsisH } from 'react-icons/fa';

interface Task {
  id: number;
  task_name: string;
  description: string;
  status: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    axios.get("http://localhost/tasks")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setTasks([]);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the tasks!", error);
      });
  }, []);

  const groupedTasks = useMemo(() => {
    return {
      pendente: tasks.filter(task => task.status === 'pendente'),
      "em andamento": tasks.filter(task => task.status === 'em andamento'),
      concluída: tasks.filter(task => task.status === 'concluída'),
    };
  }, [tasks]);


  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !["pendente", "em andamento", "concluída"].includes(String(over.id))) return;

    const taskId = Number(active.id);

    const updatedTasks = tasks.map((task) => {
      if (Number(task.id) === taskId) {
        return { ...task, status: String(over.id) };
      }
      return task;
    });

    setTasks(updatedTasks);

    axios.post("http://localhost/tasks/update-status", {
      id: taskId,
      status: over.id
    })
      .then((response) => {
        console.log("✅ Status atualizado com sucesso!", response.data);
      })
      .catch((error) => {
        console.error("❌ Erro ao atualizar status:", error);
      });
  };


  return (
    <>
      <div className="flex justify-center items-centerbg-dark-gray pt-12">
        <div className="w-full max-w-7xl px-4">
          <div className="flex justify-between items-center border-b border-gray-400 mb-4">
            <div>
              <h1 className="text-white text-xl">Minhas Tarefas</h1>
              <h2 className="text-white mb-4">Aqui vou colocar uma legenda</h2>
            </div>
          </div>
        </div>

      </div>

      <DndContext onDragEnd={onDragEnd}>
        <div className="bg-[#171616] mx-14 rounded-md ">
          <div className="flex justify-items-center gap-4 px-4 pt-4">
            <Column id="pendente" title="Pendentes" tasks={groupedTasks.pendente} />
            <Column id="em andamento" title="Em Progresso" tasks={groupedTasks["em andamento"]} />
            <Column id="concluída" title="Concluídas" tasks={groupedTasks.concluída} />

          </div>
        </div>

      </DndContext>
    </>

  );
};

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({ id }); // Garante que a coluna é "droppable"

  return (
    <div className="w-1/3 bg-[#2E2E2E] p-4 mb-4 rounded" ref={setNodeRef}>
      <h3 className="text-white text-lg border-b border-[#69B9B6]">{title}</h3>
      <ul className="text-white">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} /> // Passa as tarefas para cada TaskCard
        ))}
      </ul>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: String(task.id),
  });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
  
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
  
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const draggingStyle = {
    cursor: 'grabbing',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.1s ease-out',
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="mb-2 bg-[#020202]/80 p-4 rounded-md cursor-pointer mt-3"
      style={isDragging ? draggingStyle : {}}
    >

      <div className="relative">
        <div className="flex justify-between items-center">
          <h4 className="text-[#C1C1C1] text-lg">{task.task_name}</h4>
          <FaEllipsisH
            className="text-[#C1C1C1] cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>

        {isOpen && (
          <div ref={dropdownRef} className="absolute right-0 w-40 bg-[#2E2E2E] rounded-md shadow-lg z-50">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-[#383838] cursor-pointer" onClick={() => console.log("Editar")}>
                Editar
              </li>
              <li className="px-4 py-2 hover:bg-[#383838] cursor-pointer" onClick={() => console.log("Excluir")}>
                Excluir
              </li>
            </ul>
          </div>
        )}
      </div>


      <p className="text-[#C1C1C1] pt-4">{task.description}</p>

      <div className="pt-4 mt-6 mb-2">
        <span className="text-sm text-gray-400 font-semibold bg-[#2C2C2C] p-3 pr-4 rounded-full">
          <FaRegClock className="inline-block font-bo text-[#C1C1C1] mr-2 mb-0.5" />
          19/04/2025</span>
      </div>

    </li>
  );
};

export default TaskList;
