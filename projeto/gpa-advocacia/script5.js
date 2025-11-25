/* =============== MOBILE MENU =============== */
const navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close'),
    mobileMenu = document.getElementById('mobile-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        mobileMenu.classList.add('show');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
    });
}

// Close menu when clicking a link
const mobileLinks = document.querySelectorAll('.mobile-menu__list a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
    });
});

/* =============== COUNTER ANIMATION =============== */
const statsSection = document.querySelector('.stats');
const statNumbers = document.querySelectorAll('.stat-number');
let started = false; // Function Started ? No

window.onscroll = function () {
    if (window.scrollY >= statsSection.offsetTop - 500) {
        if (!started) {
            statNumbers.forEach((num) => startCount(num));
        }
        started = true;
    }
};

function startCount(el) {
    let goal = el.dataset.target;
    let count = setInterval(() => {
        el.textContent++;
        if (el.textContent == goal) {
            clearInterval(count);
        }
    }, 2000 / goal); // Adjust speed
}

/* =============== HERO PARALLAX (SIMPLE) =============== */
document.addEventListener('mousemove', (e) => {
    const bg = document.querySelector('.hero__bg-img');
    const x = (window.innerWidth - e.pageX * 2) / 90;
    const y = (window.innerHeight - e.pageY * 2) / 90;

    if (bg) {
        bg.style.transform = `translateX(${x}px) translateY(${y}px)`;
    }
});
