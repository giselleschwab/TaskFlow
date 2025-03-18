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

    // Método para atualizar o status da tarefa
    public function updateStatus($taskId, $status) {
        // Lista de valores permitidos no ENUM
        $validStatuses = ['pendente', 'em andamento', 'concluída'];

        // Verifica se o status é válido
        if (!in_array($status, $validStatuses, true)) {
            error_log("Status inválido recebido: " . $status);
            return json_encode(['status' => 'error', 'message' => 'Status inválido!']);
        }

        // Converte para UTF-8 para evitar problemas de codificação
        $status = mb_convert_encoding($status, 'UTF-8', 'auto');

        // Query SQL
        $query = "UPDATE tasks SET status = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            error_log("Erro ao preparar query: " . $this->db->error);
            return json_encode(['status' => 'error', 'message' => 'Erro ao preparar a consulta!']);
        }

        $stmt->bind_param('si', $status, $taskId);

        if (!$stmt->execute()) {
            error_log("Erro ao executar query: " . $stmt->error);
            return json_encode(['status' => 'error', 'message' => 'Erro ao atualizar o status!']);
        }

        return json_encode(['status' => 'success', 'message' => 'Status atualizado com sucesso!']);
    }
}
