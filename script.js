// Esperamos a que todo el documento HTML esté cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', function() {

    // ======================================================== //
    //          LÓGICA DEL SLIDESHOW DEL HERO BANNER            //
    // ======================================================== //
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlideIndex = 0;
        slides[currentSlideIndex].classList.add('active');
        function nextSlide() {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');
        }
        setInterval(nextSlide, 5000);
    }

    // ======================================================== //
    //          LÓGICA DEL MENÚ MÓVIL (HAMBURGUESA)             //
    // ======================================================== //
    const hamburger = document.getElementById('hamburger-button');
    const nav = document.querySelector('.main-nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            console.log("Menú móvil activado/desactivado.");
        });
    }

    // ======================================================== //
    //     LÓGICA DE LA SECCIÓN "NOSOTROS" (INTERACTIVA)        //
    // ======================================================== //
    const tabs = document.querySelectorAll('.tab-title');
    const descriptions = document.querySelectorAll('.description-text');
    const galleries = document.querySelectorAll('.image-cloud');
    const tabsTrack = document.querySelector('.tabs-track'); 
    
    if (tabs.length > 0 && tabsTrack) {
        let isAnimating = false;

        tabs.forEach(clickedTab => {
            clickedTab.addEventListener('click', () => {
                if (isAnimating || clickedTab.classList.contains('active')) return;
                isAnimating = true;

                const firstPositions = new Map();
                tabs.forEach(tab => firstPositions.set(tab, tab.getBoundingClientRect()));

                document.querySelector('.tab-title.active')?.classList.remove('active');
                clickedTab.classList.add('active');
                
                descriptions.forEach(desc => desc.classList.remove('active'));
                galleries.forEach(gallery => gallery.classList.remove('active'));
                
                const targetId = clickedTab.dataset.target;
                document.querySelector(`.description-text[data-id="${targetId}"]`)?.classList.add('active');
                document.getElementById(`gallery-${targetId}`)?.classList.add('active');
                
                tabsTrack.appendChild(clickedTab);

                const lastPositions = new Map();
                tabs.forEach(tab => lastPositions.set(tab, tab.getBoundingClientRect()));

                tabs.forEach(tab => {
                    const first = firstPositions.get(tab);
                    const last = lastPositions.get(tab);
                    const deltaX = first.left - last.left;
                    tab.style.transform = `translateX(${deltaX}px)`;
                    tab.style.transition = 'transform 0s';
                });

                requestAnimationFrame(() => {
                    tabs.forEach(tab => {
                        tab.style.transition = 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)';
                        tab.style.transform = 'none';
                    });
                });

                setTimeout(() => { isAnimating = false; }, 800);
            });
        });

        if (tabs[0] && !document.querySelector('.tab-title.active')) {
             tabs[0].click();
        }
    }
    
    // =================================================================== //
    //          LÓGICA DE LA SECCIÓN "GALERÍA" (CARRUSEL Y LIGHTBOX)       //
    // =================================================================== //
    const carouselTrack = document.getElementById('carousel-track');
    const nextBtn = document.getElementById('next-button');
    const prevBtn = document.getElementById('prev-button');

    if (carouselTrack && nextBtn && prevBtn) {
        const cards = Array.from(carouselTrack.children);
        if (cards.length > 0) {
            let cardWidth = 0;
            let currentIndex = 0;
            
            const updateButtonStates = () => {
                const visibleCards = window.innerWidth <= 768 ? 1 : 3;
                const maxIndex = cards.length > visibleCards ? cards.length - visibleCards : 0;
                
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= maxIndex;
            };

            const moveToCard = (targetIndex) => {
                carouselTrack.style.transform = `translateX(-${targetIndex * cardWidth}px)`;
                currentIndex = targetIndex;
                updateButtonStates();
            };

            const setupCarousel = () => {
                cardWidth = cards[0].getBoundingClientRect().width + 20;
                moveToCard(currentIndex);
            };

            nextBtn.addEventListener('click', () => {
                const visibleCards = window.innerWidth <= 768 ? 1 : 3;
                const maxIndex = cards.length - visibleCards;
                if (currentIndex < maxIndex) {
                    moveToCard(currentIndex + 1);
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    moveToCard(currentIndex - 1);
                }
            });

            window.addEventListener('resize', setupCarousel);
            setupCarousel();
        }
    }

    // Lógica del Lightbox para la Galería
    const lightboxContainer = document.getElementById('gallery-lightbox');
    const lightboxTriggers = document.querySelectorAll('.open-lightbox');
    if (lightboxContainer && lightboxTriggers.length > 0) {
        const lightboxImage = lightboxContainer.querySelector('.lightbox-image');
        const lightboxCloseBtn = lightboxContainer.querySelector('.lightbox-close');
        const lightboxPrevBtn = lightboxContainer.querySelector('.lightbox-nav.prev');
        const lightboxNextBtn = lightboxContainer.querySelector('.lightbox-nav.next');
        const lightboxTitle = lightboxContainer.querySelector('.lightbox-title');
        const lightboxCounter = lightboxContainer.querySelector('.lightbox-counter');
        const lightboxOverlay = lightboxContainer.querySelector('.lightbox-overlay');

        const galleryItems = Array.from(lightboxTriggers).map(trigger => {
            const card = trigger.closest('.project-card');
            return {
                src: card.querySelector('.card-image-container img').src,
                title: card.querySelector('.project-title').textContent,
            };
        });

        let currentImageIndex;

        const updateLightboxContent = (index) => {
            const item = galleryItems[index];
            lightboxImage.classList.add('fade-out');
            setTimeout(() => {
                lightboxImage.src = item.src;
                lightboxTitle.textContent = item.title;
                lightboxCounter.textContent = `Imagen ${index + 1} de ${galleryItems.length}`;
                lightboxImage.classList.remove('fade-out');
            }, 200);
        };
        const openLightbox = (index) => {
            currentImageIndex = parseInt(index);
            updateLightboxContent(currentImageIndex);
            lightboxContainer.classList.add('visible');
            document.body.style.overflow = 'hidden';
        };
        const closeLightbox = () => {
            lightboxContainer.classList.remove('visible');
            document.body.style.overflow = 'auto';
        };
        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
            updateLightboxContent(currentImageIndex);
        };
        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxContent(currentImageIndex);
        };

        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(trigger.dataset.index);
            });
        });

        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', closeLightbox);
        lightboxNextBtn.addEventListener('click', showNextImage);
        lightboxPrevBtn.addEventListener('click', showPrevImage);

        document.addEventListener('keydown', (e) => {
            if (lightboxContainer.classList.contains('visible')) {
                if (e.key === 'ArrowRight') showNextImage();
                else if (e.key === 'ArrowLeft') showPrevImage();
                else if (e.key === 'Escape') closeLightbox();
            }
        });
    }
});