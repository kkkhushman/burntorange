// ============================================
// BURNT ORANGE - Interactive Elements
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initMobileMenu();
    initFormHandling();
    initSmoothScroll();
    initTypewriter();
});

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const textElement = document.querySelector('.typewriter-text');
    if (!textElement) return;
    
    const messages = [
        { text: '<span class="bold">we make</span> <span class="italic">epic</span> <span class="bold">shit</span>', hold: 2000 },
        { text: '<span class="bold">curious?</span> <span class="italic">scroll down</span>', hold: 3000 }
    ];
    
    const typeSpeed = 80;
    const deleteSpeed = 40;
    let messageIndex = 0;
    
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function typeText(html) {
        // Parse spans from HTML
        const spans = [];
        const spanRegex = /<span class="([^"]+)">([^<]+)<\/span>/g;
        let match;
        let plainText = html;
        
        while ((match = spanRegex.exec(html)) !== null) {
            spans.push({ class: match[1], text: match[2], start: -1 });
            plainText = plainText.replace(match[0], match[2]);
        }
        
        // Find positions of each span text
        let searchPos = 0;
        spans.forEach(span => {
            const pos = plainText.indexOf(span.text, searchPos);
            span.start = pos;
            span.end = pos + span.text.length;
            searchPos = span.end;
        });
        
        let displayed = '';
        
        for (let i = 0; i < plainText.length; i++) {
            const char = plainText[i];
            
            // Check if this character is inside a styled span
            let inSpan = null;
            for (const span of spans) {
                if (i >= span.start && i < span.end) {
                    inSpan = span;
                    break;
                }
            }
            
            if (inSpan) {
                // Build the styled version
                const beforeSpan = plainText.substring(0, inSpan.start);
                const typedInSpan = plainText.substring(inSpan.start, i + 1);
                const afterText = '';
                
                let result = '';
                let pos = 0;
                
                for (let j = 0; j <= i; j++) {
                    let charInSpan = null;
                    for (const s of spans) {
                        if (j >= s.start && j < s.end) {
                            charInSpan = s;
                            break;
                        }
                    }
                    
                    if (charInSpan) {
                        if (j === charInSpan.start) {
                            result += `<span class="${charInSpan.class}">`;
                        }
                        result += plainText[j];
                        if (j === charInSpan.end - 1 || j === i) {
                            result += '</span>';
                        }
                    } else {
                        result += plainText[j];
                    }
                }
                
                textElement.innerHTML = result;
            } else {
                // Rebuild with all spans up to current position
                let result = '';
                for (let j = 0; j <= i; j++) {
                    let charInSpan = null;
                    for (const s of spans) {
                        if (j >= s.start && j < s.end) {
                            charInSpan = s;
                            break;
                        }
                    }
                    
                    if (charInSpan) {
                        if (j === charInSpan.start) {
                            result += `<span class="${charInSpan.class}">`;
                        }
                        result += plainText[j];
                        if (j === charInSpan.end - 1) {
                            result += '</span>';
                        }
                    } else {
                        result += plainText[j];
                    }
                }
                textElement.innerHTML = result;
            }
            
            await sleep(typeSpeed);
        }
    }
    
    async function deleteText() {
        const currentText = textElement.textContent;
        for (let i = currentText.length; i >= 0; i--) {
            textElement.textContent = currentText.substring(0, i);
            await sleep(deleteSpeed);
        }
    }
    
    async function runTypewriter() {
        // Initial delay
        await sleep(500);
        
        // Type first message
        await typeText(messages[0].text);
        await sleep(messages[0].hold);
        
        // Delete first message
        await deleteText();
        await sleep(300);
        
        // Type second message
        await typeText(messages[1].text);
        
        // Keep second message visible
    }
    
    runTypewriter();
}

