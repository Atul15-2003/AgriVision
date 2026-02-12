import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- 1. Navbar Toggle Logic ---
// This handles the disappearance of the pill nav and appearance of the sticky nav
const initNavToggle = () => {
    const pillNav = document.querySelector('.glass-pill-nav');
    const stickyNav = document.querySelector('.sticky-nav');

    if (!pillNav || !stickyNav) return;

    window.addEventListener('scroll', () => {
        // Threshold: 80px scroll to swap navs
        if (window.scrollY > 80) {
            // Hide the pill navigation
            pillNav.style.opacity = '0';
            pillNav.style.visibility = 'hidden';
            pillNav.style.pointerEvents = 'none';

            // Show the sticky navigation
            stickyNav.classList.add('active');
        } else {
            // Re-show the pill navigation
            pillNav.style.opacity = '1';
            pillNav.style.visibility = 'visible';
            pillNav.style.pointerEvents = 'auto';

            // Hide the sticky navigation
            stickyNav.classList.remove('active');
        }
    });
};

// --- 2. Stair Transition Logic ---
const initStairTransition = () => {
    let container = document.getElementById('stair-container');

    // 1. Ensure Container Exists
    if (!container) {
        container = document.createElement('div');
        container.id = 'stair-container';
        document.body.prepend(container);
    }

    // 2. Ensure Stair Bars Exist (Fix: Check if bars exist, not just container)
    if (container.children.length === 0) {
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.classList.add('stair');
            // Styles are now in main.css
            container.appendChild(bar);
        }
    }

    // GSAP Reveal Animation
    const tl = gsap.timeline();

    // Check if we are on the homepage
    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');

    if (isHomePage) {
        // Enforce Theme Green Color (Requested change from Black)
        gsap.set('.stair', { backgroundColor: '#0d1614' });

        // Original Homepage "Stair" Animation (K72_re Style)
        // 1. Stairs grow from height 0 to 100% (Staggered)
        // 2. Stairs slide down (Staggered)
        // 3. Page content fades in and scales down

        // Optimize: promote layers to GPU
        gsap.set('.stair', { willChange: 'height, transform' });

        const pageContent = document.getElementById('page-content-wrapper') || 'body > *:not(#stair-container)';
        if (pageContent instanceof HTMLElement) {
            pageContent.style.willChange = 'opacity, transform';
        }

        // Use fromTo for the first step to match "from { height: 0 }" logic precisely
        tl.fromTo('.stair',
            { height: '0%' },
            {
                height: '100%',
                duration: 0.5, // Default GSAP duration
                stagger: { amount: -0.3 }, // K72 uses negative stagger
                ease: 'power1.out', // Default GSAP ease
                force3D: true // Force GPU acceleration
            }
        )
            .to('.stair', {
                y: '100%', // Slide down
                duration: 0.5,
                stagger: { amount: -0.3 },
                ease: 'power1.out',
                force3D: true, // Force GPU acceleration
                onComplete: () => {
                    if (container) container.remove();
                    // Clean up will-change to save memory
                    if (pageContent instanceof HTMLElement) {
                        pageContent.style.willChange = 'auto';
                    }
                }
            });

        // Page Content Animation (Matches K72_re: delay 1.3, opacity 0, scale 1.2)
        // Targeting the page wrapper for cohesive scaling

        gsap.from(pageContent, {
            opacity: 0,
            scale: 1.2,
            duration: 0.5, // Default GSAP duration
            delay: 1.3, // Precise K72 delay
            ease: 'power1.out',
            force3D: true, // Force GPU acceleration
            clearProps: 'all'
        });

    } else {
        // Simple "Reveal" Animation for other pages: Bars start full, then shrink up
        // Force bars to full height initially
        gsap.set('.stair', { height: '100%', top: '0', backgroundColor: '#0d1614' }); // Use Theme Green for others

        tl.to('.stair', {
            height: '0%', // Animate height to 0 to reveal content
            duration: 0.8, // Faster reveal
            stagger: { amount: 0.2 }, // Positive stagger for shrink
            ease: 'power2.inOut',
            force3D: true,
            delay: 0.1,
            onComplete: () => {
                if (container) container.remove();
            }
        });
    }
};

// --- 3. Slideshow Logic ---
const initSlideshow = () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };
        setInterval(nextSlide, 4000);
    }
};

// --- 4. Initialization ---
const runAnimations = () => {
    console.log("Initializing AgriVision Core...");
    initStairTransition();
    initNavToggle(); // Re-added the missing scroll logic
    initSlideshow();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAnimations);
} else {
    runAnimations();
}

// Safety Net: Force reveal content if animations hang
setTimeout(() => {
    const container = document.getElementById('stair-container');
    if (container) container.style.display = 'none';
    document.body.style.opacity = '1';
}, 3500);