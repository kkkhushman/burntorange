// ============================================
// BURNT ORANGE — Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileMenu();
    initRotator();
    initServices();
    initReveals();
    initCounters();
});

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --------------------------------------------
// Nav — solid background once scrolled
// --------------------------------------------
function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const onScroll = () => {
        nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// --------------------------------------------
// Mobile menu
// --------------------------------------------
function initMobileMenu() {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    const setOpen = (open) => {
        btn.classList.toggle('is-open', open);
        menu.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    btn.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
    menu.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', () => setOpen(false))
    );
}

// --------------------------------------------
// Hero rotator — typewriter word cycle
// --------------------------------------------
function initRotator() {
    const el = document.getElementById('rotator-word');
    if (!el) return;

    const words = ['ignite.', 'endure.', 'convert.', 'provoke.'];
    if (REDUCED_MOTION) return; // keep the first word static

    const TYPE = 90;
    const ERASE = 45;
    const HOLD = 2400;
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    (async function cycle() {
        let i = 0;
        // let the load-in animation finish before the first swap
        await sleep(HOLD + 1200);
        while (true) {
            const current = el.textContent;
            for (let c = current.length; c >= 0; c--) {
                el.textContent = current.slice(0, c);
                await sleep(ERASE);
            }
            await sleep(250);
            i = (i + 1) % words.length;
            for (let c = 1; c <= words[i].length; c++) {
                el.textContent = words[i].slice(0, c);
                await sleep(TYPE);
            }
            await sleep(HOLD);
        }
    })();
}

// --------------------------------------------
// Services accordion
// --------------------------------------------
function initServices() {
    const services = document.querySelectorAll('.service');

    services.forEach(service => {
        const head = service.querySelector('.service-head');
        head.addEventListener('click', () => {
            const isOpen = service.classList.contains('is-open');

            services.forEach(s => {
                s.classList.remove('is-open');
                s.querySelector('.service-head').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                service.classList.add('is-open');
                head.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // open the first one by default
    if (services.length) {
        services[0].classList.add('is-open');
        services[0].querySelector('.service-head').setAttribute('aria-expanded', 'true');
    }
}

// --------------------------------------------
// Scroll reveals (staggered within siblings)
// --------------------------------------------
function initReveals() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

    els.forEach(el => {
        const siblings = el.parentElement
            ? [...el.parentElement.children].filter(c => c.classList.contains('reveal'))
            : [el];
        el.style.setProperty('--stagger', `${siblings.indexOf(el) * 0.12}s`);
        observer.observe(el);
    });
}

// --------------------------------------------
// Stat counters
// --------------------------------------------
function initCounters() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (!stats.length || REDUCED_MOTION || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);

            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1400;
            const start = performance.now();

            (function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 4);
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            })(start);
        });
    }, { threshold: 0.4 });

    stats.forEach(el => observer.observe(el));
}
