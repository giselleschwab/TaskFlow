<!-- src/View/task/create.php -->
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar Nova Tarefa</title>
</head>
<body>
    <h1>Criar Nova Tarefa</h1>
    <form action="/tasks/store" method="POST">
        <label for="task_name">Nome da Tarefa</label>
        <input type="text" name="task_name" id="task_name" required>
        
        <label for="description">Descrição</label>
        <textarea name="description" id="description" required></textarea>
        
        <button type="submit">Criar</button>
    </form>
</body>
</html>
