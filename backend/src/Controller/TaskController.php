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

    // Exibir todas as tarefas
    public function index()
    {
        $tasks = $this->taskModel->getAllTasks();
        include __DIR__ . '/../View/task/index.php';
    }

    // Exibir formulário de criação de tarefa
    public function create()
    {
        include __DIR__ . '/../View/task/create.php';
    }

    // Criar nova tarefa
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
}