// ============================================
// NAVIGATION - Reveal after hero
// ============================================
function initNavigation() {
    const nav = document.querySelector('.nav');
    const hero = document.querySelector('.hero');
    
    if (!nav || !hero) return;
    
    const heroHeight = hero.offsetHeight;
    
    function checkScroll() {
        const currentScrollY = window.scrollY;
        
        // Show nav after scrolling past 80% of hero
        if (currentScrollY > heroHeight * 0.8) {
            nav.classList.remove('nav-hidden');
            nav.classList.add('nav-visible');
        } else {
            nav.classList.add('nav-hidden');
            nav.classList.remove('nav-visible');
        }
    }
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll, { passive: true });
    
    // Initial check
    checkScroll();
    
    // Recalculate hero height on resize
    window.addEventListener('resize', () => {
        const newHeroHeight = hero.offsetHeight;
        checkScroll();
    }, { passive: true });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(
        '.section-header, .service-card, .about-content, .about-visual, ' +
        '.philosophy-quote, .work-card, .contact-content, .contact-form'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-card.animate-on-scroll {
            transition-delay: calc(var(--index, 0) * 0.1s);
        }
        
        .work-card.animate-on-scroll {
            transition-delay: calc(var(--index, 0) * 0.15s);
        }
    `;
    document.head.appendChild(style);
    
    // Add staggered delays to service cards
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.setProperty('--index', index);
    });
    
    // Add staggered delays to work cards
    document.querySelectorAll('.work-card').forEach((card, index) => {
        card.style.setProperty('--index', index);
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    let isOpen = false;
    
    if (!menuBtn) return;
    
    // Create mobile menu overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    // Add CSS for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--color-cream);
            z-index: 999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        
        .mobile-menu-overlay.is-open {
            opacity: 1;
            visibility: visible;
        }
        
        .mobile-menu-overlay a {
            font-family: var(--font-display);
            font-size: 2rem;
            color: var(--color-black);
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease, transform 0.4s ease, color 0.3s ease;
        }
        
        .mobile-menu-overlay.is-open a {
            opacity: 1;
            transform: translateY(0);
        }
        
        .mobile-menu-overlay a:hover {
            color: var(--color-orange);
        }
        
        .mobile-menu-btn.is-open span:first-child {
            transform: rotate(45deg) translateY(5px);
        }
        
        .mobile-menu-btn.is-open span:last-child {
            transform: rotate(-45deg) translateY(-5px);
        }
    `;
    document.head.appendChild(style);
    
    // Clone nav links into overlay
    const links = navLinks.querySelectorAll('a');
    links.forEach((link, index) => {
        const clone = link.cloneNode(true);
        clone.style.transitionDelay = `${0.1 + index * 0.05}s`;
        clone.addEventListener('click', () => toggleMenu());
        overlay.appendChild(clone);
    });
    
    function toggleMenu() {
        isOpen = !isOpen;
        menuBtn.classList.toggle('is-open', isOpen);
        overlay.classList.toggle('is-open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    
    menuBtn.addEventListener('click', toggleMenu);
}

// ============================================
// FORM HANDLING
// ============================================
function initFormHandling() {
    const form = document.querySelector('.contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Add success animation
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        btn.textContent = 'Message Sent!';
        btn.style.backgroundColor = 'var(--color-orange)';
        
        // Reset after delay
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            form.reset();
        }, 3000);
        
        console.log('Form submitted:', data);
    });
    
    // Add focus effects to form inputs
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('is-focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('is-focused');
        });
    });
    
    // Add CSS for form focus effects
    const style = document.createElement('style');
    style.textContent = `
        .form-group.is-focused label {
            color: var(--color-orange);
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// CURSOR EFFECTS (Optional Enhancement)
// ============================================
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor {
            width: 20px;
            height: 20px;
            border: 1px solid var(--color-orange);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease, opacity 0.15s ease;
            mix-blend-mode: difference;
        }
        
        .custom-cursor.is-hovering {
            transform: scale(2);
            background-color: var(--color-orange);
        }
        
        @media (max-width: 768px) {
            .custom-cursor { display: none; }
        }
    `;
    document.head.appendChild(style);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    const hoverElements = document.querySelectorAll('a, button, .service-card, .work-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
}

// Uncomment to enable custom cursor:
// initCustomCursor();

