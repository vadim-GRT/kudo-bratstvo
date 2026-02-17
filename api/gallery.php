<?php
// api/gallery.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dataFile = __DIR__ . '/../data/gallery.json';

if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    if (!empty($content)) {
        $photos = json_decode($content, true);
        // Разворачиваем массив - новые фото первыми
        $photos = array_reverse($photos);
        echo json_encode($photos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        // Если файл пустой, возвращаем дефолтные фото (уже перевёрнутые)
        $defaultPhotos = [
            [
                'id' => 6,
                'title' => 'Соревнования',
                'category' => 'competition',
                'image' => 'images/gallery-01.jpg'
            ],
            [
                'id' => 5,
                'title' => 'Детская группа',
                'category' => 'kids',
                'image' => 'images/kids-training.jpg'
            ],
            [
                'id' => 4,
                'title' => 'Команда клуба',
                'category' => 'team',
                'image' => 'images/team-photo.jpg'
            ],
            [
                'id' => 3,
                'title' => 'Спарринг',
                'category' => 'training',
                'image' => 'images/sparring.jpg'
            ],
            [
                'id' => 2,
                'title' => 'Групповая тренировка',
                'category' => 'training',
                'image' => 'images/group-training.jpg'
            ],
            [
                'id' => 1,
                'title' => 'Наш зал',
                'category' => 'hall',
                'image' => 'images/dojo-interior.jpg'
            ]
        ];
        echo json_encode($defaultPhotos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
} else {
    // Если файла нет, создаём с дефолтными фото (перевёрнутыми)
    $defaultPhotos = [
        [
            'id' => 6,
            'title' => 'Соревнования',
            'category' => 'competition',
            'image' => 'images/gallery-01.jpg'
        ],
        [
            'id' => 5,
            'title' => 'Детская группа',
            'category' => 'kids',
            'image' => 'images/kids-training.jpg'
        ],
        [
            'id' => 4,
            'title' => 'Команда клуба',
            'category' => 'team',
            'image' => 'images/team-photo.jpg'
        ],
        [
            'id' => 3,
            'title' => 'Спарринг',
            'category' => 'training',
            'image' => 'images/sparring.jpg'
        ],
        [
            'id' => 2,
            'title' => 'Групповая тренировка',
            'category' => 'training',
            'image' => 'images/group-training.jpg'
        ],
        [
            'id' => 1,
            'title' => 'Наш зал',
            'category' => 'hall',
            'image' => 'images/dojo-interior.jpg'
        ]
    ];
    file_put_contents($dataFile, json_encode(array_reverse($defaultPhotos), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode($defaultPhotos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>