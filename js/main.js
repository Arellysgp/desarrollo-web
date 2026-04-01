/* ============================================
   JAVASCRIPT COMPARTIDO - Funcionalidad común
   ============================================ */

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
});

// Header scroll effect - añade clase 'scrolled' al hacer scroll
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (header) {
        // Cambia a 50px para que se active más rápido
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Active nav item on scroll (solo para página index con secciones)
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');

if (sections.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });
}

// Newsletter form submission (para index)
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('.newsletter-input');
        
        if (emailInput && emailInput.value) {
            alert('¡Gracias por suscribirte! Pronto recibirás nuestras ofertas exclusivas.');
            this.reset();
        }
    });
}

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Solo aplicar smooth scroll si es un hash válido (no solo "#")
        if (href && href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Función helper para mostrar mensajes temporales
function mostrarMensajeTemporal(mensaje, duracion = 2000) {
    // Puedes personalizar esto para mostrar un toast o notificación
    alert(mensaje);
}

// Export para uso en otros archivos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mostrarMensajeTemporal
    };
}


// Carrusel 3D del Equipo
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('#teamCarousel3D .carousel-3d');
    const prevBtn = document.getElementById('prevBtn3D');
    const nextBtn = document.getElementById('nextBtn3D');
    const indicatorsContainer = document.getElementById('carouselIndicators3D');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const items = carousel.querySelectorAll('.carousel-item-3d');
    const totalItems = items.length;
    let currentRotation = 0;
    let currentIndex = 0;
    const anglePerItem = 360 / totalItems;
    
    // Auto-rotation
    let autoRotate = true;
    let autoRotateInterval;
    
    // Crear indicadores usando Bootstrap
    function createIndicators() {
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('button');
            dot.classList.add('indicator-dot-3d');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('type', 'button');
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', `Ir al miembro ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(dot);
        }
    }
    
    // Actualizar indicadores
    function updateIndicators() {
        const dots = indicatorsContainer.querySelectorAll('.indicator-dot-3d');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Actualizar posiciones de los items
    function updateItemPositions() {
        items.forEach((item, index) => {
            const position = (index - currentIndex + totalItems) % totalItems;
            item.setAttribute('data-index', position);
        });
    }
    
    // Rotar el carrusel
    function rotateCarousel() {
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        updateItemPositions();
        updateIndicators();
    }
    
    // Siguiente slide
    function nextSlide() {
        currentRotation -= anglePerItem;
        currentIndex = (currentIndex + 1) % totalItems;
        rotateCarousel();
        resetAutoRotate();
    }
    
    // Slide anterior
    function prevSlide() {
        currentRotation += anglePerItem;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        rotateCarousel();
        resetAutoRotate();
    }
    
    // Ir a un slide específico
    function goToSlide(index) {
        const diff = index - currentIndex;
        currentRotation -= diff * anglePerItem;
        currentIndex = index;
        rotateCarousel();
        resetAutoRotate();
    }
    
    // Iniciar rotación automática
    function startAutoRotate() {
        if (autoRotate) {
            autoRotateInterval = setInterval(() => {
                nextSlide();
            }, 4000); // Cambiar cada 4 segundos
        }
    }
    
    // Reiniciar rotación automática
    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }
    
    // Detener rotación automática
    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    // Event Listeners con Bootstrap
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Pausar auto-rotate al hacer hover
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);
    
    // Soporte para gestos táctiles
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoRotate();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoRotate();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - siguiente
            nextSlide();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - anterior
            prevSlide();
        }
    }
    
    // Navegación con teclado (accesibilidad)
    document.addEventListener('keydown', (e) => {
        // Solo activar si el carrusel está en viewport
        const carouselRect = carousel.getBoundingClientRect();
        const isInViewport = carouselRect.top < window.innerHeight && carouselRect.bottom > 0;
        
        if (isInViewport) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
    
    // Pausar cuando la página no está visible (ahorro de recursos)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoRotate();
        } else {
            startAutoRotate();
        }
    });
    
    // Inicializar
    createIndicators();
    updateItemPositions();
    startAutoRotate();
    
    // Ajustar al redimensionar ventana
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateItemPositions();
        }, 250);
    });
});