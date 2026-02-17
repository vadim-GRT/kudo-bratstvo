// Анимация и интерактивность
document.addEventListener('DOMContentLoaded', function() {
    // Элементы
    const sections = document.querySelectorAll('.section');
    const header = document.querySelector('.header');
    const galleryItems = document.querySelectorAll('.gallery__item');
    const form = document.getElementById('signupForm');
    const successMessage = document.getElementById('formSuccess');
    
    // Элементы галереи-слайдера
    const gallerySlider = document.getElementById('gallerySlider');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');

    // Хедер с эффектом скролла
    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Проверка видимости элемента
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Анимация секций
    function handleScrollAnimation() {
        sections.forEach(section => {
            if (isElementInViewport(section)) {
                section.classList.add('visible');
            }
        });
    }

    // Инициализация
    handleHeaderScroll();
    handleScrollAnimation();

    // Слушатели событий
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            handleHeaderScroll();
            handleScrollAnimation();
        });
    });

    // Управление галереей (горизонтальная прокрутка)
    if (gallerySlider && galleryPrev && galleryNext) {
        const scrollAmount = 400; // Сколько пикселей прокручиваем за раз
        
        galleryPrev.addEventListener('click', () => {
            gallerySlider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        galleryNext.addEventListener('click', () => {
            gallerySlider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Проверка кнопок (достигнут ли край)
        function checkGalleryButtons() {
            if (gallerySlider.scrollLeft <= 0) {
                galleryPrev.disabled = true;
            } else {
                galleryPrev.disabled = false;
            }
            
            if (gallerySlider.scrollLeft + gallerySlider.clientWidth >= gallerySlider.scrollWidth - 10) {
                galleryNext.disabled = true;
            } else {
                galleryNext.disabled = false;
            }
        }
        
        gallerySlider.addEventListener('scroll', checkGalleryButtons);
        window.addEventListener('resize', checkGalleryButtons);
        checkGalleryButtons();
    }

    // Форма Formspree
    if (form) {
        form.addEventListener('submit', function(e) {
            // Не отменяем отправку - Formspree работает стандартно
            // Но показываем сообщение после отправки
            setTimeout(() => {
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                    form.reset();
                    
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                    }, 5000);
                }
            }, 1000);
        });
    }

    // Плавный скролл к якорям
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Галерея Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
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
            
            // Анимация появления
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
            
            // Закрытие по Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && document.body.contains(modal)) {
                    modal.style.opacity = '0';
                    modalImg.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        if (document.body.contains(modal)) {
                            document.body.removeChild(modal);
                        }
                    }, 300);
                }
            }, { once: true });
        });
    });

    // Прелоадер (опционально)
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Сброс скролла при обновлении
    window.onbeforeunload = function() {
        window.scrollTo(0, 0);
    };
    // =================== //
    // Cookie уведомление
    // =================== //
    const cookieNotice = document.getElementById('cookieNotice');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');
    
    // Проверяем, показывали ли уже уведомление
    function checkCookieConsent() {
        const consent = localStorage.getItem('cookieConsent');
        
        if (consent === 'accepted' || consent === 'declined') {
            // Если уже ответили - скрываем уведомление
            if (cookieNotice) {
                cookieNotice.classList.add('hidden');
            }
        } else {
            // Показываем уведомление
            if (cookieNotice) {
                cookieNotice.classList.remove('hidden');
            }
        }
    }
    
    // Обработчик принятия cookie
    if (cookieAccept) {
        cookieAccept.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            
            // Здесь можно включить аналитику, если нужно
            // Например, загрузить Яндекс.Метрику или Google Analytics
            
            cookieNotice.classList.add('hidden');
        });
    }
    
    // Обработчик отклонения cookie
    if (cookieDecline) {
        cookieDecline.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            
            // Здесь можно отключить аналитику
            // Например, заблокировать загрузку счетчиков
            
            cookieNotice.classList.add('hidden');
        });
    }
    
    // Запускаем проверку
    checkCookieConsent();
});