<!-- src/View/task/index.php -->
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tarefas</title>
</head>
<body>
    <h1>Tarefas</h1>
    <a href="/tasks/create">Criar nova tarefa</a>
    <ul>
        <?php foreach ($tasks as $task): ?>
            <li><?php echo htmlspecialchars($task['task_name']); ?> - <?php echo htmlspecialchars($task['description']); ?></li>
        <?php endforeach; ?>
    </ul>
</body>
</html>
