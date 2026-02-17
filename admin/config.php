<?php
// config.php
define('ADMIN_USER', 'admin');
define('ADMIN_PASS', 'bratstvo2026'); // Смените на свой пароль!
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('DATA_FILE', __DIR__ . '/../data/gallery.json');

// Создаём папки, если их нет
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}
if (!file_exists(dirname(DATA_FILE))) {
    mkdir(dirname(DATA_FILE), 0777, true);
}

session_start();
?>