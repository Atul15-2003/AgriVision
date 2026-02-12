import gsap from 'gsap';

export function initStairTransition() {
    // 1. Inject HTML Logic
    const existingContainer = document.getElementById('stair-container');
    if (!existingContainer) {
        const container = document.createElement('div');
        container.id = 'stair-container';

        // Create 5 stairs
        for (let i = 0; i < 5; i++) {
            const stair = document.createElement('div');
            stair.classList.add('stair');
            container.appendChild(stair);
        }

        document.body.appendChild(container); // Add to body
    }

    // 2. Define Animations
    const stairs = document.querySelectorAll('.stair');

    // Page Load Animation (Reveal)
    // Bars are initially covering the screen (defined in CSS or enforced here)
    const revealPage = () => {
        // Ensure they are covering first (in case of cached state, though CSS does this)
        gsap.set(stairs, { y: '0%' });

        // Animate out (Slide down to reveal)
        gsap.to(stairs, {
            y: '100%',
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.inOut',
            delay: 0.1
        });
    };

    // Navigation Animation (Cover)
    // Called before leaving the page
    const coverPage = (href) => {
        // Reset positions to above the screen so they can slide down/in? 
        // Or grow from top? 'stairs.jsx' did "from height 0".
        // Let's try: Sliding in from top (-100% to 0%)

        gsap.set(stairs, { y: '-100%' }); // Start above

        gsap.to(stairs, {
            y: '0%', // Slide down to cover
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.inOut',
            onComplete: () => {
                window.location.href = href;
            }
        });
    };

    // 3. Execution on Load
    // Run reveal immediately on load
    revealPage();

    // 4. Intercept Links using Event Bubbling
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');

        // Check if it's a valid local link
        if (link && link.href && link.href.startsWith(window.location.origin) && !link.hash && link.target !== '_blank') {
            e.preventDefault();
            coverPage(link.href);
        }
    });

    // Handle Back/Forward Browser Buttons? 
    // It's hard to intercept popstate perfectly for animations without SPA router, 
    // but browsers handle restore fairly well. We rely on 'revealPage' running on the new page load.
}
