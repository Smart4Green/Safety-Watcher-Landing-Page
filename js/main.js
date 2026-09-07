// Main.js - Smart Safe Vision Landing Page

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            const navCollapse = document.getElementById('navbarNav');
            if (navCollapse && navCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    // Navbar scroll effect & active link highlighting
    window.addEventListener('scroll', function() {
        document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);

        // Active nav link on scroll
        const sections = document.querySelectorAll('section[id], footer[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        let current = '';
        
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 80) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Fade-in elements on scroll
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Stats counter animation
    function animateCounter(el, target, duration = 1800) {
        const txt = el.textContent;
        if (txt.includes('/') || txt.includes('∞') || txt.includes('<') || txt.includes('bolt')) return;
        
        const hasSuffix = txt.includes('+');
        const suffix = hasSuffix ? '+' : '';
        const isPct = txt.includes('%');
        
        const start = performance.now();
        (function update(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(p * target) + (isPct ? '%' : suffix);
            if (p < 1) requestAnimationFrame(update);
        })(start);
    }

    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const num = e.target.querySelector('.stat-number');
                if(num) {
                    const valStr = num.textContent.replace(/\D/g, '');
                    const val = parseInt(valStr);
                    if (!isNaN(val) && val > 0) animateCounter(num, val);
                }
                statsObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));

    // Keyboard support for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDemoModal();
            closeContactModal();
        }
    });

    // Hero Carousel initialization with touch swipe support
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel && typeof bootstrap !== 'undefined') {
        const carouselInstance = bootstrap.Carousel.getOrCreateInstance(heroCarousel, {
            interval: 7000,
            pause: 'hover',
            ride: 'carousel',
            touch: true
        });

        // Touch swipe handling for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        heroCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        heroCarousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
                if (diffX < 0) {
                    carouselInstance.next();
                } else {
                    carouselInstance.prev();
                }
            }
        }, { passive: true });
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
});

// Modal Logic (Global)
window.openDemoModal = function() {
    document.getElementById('demoModal').classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeDemoModal = function() {
    document.getElementById('demoModal').classList.remove('active');
    document.body.style.overflow = '';
    const iframe = document.getElementById('demoVideo');
    if(iframe) iframe.src = iframe.src; // Stop video
};

window.openContactModal = function() {
    document.getElementById('contactModal').classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeContactModal = function() {
    document.getElementById('contactModal').classList.remove('active');
    document.body.style.overflow = '';
};

// Theme Switching Logic (Global)
window.setTheme = function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icons = document.querySelectorAll('.theme-icon-sync');
    icons.forEach(icon => {
        icon.className = theme === 'dark' ? 'fas fa-sun theme-icon-sync' : 'fas fa-moon theme-icon-sync';
    });
};

window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
};

// Page Preloader Dismissal
function dismissLoader() {
    const loader = document.getElementById('page-loader');
    document.body.classList.remove('loading');
    if (loader && !loader.classList.contains('loaded')) {
        loader.classList.add('loaded');
        setTimeout(() => {
            if (loader.parentNode) loader.remove();
        }, 550);
    }
}

window.addEventListener('load', dismissLoader);
// Fallback safeguard so loader never blocks the page if an external resource stalls
setTimeout(dismissLoader, 2500);
