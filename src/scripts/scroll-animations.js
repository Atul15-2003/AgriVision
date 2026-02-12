import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
console.log("Scroll Animations Script Loaded");

// Wait for DOM to be ready
const initScrollAnimations = () => {
    // 1. Navbar Transition
    // 1. Navbar Transition
    const heroBrandRow = document.querySelector('.hero-brand-row');
    const heroNav = document.querySelector('.glass-pill-nav'); // Updated selector
    const stickyNav = document.querySelector('.sticky-nav');
    const stickyLogo = document.querySelector('.sticky-logo');

    // ... (logic)

    const navTl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "+=200",
            scrub: true,
        }
    });

    if (heroBrandRow) navTl.fromTo(heroBrandRow, { opacity: 1, y: 0, scale: 1 }, { opacity: 0, y: -50, scale: 0.8, duration: 1 }, 0);
    if (document.querySelector(".hero-sub-spaced")) navTl.fromTo([".hero-sub-spaced", ".hero-text-block", ".cta-pill"], { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 1 }, 0);
    // Removed heroNav animation from here to avoid conflict with main.js which handles the specific fade logic
    // if (heroNav) navTl.to(heroNav, { opacity: 0, y: -20, duration: 1 }, 0);

    // Sticky Nav Slide In
    // Unified Navigation Toggle Logic
    // Scrolled > 200px: Sticky Nav shows, Glass Nav hides.
    // Scrolled < 200px: Sticky Nav hides, Glass Nav shows.
    // Unified Navigation Toggle Logic
    // Scrolled > 200px: Sticky Nav shows, Glass Nav hides.
    // Scrolled < 200px: Sticky Nav hides, Glass Nav shows.
    // const heroNav already defined above

    ScrollTrigger.create({
        trigger: "body",
        start: "200px top", // Trigger when scrolled 200px down
        end: "bottom bottom",
        onToggle: self => {
            // self.isActive is true when between start/end (scrolled > 200px)
            if (self.isActive) {
                if (stickyNav) stickyNav.classList.add('visible');
                if (heroNav) heroNav.classList.add('nav-hidden');
            } else {
                if (stickyNav) stickyNav.classList.remove('visible');
                if (heroNav) heroNav.classList.remove('nav-hidden');
            }
        }
    });

    // Title Animation: Split Text Reveal (Moved outside of agriWrapper check)
    const sectionTitle = document.querySelector('.agri-section-title');
    const transformSection = document.querySelector('.transforming-agriculture-section');

    if (sectionTitle && transformSection) {
        // 1. Split text into characters for fine-grained control
        const text = sectionTitle.textContent.trim();
        sectionTitle.textContent = '';
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.transform = 'translateY(100%) rotate(10deg)'; // Initial state
            if (char === ' ') span.style.width = '0.3em'; // Preserve spaces
            sectionTitle.appendChild(span);
        });

        // 2. Animate characters in
        gsap.to(sectionTitle.children, {
            scrollTrigger: {
                trigger: transformSection, // Use the correct section trigger
                start: "top 75%", // Start earlier
                end: "top 40%",
                scrub: 1
            },
            opacity: 1,
            y: 0,
            rotate: 0,
            stagger: 0.1, // Increased stagger for more visibility
            duration: 1.5,
            ease: "back.out(1.7)"
        });
    }

    // 2. "Transforming Agriculture" 3D Scroll Section
    const agriWrapper = document.querySelector('.agri-stage-wrapper');
    const agriCards = document.querySelectorAll('.agri-card');

    if (agriWrapper && agriCards.length > 0) {
        console.log("Initializing 3D Agriculture Section");



        // Create a dedicated timeline for pinning and scrubbing
        const agriTl = gsap.timeline({
            scrollTrigger: {
                trigger: agriWrapper,
                start: "top top",
                end: "+=400%", // Pin for 4 screens worth of scroll
                pin: true,
                scrub: 1, // Smooth scrubbing
                anticipatePin: 1
            }
        });





        // Set initial states for all cards (hidden and 3D rotated)
        agriCards.forEach((card, i) => {
            if (i !== 0) {
                gsap.set(card, {
                    autoAlpha: 0,
                    rotateY: -25,
                    z: -100
                });
                gsap.set(card.querySelector('.card-text-wrapper'), { rotateX: 10, opacity: 0 });
            } else {
                // First card effectively visible, but let's animate it 'in' fully or leave as static start
                gsap.set(card, { autoAlpha: 1, rotateY: 0, z: 0 });
                gsap.set(card.querySelector('.card-text-wrapper'), { rotateX: 0, opacity: 1 });
            }
        });

        // Loop through cards to create the sequence
        // Card 1 is already visible. 
        // We need to animate:
        // C1 Out -> C2 In
        // C2 Out -> C3 In
        // C3 Out -> C4 In

        // Helper function for 3D In/Out
        const animateIn = (card) => {
            const tl = gsap.timeline();
            tl.to(card, {
                autoAlpha: 1,
                rotateY: 0,
                z: 0,
                duration: 1,
                ease: "power2.out"
            })
                .to(card.querySelector('.card-text-wrapper'), {
                    rotateX: 0,
                    opacity: 1,
                    duration: 0.8
                }, "<0.2"); // Overlap slightly
            return tl;
        };

        const animateOut = (card) => {
            return gsap.to(card, {
                autoAlpha: 0,
                rotateY: 25,
                z: -100,
                duration: 1,
                ease: "power2.in"
            });
        };

        // Build the timeline
        // 1. C1 Out, C2 In
        agriTl.add(animateOut(agriCards[0]), "+=0.5");
        agriTl.add(animateIn(agriCards[1]), "<0.2");

        // 2. C2 Out, C3 In
        agriTl.add(animateOut(agriCards[1]), "+=1");
        agriTl.add(animateIn(agriCards[2]), "<0.2");

        // 3. C3 Out, C4 In
        agriTl.add(animateOut(agriCards[2]), "+=1");
        agriTl.add(animateIn(agriCards[3]), "<0.2");

        // Hold C4 for a bit at the end
        agriTl.to({}, { duration: 1 });
    }
};

// Initialize on load
window.addEventListener('load', initScrollAnimations);
