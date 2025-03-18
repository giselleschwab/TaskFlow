<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Controller\TaskController;

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$controller = new TaskController();

// Definição das rotas básicas
switch ($requestUri) {
    case '/tasks':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Retorna as tarefas em formato JSON
            $controller->getTasksAsJson();
        } else {
            // Chama a função que exibe as tarefas no formato HTML
            $controller->index();
        }
        break;

    case '/tasks/create':
        $controller->create();
        break;

    case '/tasks/store':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->store();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Método não permitido!']);
        }
        break;

    case '/tasks/update-status':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);

            // Verificação dos parâmetros
            if (!isset($data['id'], $data['status'])) {
                echo json_encode(['status' => 'error', 'message' => 'Parâmetros inválidos!']);
                return;
            }

            // Chama o controlador para atualizar o status
            $controller->updateTaskStatus($data['id'], $data['status']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Método não permitido!']);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Página não encontrada!']);
        break;
}
