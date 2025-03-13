<?php
namespace App\Model;

class TaskModel
{
    private $db;

    public function __construct()
    {
        $this->db = \App\Database\Database::getInstance()->getConnection();
    }

    // Método para pegar todas as tarefas
    public function getAllTasks()
    {
        $sql = "SELECT * FROM tasks";
        $result = $this->db->query($sql);

        if ($result) {
            return $result->fetch_all(MYSQLI_ASSOC);
        }
        return [];
    }

    // Método para criar uma nova tarefa
    public function createTask($taskName, $description)
    {
        $sql = "INSERT INTO tasks (task_name, description) VALUES (?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("ss", $taskName, $description);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
