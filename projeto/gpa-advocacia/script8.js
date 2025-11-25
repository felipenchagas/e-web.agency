/* =========================================
   GPA ADVOCACIA - SCRIPT (DYNAMIC)
   File: script8.js
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- FLOATING MENU LOGIC --- */
    const floatingMenu = document.getElementById('floating-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            floatingMenu.classList.add('scrolled');
        } else {
            floatingMenu.classList.remove('scrolled');
        }
    });

    /* --- MOBILE MENU OVERLAY --- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const closeMenuBtn = document.getElementById('close-menu');

    function openMenu() {
        mobileOverlay.style.opacity = '1';
        mobileOverlay.style.pointerEvents = 'all';
    }

    function closeMenu() {
        mobileOverlay.style.opacity = '0';
        mobileOverlay.style.pointerEvents = 'none';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);

    // Expose closeMenu to global scope for onclick handlers in HTML
    window.closeMenu = closeMenu;

    /* --- SCROLL ANIMATIONS (Intersection Observer) --- */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Trigger counter if it's a stat number
                if (entry.target.classList.contains('stat-number')) {
                    startCounter(entry.target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll('.service-card, .about__content, .section-title, .stat-item, .hero__form');

    animateElements.forEach(el => {
        // Set initial state via JS to ensure graceful degradation if JS fails
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
        observer.observe(el);
    });

    /* --- COUNTER ANIMATION --- */
    function startCounter(el) {
        const target = +el.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps

        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                el.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = target + (target === 8 ? '+' : ''); // Add + for years
            }
        };
        updateCounter();
    }

    /* --- FAQ TOGGLE --- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });
});
