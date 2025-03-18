import React, { useEffect, useState } from "react";
import axios from "axios";
import { DndContext, useDroppable, useDraggable, DragEndEvent } from '@dnd-kit/core';

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

  // Função para filtrar tarefas por status
  const filterTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !["pendente", "em andamento", "concluída"].includes(over.id)) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === Number(active.id)) {
        return { ...task, status: over.id };
      }
      return task;
    });

    setTasks(updatedTasks);

    // Enviar para o backend
    axios.post("http://localhost/tasks/update-status", {
      id: active.id,
      status: over.id
    })
      .then((response) => {
        console.log("Status atualizado com sucesso!", response.data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar status:", error);
      });

  };

  return (
    <div className="bg-dark-gray p-4">
      <h1 className="text-white text-xl">Minhas Tarefas</h1>
      <h2 className="text-white mb-4">Aqui vou colocar uma legenda</h2>

      <DndContext onDragEnd={onDragEnd}>
        <div className="flex gap-8">
          {/* Coluna de Pendentes */}
          <Column id="pendente" title="Pendentes" tasks={filterTasksByStatus('pendente')} />

          <Column id="em andamento" title="Em Progresso" tasks={filterTasksByStatus('em andamento')} />

          <Column id="concluída" title="Concluídas" tasks={filterTasksByStatus('concluída')} />
        </div>
      </DndContext>
    </div>
  );
};

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="w-1/3" ref={setNodeRef}>
      <h3 className="text-white text-lg">{title}</h3>
      <ul className="text-white">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useDraggable({
    id: String(task.id),
  });

  // Efeito visual de "grudar" o card ao cursor na hora de arrastar
  const draggingStyle = {
    cursor: 'grabbing',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    transition: transition || 'transform 0.1s ease-out',
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="mb-2 bg-gray-800 p-4 rounded-md cursor-pointer"
      style={isDragging ? draggingStyle : {}}
    >
      <h4>{task.task_name}</h4>
      <p>{task.description}</p>
      <span className="text-sm text-gray-400">{task.status}</span>
    </li>
  );
};

export default TaskList;
