/* =========================================
   GPA ADVOCACIA - SCRIPT
   File: script7.js
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- MOBILE MENU --- */
    const navToggle = document.getElementById('mobile-toggle');
    const navClose = document.getElementById('mobile-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.mobile-menu__link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    /* --- HEADER SCROLL EFFECT --- */
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY >= 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            header.style.height = '70px';
        } else {
            header.style.boxShadow = 'none';
            header.style.height = '90px';
        }
    });

    /* --- SCROLL REVEAL ANIMATION --- */
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll('.service-card, .about__content, .section__title, .trust-item');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});
