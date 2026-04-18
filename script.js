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

    // 1.5 Mobile hamburger menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const siteNav = document.querySelector('.site-nav');

    if (mobileMenuBtn && siteNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            siteNav.classList.toggle('open');
            // Prevent body scroll when menu is open
            document.body.style.overflow = siteNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when a nav link is clicked
        const mobileNavLinks = siteNav.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                siteNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

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

    // --- スマホ向けパフォーマンス最適化 ---
    // 画面幅が768px以下の場合、間隔（0.5px）は維持したまま、外側のレイヤーを隠して全体の厚みを減らす（約15枚に削減）
    if (window.innerWidth <= 768) {
        const thicknessLayers = document.querySelectorAll('.logo-layer.thickness');
        const frontLayer = document.querySelector('.logo-layer:not(.thickness):not(.back)');
        const backLayer = document.querySelector('.logo-layer.back');

        thicknessLayers.forEach((layer, index) => {
            // 中央の13枚（インデックス5〜17）のみ残す
            if (index < 5 || index > 17) {
                layer.style.display = 'none';
            }
        });

        // 前面と背面の位置も、薄くなった厚みに合わせて調整（+3.5px / -3.5px）
        if (frontLayer) frontLayer.style.transform = 'translateZ(3.5px)';
        if (backLayer) backLayer.style.transform = 'translateZ(-3.5px)';
    }

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

        // Mouse events (Desktop only as requested)
        cube.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);

        // Touch drag is disabled to prevent scroll interference on mobile
        }

        // Gallery thumbnail switcher
        const galleryMain = document.getElementById('gallery-main-img');
        const thumbButtons = document.querySelectorAll('.thumb-button');

        if (galleryMain && thumbButtons.length) {
            thumbButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const src = btn.getAttribute('data-src');
                    if (!src) return;
                    galleryMain.src = src;
                    thumbButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });

                // keyboard accessibility (Enter / Space)
                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        btn.click();
                    }
                });
            });

            // set initial active thumb
            thumbButtons[0].classList.add('active');
        }

    });
