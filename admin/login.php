<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if ($username === ADMIN_USER && $password === ADMIN_PASS) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: index.php');
        exit;
    } else {
        $error = 'Неверный логин или пароль';
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Вход в админ-панель</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .login { /* те же стили, что были в login.html */ }
    </style>
</head>
<body>
    <div class="login">
        <div class="login__box">
            <h1>Вход в админ-панель</h1>
            <?php if (isset($error)): ?>
                <div class="login__error"><?= $error ?></div>
            <?php endif; ?>
            <form method="POST">
                <input type="text" name="username" placeholder="Логин" required>
                <input type="password" name="password" placeholder="Пароль" required>
                <button type="submit">Войти</button>
            </form>
        </div>
    </div>
</body>
</html>