// Проверка авторизации
if (!sessionStorage.getItem('adminAuth')) {
    window.location.href = 'login.html';
}

// Глобальные переменные
let galleryData = [];
let currentEditId = null;

// Загрузка данных при старте
document.addEventListener('DOMContentLoaded', function() {
    loadGalleryData();
    setupEventListeners();
    updateStats();
});

// Загрузка данных галереи
function loadGalleryData() {
    // В реальном проекте здесь будет fetch к API
    // Сейчас используем localStorage для демо
    
    const saved = localStorage.getItem('galleryData');
    if (saved) {
        galleryData = JSON.parse(saved);
    } else {
        // Начальные данные
        galleryData = [
            {
                id: 1,
                title: 'Наш зал',
                category: 'hall',
                description: 'Интерьер зала',
                image: 'images/dojo-interior.jpg'
            },
            {
                id: 2,
                title: 'Групповая тренировка',
                category: 'training',
                description: 'Тренировка взрослой группы',
                image: 'images/group-training.jpg'
            },
            {
                id: 3,
                title: 'Спарринг',
                category: 'training',
                description: 'Спарринг на тренировке',
                image: 'images/sparring.jpg'
            },
            {
                id: 4,
                title: 'Команда клуба',
                category: 'team',
                description: 'Наша команда',
                image: 'images/team-photo.jpg'
            },
            {
                id: 5,
                title: 'Детская группа',
                category: 'kids',
                description: 'Занятия с детьми',
                image: 'images/kids-training.jpg'
            },
            {
                id: 6,
                title: 'Соревнования',
                category: 'competition',
                description: 'Участие в соревнованиях',
                image: 'images/gallery-01.jpg'
            }
        ];
        saveGalleryData();
    }
    
    renderGalleryGrid();
}

// Сохранение данных
function saveGalleryData() {
    localStorage.setItem('galleryData', JSON.stringify(galleryData));
    updateStats();
}

// Отрисовка сетки галереи
function renderGalleryGrid() {
    const grid = document.getElementById('adminGalleryGrid');
    if (!grid) return;
    
    if (galleryData.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; background: white; border-radius: 16px;">
                <p style="color: #999; margin-bottom: 20px;">В галерее пока нет фото</p>
                <button class="admin__btn admin__btn--primary" onclick="document.getElementById('openAddPhotoModal').click()">
                    Добавить первое фото
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    galleryData.forEach(photo => {
        html += `
            <div class="admin__gallery-item" data-id="${photo.id}">
                <img src="${photo.image}" alt="${photo.title}" class="admin__gallery-img">
                <div class="admin__gallery-info">
                    <div class="admin__gallery-title">${photo.title}</div>
                    <div class="admin__gallery-category">${getCategoryName(photo.category)}</div>
                </div>
                <div class="admin__gallery-actions">
                    <button class="admin__gallery-edit" onclick="editPhoto(${photo.id})">✏️ Изменить</button>
                    <button class="admin__gallery-delete" onclick="deletePhoto(${photo.id})">🗑️ Удалить</button>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'training': 'Тренировки',
        'hall': 'Зал',
        'team': 'Команда',
        'kids': 'Детская группа',
        'competition': 'Соревнования'
    };
    return categories[category] || category;
}

// Обновление статистики
function updateStats() {
    const photoCount = document.getElementById('photoCount');
    const lastAdded = document.getElementById('lastAdded');
    
    if (photoCount) {
        photoCount.textContent = galleryData.length;
    }
    
    if (lastAdded && galleryData.length > 0) {
        const last = galleryData[galleryData.length - 1];
        lastAdded.textContent = last.title;
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Переключение вкладок
    document.querySelectorAll('.admin__nav-link[data-tab]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabId = this.dataset.tab;
            
            // Убираем активный класс у всех
            document.querySelectorAll('.admin__nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.admin__tab').forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущим
            this.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });
    
    // Модальное окно добавления фото
    const openBtn = document.getElementById('openAddPhotoModal');
    const modal = document.getElementById('addPhotoModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelModal');
    
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    // Закрытие по клику вне модалки
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('admin__modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Предпросмотр изображения
    const photoFile = document.getElementById('photoFile');
    if (photoFile) {
        photoFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('imagePreview');
                    preview.src = e.target.result;
                    document.getElementById('previewContainer').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Отправка формы добавления
    const addForm = document.getElementById('addPhotoForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('photoTitle').value;
            const category = document.getElementById('photoCategory').value;
            const description = document.getElementById('photoDescription').value;
            const file = document.getElementById('photoFile').files[0];
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Создаём новое фото
                    const newPhoto = {
                        id: Date.now(),
                        title: title,
                        category: category,
                        description: description,
                        image: e.target.result
                    };
                    
                    galleryData.push(newPhoto);
                    saveGalleryData();
                    renderGalleryGrid();
                    
                    // Очищаем и закрываем модалку
                    addForm.reset();
                    document.getElementById('previewContainer').style.display = 'none';
                    document.getElementById('addPhotoModal').classList.remove('active');
                    
                    // Показываем сообщение
                    alert('Фото успешно добавлено!');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Выход
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('adminAuth');
            sessionStorage.removeItem('adminUser');
            window.location.href = 'login.html';
        });
    }
}

// Редактирование фото
window.editPhoto = function(id) {
    const photo = galleryData.find(p => p.id === id);
    if (!photo) return;
    
    currentEditId = id;
    
    document.getElementById('editPhotoId').value = photo.id;
    document.getElementById('editPhotoTitle').value = photo.title;
    document.getElementById('editPhotoCategory').value = photo.category;
    document.getElementById('editPhotoDescription').value = photo.description || '';
    document.getElementById('editPhotoPreview').src = photo.image;
    
    document.getElementById('editPhotoModal').classList.add('active');
    
    // Настройка формы редактирования
    const editForm = document.getElementById('editPhotoForm');
    editForm.onsubmit = function(e) {
        e.preventDefault();
        
        photo.title = document.getElementById('editPhotoTitle').value;
        photo.category = document.getElementById('editPhotoCategory').value;
        photo.description = document.getElementById('editPhotoDescription').value;
        
        saveGalleryData();
        renderGalleryGrid();
        
        document.getElementById('editPhotoModal').classList.remove('active');
        alert('Фото обновлено!');
    };
};

// Удаление фото
window.deletePhoto = function(id) {
    if (confirm('Вы уверены, что хотите удалить это фото?')) {
        galleryData = galleryData.filter(p => p.id !== id);
        saveGalleryData();
        renderGalleryGrid();
    }
};

// Закрытие модалки редактирования
document.getElementById('closeEditModal')?.addEventListener('click', function() {
    document.getElementById('editPhotoModal').classList.remove('active');
});

document.getElementById('cancelEditModal')?.addEventListener('click', function() {
    document.getElementById('editPhotoModal').classList.remove('active');
});