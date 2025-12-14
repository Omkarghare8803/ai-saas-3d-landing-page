document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Vanilla Tilt for 3D Cards (only on pointer-capable large screens)
    try {
        const tiltEls = document.querySelectorAll('.tilt-card');
        if (!tiltEls || tiltEls.length === 0) {
            // nothing to do
        } else if (typeof VanillaTilt !== 'undefined') {
            const canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            const wideScreen = window.innerWidth > 768;

            // Use stronger tilt on pointer-capable, large screens; otherwise use gentle tilt or no glare
            const strongOpts = { max: 15, speed: 400, glare: true, "max-glare": 0.2, scale: 1.05 };
            const lightOpts = { max: 6, speed: 350, glare: false, "max-glare": 0, scale: 1.02 };

            const initTilt = () => {
                try {
                    VanillaTilt.init(tiltEls, (canHover && wideScreen) ? strongOpts : lightOpts);
                } catch (err) {
                    // swallow errors to avoid breaking rendering
                    console.warn('VanillaTilt init failed', err);
                }
            };

            if ('requestIdleCallback' in window) {
                requestIdleCallback(initTilt, { timeout: 1500 });
            } else {
                // small timeout to avoid blocking initial paint
                setTimeout(initTilt, 500);
            }
        }
    } catch (e) {
        // fail silently if library unavailable
        console.warn('Tilt init error', e);
    }

    // Initialize GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Navbar Scroll Effect - throttle with rAF and toggle class
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastY = 0;
        let ticking = false;
        window.addEventListener('scroll', () => {
            lastY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (lastY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
                    ticking = false;
                });
                ticking = true;
            }
        }, {passive: true});
    }

    // Mobile Menu Toggle - use class toggles and aria attributes
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const siteNav = document.getElementById('site-navigation');
    const navActions = document.querySelector('.nav-actions');
    if (mobileBtn && siteNav) {
        mobileBtn.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) return;
            const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
            mobileBtn.setAttribute('aria-expanded', String(!expanded));
            siteNav.classList.toggle('is-open');
            if (navActions) navActions.classList.toggle('is-open');
        });
    }

    // Hero Animations (create only if gsap available)
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        tl.from(".hero-content .badge-pill", { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" })
          .from(".hero-content h1", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
          .from(".hero-content p", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
          .from(".hero-btns", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
          .from(".hero-stats", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
          .from(".hero-visual", { x: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.8");
    }

    // Scroll Animations (only when GSAP + ScrollTrigger available)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Features
        gsap.from(".feature-card", {
            scrollTrigger: {
                trigger: ".features-grid",
                start: "top 80%",
                toggleActions: "play none none none",
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out"
        });

        // How It Works
        gsap.from(".step-item", {
            scrollTrigger: {
                trigger: ".steps-container",
                start: "top 80%",
                toggleActions: "play none none none",
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.18,
            ease: "power3.out"
        });

        // Dashboard 3D Effect on Scroll (lightweight scrub)
        gsap.to(".dashboard-preview-container", {
            scrollTrigger: {
                trigger: ".dashboard-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                toggleActions: "play none none reverse",
            },
            rotateX: 0,
            rotateY: 0,
            scale: 1.06
        });

        // Pricing
        gsap.from(".pricing-card", {
            scrollTrigger: {
                trigger: ".pricing-grid",
                start: "top 80%",
                toggleActions: "play none none none",
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out"
        });
    }

    // FAQ Toggle (ARIA + accessible buttons)
    const faqToggles = document.querySelectorAll('.faq-toggle');
    if (faqToggles.length) {
        faqToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('aria-controls');
                const target = document.getElementById(targetId);
                const expanded = btn.getAttribute('aria-expanded') === 'true';

                // Close all
                faqToggles.forEach(b => {
                    const id = b.getAttribute('aria-controls');
                    const el = document.getElementById(id);
                    b.setAttribute('aria-expanded', 'false');
                    if (el) el.setAttribute('aria-hidden', 'true');
                    if (el && el.parentElement) el.parentElement.classList.remove('active');
                });

                // Toggle current
                btn.setAttribute('aria-expanded', String(!expanded));
                if (target) {
                    target.setAttribute('aria-hidden', String(expanded));
                    if (!expanded && target.parentElement) target.parentElement.classList.add('active');
                }
            });
        });
    }

    // Make the entire question row clickable (icon or padding area) to toggle FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length) {
        faqQuestions.forEach(q => {
            q.addEventListener('click', (e) => {
                // if click target is the toggle button itself, let the toggle handler run
                const toggle = q.querySelector('.faq-toggle');
                if (toggle && e.target !== toggle) {
                    toggle.click();
                }
            });
        });
    }

    // Particle Animation - defer for performance and skip on small screens
    if (window.innerWidth > 700) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(initParticles, {timeout: 2000});
        } else {
            window.addEventListener('load', initParticles, {passive: true});
        }
    }

    // Pause heavy CSS animations when not visible to save CPU (hologram, floating cards, robot)
    if ('IntersectionObserver' in window) {
        const toObserve = document.querySelectorAll('.floating-animation, .hologram-overlay, .floating-card, .dashboard-preview-container');
        if (toObserve.length) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0.15) {
                        entry.target.classList.remove('paused');
                    } else {
                        entry.target.classList.add('paused');
                    }
                });
            }, { threshold: [0.15], rootMargin: '0px 0px -20% 0px' });

            toObserve.forEach(el => io.observe(el));
        }
    }
});

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // set sizes
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();

    let particlesArray = [];
    const MAX_PARTICLES = 200;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() * 0.5) - 0.25;
            this.speedY = (Math.random() * 0.5) - 0.25;
            this.color = Math.random() > 0.5 ? '#6a00ff' : '#00d2ff';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = Math.floor((canvas.width * canvas.height) / 30000); // reduced density
        numberOfParticles = Math.min(numberOfParticles, MAX_PARTICLES);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    let rafId = null;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }

        // Connect a limited number of neighbors to avoid O(n^2) overload
        connect();

        rafId = requestAnimationFrame(animate);
    }

    function connect() {
        const maxConnect = 25;
        const thresholdSq = 16000; // squared-ish threshold for connection
        ctx.save();
        ctx.lineWidth = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            const pA = particlesArray[a];
            for (let b = a + 1; b < Math.min(particlesArray.length, a + maxConnect); b++) {
                const pB = particlesArray[b];
                const dx = pA.x - pB.x;
                const dy = pA.y - pB.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < thresholdSq) {
                    const opacity = Math.max(0, 1 - distSq / thresholdSq) * 0.18;
                    ctx.strokeStyle = 'rgba(106, 0, 255,' + opacity + ')';
                    ctx.beginPath();
                    ctx.moveTo(pA.x, pA.y);
                    ctx.lineTo(pB.x, pB.y);
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    }

    // Debounced resize handler using rAF
    let resizeRaf = null;
    window.addEventListener('resize', () => {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
            setCanvasSize();
            init();
        });
    }, {passive: true});

    init();
    animate();

    // Expose a stop hook in case needed
    return () => { if (rafId) cancelAnimationFrame(rafId); };
}
