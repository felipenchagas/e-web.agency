// ===================================
// GPA Advocacia - Layout 2 (Inovador)
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
});

// ===== Mobile Menu =====
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        const links = menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function () {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements
    const elements = document.querySelectorAll('.h-card, .timeline-item, .info-block');
    elements.forEach(el => observer.observe(el));
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            const message = `
*Nova mensagem do site GPA Advocacia*

*Nome:* ${data.firstName} ${data.lastName}
*E-mail:* ${data.email}
*Telefone:* ${data.phone || 'Não informado'}

*Mensagem:*
${data.message}
            `.trim();

            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/5541997266499?text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
            alert('Mensagem enviada! Você será redirecionado para o WhatsApp.');
            form.reset();
        });
    }
}

// ===== Parallax Effect =====
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-split__right img');

    parallaxElements.forEach(el => {
        el.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
});
