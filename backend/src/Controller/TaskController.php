<?php

namespace App\Controller;

use App\Model\TaskModel;

class TaskController
{
    private $taskModel;

    public function __construct()
    {
        $this->taskModel = new TaskModel();
    }

    // Exibir todas as tarefas (HTML)
    public function index()
    {
        $tasks = $this->taskModel->getAllTasks();
        include __DIR__ . '/../View/task/index.php';
    }

    // Exibir formulário de criação de tarefa (HTML)
    public function create()
    {
        include __DIR__ . '/../View/task/create.php';
    }

    // Criar nova tarefa (HTML)
    public function store()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $taskName = $_POST['task_name'];
            $description = $_POST['description'];

            if ($this->taskModel->createTask($taskName, $description)) {
                header('Location: /tasks');
            } else {
                echo "Erro ao criar a tarefa.";
            }
        }
    }

    // Método para retornar as tarefas em formato JSON
    public function getTasksAsJson()
    {
        $tasks = $this->taskModel->getAllTasks();
        header('Content-Type: application/json');
        echo json_encode($tasks);
    }

    // Atualizar o status da tarefa
    public function updateTaskStatus($taskId, $status) {
    
        if (empty($taskId) || empty($status)) {
            echo json_encode(['status' => 'error', 'message' => 'ID e status são obrigatórios!']);
            return;
        }
    
        $response = $this->taskModel->updateStatus($taskId, $status);
        echo $response;
    }
    
}
