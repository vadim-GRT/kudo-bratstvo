// Загрузка галереи с сервера
document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
});

function loadGallery() {
    const galleryTrack = document.querySelector('.gallery__track');
    if (!galleryTrack) return;
    
    // Показываем загрузку
    galleryTrack.innerHTML = '<div style="text-align: center; padding: 50px; color: white;">Загрузка галереи...</div>';
    
    fetch('api/gallery.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки');
            }
            return response.json();
        })
        .then(photos => {
            renderGallery(photos);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            // В случае ошибки показываем заглушку
            galleryTrack.innerHTML = '<div style="text-align: center; padding: 50px; color: white;">Ошибка загрузки галереи</div>';
        });
}

function renderGallery(photos) {
    const galleryTrack = document.querySelector('.gallery__track');
    if (!galleryTrack) return;
    
    // Очищаем трек
    galleryTrack.innerHTML = '';
    
    if (!photos || photos.length === 0) {
        galleryTrack.innerHTML = '<div style="text-align: center; padding: 50px; color: white;">Галерея пуста</div>';
        return;
    }
    
    // Добавляем фото
    photos.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'gallery__item';
        item.innerHTML = `
            <img src="${photo.image}" alt="${photo.title || 'Фото'}" class="gallery__img">
            <div class="gallery__overlay">
                <span>${photo.title || 'Без названия'}</span>
            </div>
        `;
        galleryTrack.appendChild(item);
    });
    
    // Инициализируем lightbox для новых фото
    initGalleryLightbox();
    
    // Обновляем кнопки навигации галереи
    updateGalleryNav();
}

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery__item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Не открываем lightbox при клике на overlay (чтобы не мешать)
            if (e.target.classList.contains('gallery__overlay') || 
                e.target.parentElement?.classList.contains('gallery__overlay')) {
                return;
            }
            
            const img = this.querySelector('img');
            const alt = img.getAttribute('alt');
            
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            modal.style.zIndex = '2000';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.cursor = 'pointer';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            
            const modalImg = document.createElement('img');
            modalImg.src = img.src;
            modalImg.alt = alt;
            modalImg.style.maxWidth = '90%';
            modalImg.style.maxHeight = '90%';
            modalImg.style.objectFit = 'contain';
            modalImg.style.border = '3px solid white';
            modalImg.style.borderRadius = '8px';
            modalImg.style.transform = 'scale(0.9)';
            modalImg.style.transition = 'transform 0.3s ease';
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            setTimeout(() => {
                modal.style.opacity = '1';
                modalImg.style.transform = 'scale(1)';
            }, 10);
            
            modal.addEventListener('click', function() {
                modal.style.opacity = '0';
                modalImg.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            });
        });
    });
}

function updateGalleryNav() {
    const slider = document.getElementById('gallerySlider');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    
    if (slider && prevBtn && nextBtn) {
        const checkButtons = () => {
            prevBtn.disabled = slider.scrollLeft <= 0;
            nextBtn.disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;
        };
        
        slider.addEventListener('scroll', checkButtons);
        checkButtons();
    }
}