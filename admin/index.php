<?php
require_once 'config.php';

// Проверка авторизации
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    header('Location: login.php');
    exit;
}

// Загрузка данных галереи
$gallery = [];
if (file_exists(DATA_FILE)) {
    $gallery = json_decode(file_get_contents(DATA_FILE), true) ?: [];
}

// Обработка загрузки фото
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['photo'])) {
    $title = $_POST['title'] ?? 'Без названия';
    $category = $_POST['category'] ?? 'training';
    $description = $_POST['description'] ?? '';
    
    $file = $_FILES['photo'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = time() . '_' . uniqid() . '.' . $ext;
    $uploadPath = UPLOAD_DIR . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        $gallery[] = [
            'id' => time(),
            'title' => $title,
            'category' => $category,
            'description' => $description,
            'image' => 'uploads/' . $filename
        ];
        
        file_put_contents(DATA_FILE, json_encode($gallery, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
    
    header('Location: index.php');
    exit;
}

// Обработка удаления
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $newGallery = [];
    foreach ($gallery as $item) {
        if ($item['id'] == $id) {
            // Удаляем файл
            $filePath = __DIR__ . '/../' . $item['image'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        } else {
            $newGallery[] = $item;
        }
    }
    
    file_put_contents(DATA_FILE, json_encode($newGallery, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель — Кудо «Братство»</title>
    <!-- ПРАВИЛЬНЫЕ пути к CSS -->
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="icon" href="../images/logo-bratstvo.png" type="image/png">
</head>
<body>
    <div class="admin">
        <!-- Боковое меню -->
        <aside class="admin__sidebar">
            <div class="admin__logo">
                <img src="../images/logo-bratstvo.png" alt="Логотип">
                <span>Братство</span>
            </div>
            
            <nav class="admin__nav">
                <a href="index.php" class="admin__nav-link active">
                    <span>📸</span> Галерея
                </a>
                <a href="../index.html" class="admin__nav-link" target="_blank">
                    <span>🏠</span> На сайт
                </a>
                <a href="logout.php" class="admin__nav-link">
                    <span>🚪</span> Выйти
                </a>
            </nav>
            
            <div class="admin__user">
                <div class="admin__user-name">Администратор</div>
                <div class="admin__user-role">Гузенко Алексей</div>
            </div>
        </aside>
        
        <!-- Основной контент -->
        <main class="admin__main">
            <div class="admin__header">
                <h1 class="admin__title">Управление галереей</h1>
                <button class="admin__btn admin__btn--primary" onclick="showUploadForm()">
                    + Добавить фото
                </button>
            </div>
            
            <!-- Статистика -->
            <div class="admin__stats">
                <div class="admin__stat-card">
                    <div class="admin__stat-number"><?= count($gallery) ?></div>
                    <div class="admin__stat-label">Всего фото</div>
                </div>
                <div class="admin__stat-card">
                    <div class="admin__stat-number">
                        <?= count($gallery) > 0 ? date('d.m.Y', $gallery[count($gallery)-1]['id']) : '-' ?>
                    </div>
                    <div class="admin__stat-label">Последнее добавление</div>
                </div>
            </div>
            
            <!-- Форма загрузки (скрыта по умолчанию) -->
            <div id="uploadForm" style="display: none; margin-bottom: 30px;">
                <div class="admin__settings-group">
                    <h3>Загрузить новое фото</h3>
                    <form method="POST" enctype="multipart/form-data">
                        <div class="admin__form-group">
                            <label>Название фото</label>
                            <input type="text" name="title" placeholder="Например: Тренировка детей" required>
                        </div>
                        
                        <div class="admin__form-group">
                            <label>Категория</label>
                            <select name="category">
                                <option value="training">Тренировки</option>
                                <option value="hall">Зал</option>
                                <option value="team">Команда</option>
                                <option value="kids">Детская группа</option>
                                <option value="competition">Соревнования</option>
                            </select>
                        </div>
                        
                        <div class="admin__form-group">
                            <label>Выберите файл</label>
                            <input type="file" name="photo" accept="image/*" required>
                            <div class="admin__form-hint">Рекомендуемый размер: 1200x800px</div>
                        </div>
                        
                        <div class="admin__form-group">
                            <label>Описание (необязательно)</label>
                            <textarea name="description" rows="2" placeholder="Краткое описание"></textarea>
                        </div>
                        
                        <button type="submit" class="admin__btn admin__btn--primary">Загрузить</button>
                        <button type="button" class="admin__btn admin__btn--secondary" onclick="hideUploadForm()">Отмена</button>
                    </form>
                </div>
            </div>
            
            <!-- Сетка галереи -->
            <?php if (empty($gallery)): ?>
                <div style="text-align: center; padding: 50px; background: white; border-radius: 16px;">
                    <p style="color: #999; margin-bottom: 20px;">В галерее пока нет фото</p>
                    <button class="admin__btn admin__btn--primary" onclick="showUploadForm()">
                        Добавить первое фото
                    </button>
                </div>
            <?php else: ?>
                <div class="admin__gallery-grid">
                    <?php foreach (array_reverse($gallery) as $photo): ?>
                        <div class="admin__gallery-item">
                            <img src="../<?= htmlspecialchars($photo['image']) ?>" 
                                 alt="<?= htmlspecialchars($photo['title']) ?>" 
                                 class="admin__gallery-img">
                            <div class="admin__gallery-info">
                                <div class="admin__gallery-title"><?= htmlspecialchars($photo['title']) ?></div>
                                <div class="admin__gallery-category">
                                    <?php
                                    $categories = [
                                        'training' => 'Тренировки',
                                        'hall' => 'Зал',
                                        'team' => 'Команда',
                                        'kids' => 'Детская группа',
                                        'competition' => 'Соревнования'
                                    ];
                                    echo $categories[$photo['category']] ?? $photo['category'];
                                    ?>
                                </div>
                            </div>
                            <div class="admin__gallery-actions">
                                <a href="?delete=<?= $photo['id'] ?>" 
                                   class="admin__gallery-delete" 
                                   onclick="return confirm('Вы уверены, что хотите удалить это фото?')">
                                    🗑️ Удалить
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </main>
    </div>
    
    <script>
        function showUploadForm() {
            document.getElementById('uploadForm').style.display = 'block';
            // Плавная прокрутка к форме
            document.getElementById('uploadForm').scrollIntoView({ behavior: 'smooth' });
        }
        
        function hideUploadForm() {
            document.getElementById('uploadForm').style.display = 'none';
        }
    </script>
</body>
</html>