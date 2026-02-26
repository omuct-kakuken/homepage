document.addEventListener('DOMContentLoaded', () => {

    // 1. Header scroll effect
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add shadow when scrolled down
        if (currentScrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide header on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }

        lastScrollY = currentScrollY;
    });

    // 2. Active Navigation Link Update
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveLink = () => {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // initial call


    // 3. Simple Fade Up Animation using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to elements that need animating
    const fadeElements = document.querySelectorAll('.fade-up, .work-card');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // 4. 3D Cube Rotation and Drag Interaction
    const cube = document.querySelector('.cube-wireframe');
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let currentRotation = { x: 15, y: 0 }; // Initial angle
    let autoRotate = true;

    if (cube) {
        // Continuous auto rotation
        const rotateLoop = () => {
            if (autoRotate) {
                currentRotation.y += 0.25; // Speed of auto rotation
                updateCubeRotation();
            }
            requestAnimationFrame(rotateLoop);
        };
        requestAnimationFrame(rotateLoop);

        const updateCubeRotation = () => {
            // Apply both X and Y rotation
            cube.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg) rotateZ(0deg)`;
        };

        const startDrag = (e) => {
            isDragging = true;
            autoRotate = false; // Stop auto rotation while user holds it
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            previousMousePosition = { x: clientX, y: clientY };

            // Prevent text selection during drag
            if (e.type === 'mousedown') {
                e.preventDefault();
            }
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - previousMousePosition.x;
            const deltaY = clientY - previousMousePosition.y;

            // X axis rotation mapped to vertical movement
            currentRotation.x -= deltaY * 0.4;
            // Y axis rotation mapped to horizontal movement
            currentRotation.y += deltaX * 0.4;

            updateCubeRotation();
            previousMousePosition = { x: clientX, y: clientY };
        };

        const endDrag = () => {
            isDragging = false;
            autoRotate = true; // Resume rotating
        };

        // Mouse events (Desktop)
        cube.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);

        // Touch events (Mobile)
        cube.addEventListener('touchstart', startDrag, { passive: true });
        document.addEventListener('touchmove', onDrag, { passive: true });
        document.addEventListener('touchend', endDrag);
    }
});
