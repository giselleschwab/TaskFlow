<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Controller\TaskController;

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$controller = new TaskController();

// Definição das rotas básicas
switch ($requestUri) {
    case '/tasks':
        $controller->index();
        break;
    case '/tasks/create':
        $controller->create();
        break;
    case '/tasks/store':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->store();
        } else {
            echo "Método não permitido!";
        }
        break;
    default:
        http_response_code(404);
        echo "Página não encontrada!";
        break;
}
?>
