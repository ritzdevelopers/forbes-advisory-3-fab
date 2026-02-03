// ============================================
// Lenis Smooth Scroll Initialization
// ============================================
let lenis;

function initLenis() {
    if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Animation frame loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', () => {
            ScrollTrigger.update();
            handleNavbarScroll(); // Update navbar on scroll
        });

        // Update ScrollTrigger on Lenis scroll
        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                if (arguments.length) {
                    lenis.scrollTo(value, { immediate: true });
                }
                return lenis.scroll;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            }
        });

        // Refresh ScrollTrigger after Lenis is ready
        ScrollTrigger.addEventListener('refresh', () => {
            if (lenis) {
                lenis.resize();
            }
        });

        ScrollTrigger.refresh();
    }
}

// ============================================
// Navbar scroll behavior
// ============================================
let lastScrollTop = 0;
const navbar = document.getElementById('main-navbar');
const defaultLogo = document.getElementById('default-logo');
const scrollLogo = document.getElementById('scroll-logo');

// Navbar scroll handler - works with both native scroll and Lenis
function handleNavbarScroll() {
    const scrollTop = lenis ? lenis.scroll : (window.pageYOffset || document.documentElement.scrollTop);
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelectorAll('#main-navbar ul li a, #main-navbar ul li button');

    if (scrollTop > 50) {
        // User has scrolled down - make navbar fixed at top with black background
        navbar.classList.remove('absolute', 'top-0', 'md:top-0');
        navbar.classList.add('fixed', 'top-0', 'bg-black');

        // Animate background color with GSAP
        if (typeof gsap !== 'undefined') {
            gsap.to(navbar, {
                backgroundColor: '#000000',
                duration: 0.3,
                ease: 'power2.out'
            });
        }

        // Show scroll logo, hide default logo instantly
        defaultLogo.classList.add('hidden');
        scrollLogo.classList.remove('hidden');

        // Change text color to white with GSAP
        navLinks.forEach(link => {
            if (typeof gsap !== 'undefined') {
                gsap.to(link, {
                    color: '#ffffff',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                link.style.color = '#ffffff';
            }
        });

        // Ensure menu button text is white when navbar has black background
        if (mobileMenuBtn) {
            if (typeof gsap !== 'undefined') {
                gsap.to(mobileMenuBtn, {
                    color: '#ffffff',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                mobileMenuBtn.classList.add('text-white');
                mobileMenuBtn.classList.remove('text-black');
            }
        }

        lastScrollTop = scrollTop;
    } else {
        // User is at the top - restore original position and remove background
        navbar.classList.remove('fixed', 'top-0', 'bg-black');
        navbar.classList.add('absolute', 'top-0', 'md:top-0');

        // Animate background to transparent with GSAP
        if (typeof gsap !== 'undefined') {
            gsap.to(navbar, {
                backgroundColor: 'transparent',
                duration: 0.3,
                ease: 'power2.out'
            });
        }

        // Show default logo, hide scroll logo instantly
        scrollLogo.classList.add('hidden');
        defaultLogo.classList.remove('hidden');

        // Change text color back to white (for transparent background over hero)
        navLinks.forEach(link => {
            if (typeof gsap !== 'undefined') {
                gsap.to(link, {
                    color: '#ffffff',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                link.style.color = '#ffffff';
            }
        });

        // Menu button text should be white when at top (over hero section)
        if (mobileMenuBtn) {
            if (typeof gsap !== 'undefined') {
                gsap.to(mobileMenuBtn, {
                    color: '#ffffff',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                mobileMenuBtn.classList.add('text-white');
                mobileMenuBtn.classList.remove('text-black');
            }
        }

        lastScrollTop = scrollTop;
    }
}

// Use Lenis scroll event if available, otherwise use window scroll
if (typeof Lenis !== 'undefined') {
    // Will be set up after Lenis is initialized
} else {
    window.addEventListener('scroll', handleNavbarScroll);
}

// Initialize on page load
window.addEventListener('load', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop <= 50) {
        defaultLogo.classList.remove('hidden');
        scrollLogo.classList.add('hidden');
    }
});

// ============================================
// Smooth Scroll to Sections with Offset
// ============================================
function smoothScrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    // Calculate offset: 15% of viewport height
    const offset = window.innerHeight * 0.15;

    // Get target position
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

    // Use Lenis if available, otherwise use native smooth scroll
    if (lenis) {
        lenis.scrollTo(targetPosition, {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
    } else {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Handle anchor link clicks for smooth scrolling
function initSmoothScrollLinks() {
    // Get all anchor links in navigation (desktop and mobile)
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (!href || href === '#') return;

            // Prevent default anchor behavior
            e.preventDefault();

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                const isMenuOpen = !mobileMenu.classList.contains('hidden');
                if (isMenuOpen && typeof closeMobileMenu === 'function') {
                    closeMobileMenu();
                }
            }

            // Smooth scroll to target section
            smoothScrollToSection(href);
        });
    });
}

// Initialize smooth scroll links when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScrollLinks);
} else {
    initSmoothScrollLinks();
}

// ============================================
// Mobile Menu Toggle with GSAP
// ============================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');
const menuItems = document.querySelectorAll('.mobile-menu-item');
let isMenuOpen = false;

// Set initial state for mobile menu
if (typeof gsap !== 'undefined' && mobileMenu) {
    gsap.set(mobileMenu, { y: '-100%', display: 'none' });
    gsap.set(menuItems, { opacity: 0, y: 20 });
}

// Toggle mobile menu
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
        if (!isMenuOpen) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    if (isMenuOpen) return;

    isMenuOpen = true;
    mobileMenu.classList.remove('hidden');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');

    // Force close icon to be visible
    if (closeIcon) {
        closeIcon.style.display = 'block';
    }
    if (menuIcon) {
        menuIcon.style.display = 'none';
    }

    // Change button color to black for white menu background
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('text-white');
        mobileMenuBtn.classList.add('text-black', 'fixed', 'top-6', 'right-6', 'z-[10000]');
    }

    document.body.style.overflow = 'hidden'; // Prevent body scroll

    // Animate menu from top to bottom with GSAP
    if (typeof gsap !== 'undefined' && mobileMenu) {
        gsap.to(mobileMenu, {
            y: '0%',
            duration: 0.6,
            ease: 'power3.out',
            display: 'block'
        });

        // Animate menu items with stagger
        gsap.to(menuItems, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.2,
            ease: 'power2.out'
        });
    } else {
        // Fallback if GSAP is not available
        mobileMenu.style.display = 'flex';
    }
}

function closeMobileMenu() {
    if (!isMenuOpen) return;

    isMenuOpen = false;

    if (menuIcon) {
        menuIcon.classList.remove('hidden');
        menuIcon.style.display = 'block';
    }
    if (closeIcon) {
        closeIcon.classList.add('hidden');
        closeIcon.style.display = 'none';
    }

    // Restore button color to white and position
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('text-black', 'fixed', 'top-6', 'right-6', 'z-[10000]');
        mobileMenuBtn.classList.add('text-white');
    }

    document.body.style.overflow = ''; // Restore body scroll

    // Animate menu items out with GSAP
    if (typeof gsap !== 'undefined' && mobileMenu) {
        gsap.to(menuItems, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.in'
        });

        // Animate menu from bottom to top
        gsap.to(mobileMenu, {
            y: '-100%',
            duration: 0.5,
            ease: 'power3.in',
            delay: 0.2,
            onComplete: function () {
                mobileMenu.classList.add('hidden');
            }
        });
    } else {
        // Fallback if GSAP is not available
        mobileMenu.classList.add('hidden');
    }
}

// Close menu when clicking on close button at bottom
if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener('click', function () {
        closeMobileMenu();
    });
}

// Close menu when clicking on navigation links (but not the close button)
if (mobileMenu) {
    mobileMenu.addEventListener('click', function (e) {
        if (e.target.closest('a') && !e.target.closest('#mobile-menu-close-btn')) {
            closeMobileMenu();
        }
    });
}

// Close menu on window resize if it's larger than lg breakpoint
window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024 && isMenuOpen) {
        closeMobileMenu();
    }
});

// Prevent scroll when menu is open
if (mobileMenu) {
    mobileMenu.addEventListener('touchmove', function (e) {
        if (isMenuOpen) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Close menu on escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
    }
});

// ============================================
// GSAP ScrollTrigger Animations
// ============================================

// Wait for DOM and GSAP to be ready
function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(initAnimations, 100);
        return;
    }

    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize Lenis after GSAP is ready
    initLenis();

    // Check if mobile device for reduced motion
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldAnimate = !prefersReducedMotion;

    // Common animation settings
    const defaultDuration = isMobile ? 0.6 : 0.8;
    const defaultEase = 'power2.out';

    // Get all sections for reliable section finding
    const allSections = document.querySelectorAll('section');

    // Parallax effect for hero background (Section 1)
    const heroImage = document.getElementById('slider-image');
    if (heroImage && shouldAnimate) {
        gsap.to(heroImage, {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.s1',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true
            }
        });
    }

    // Hero title animation
    const heroTitle = document.getElementById('slider-title');
    if (heroTitle && shouldAnimate) {
        gsap.from(heroTitle, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: heroTitle,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }

    // Section 2 - Overview Section
    const section2 = document.querySelector('section:nth-of-type(2)');
    if (section2 && shouldAnimate) {
        const section2Content = section2.querySelectorAll('h2, p, img, .flex.flex-col.gap-2');
        gsap.utils.toArray(section2Content).forEach((el, index) => {
            gsap.from(el, {
                opacity: 0,
                y: 40,
                duration: defaultDuration,
                ease: defaultEase,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                },

            });
        });
    }

    // Section 3 - Pillars of a Better Life
    const section3 = document.querySelector('section:nth-of-type(3)');
    if (section3 && shouldAnimate) {
        // Heading animation
        const section3Heading = section3.querySelector('p.font-baskervville');
        if (section3Heading) {
            gsap.from(section3Heading, {
                opacity: 0,
                y: 30,
                duration: defaultDuration,
                ease: defaultEase,
                scrollTrigger: {
                    trigger: section3Heading,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // Pillar cards animation with stagger
        const pillarCards = section3.querySelectorAll('.flex.flex-col.justify-between.items-center.gap-4');
        if (pillarCards.length > 0) {
            gsap.from(pillarCards, {
                opacity: 0,
                y: 50,
                duration: defaultDuration,
                ease: defaultEase,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: pillarCards[0],
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // Curated Amenities heading
        const curatedHeading = section3.querySelector('h3.font-baskervville');
        if (curatedHeading) {
            gsap.from(curatedHeading, {
                opacity: 0,
                y: 30,
                duration: defaultDuration,
                ease: defaultEase,
                scrollTrigger: {
                    trigger: curatedHeading,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // Amenity cards animation
        const amenityCards = section3.querySelectorAll('.amenity-card');
        if (amenityCards.length > 0) {
            gsap.from(amenityCards, {
                opacity: 0,
                y: 60,
                scale: 0.95,
                duration: defaultDuration,
                ease: defaultEase,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: amenityCards[0],
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }
    }

    // Section 4 - Location Advantage
    const section4 = Array.from(allSections).find(section =>
        section.textContent.includes('Location Advantage') ||
        section.classList.toString().includes('BF4423')
    );
    if (section4 && shouldAnimate) {
        // Heading animation
        const section4Headings = section4.querySelectorAll('h3, p.font-baskervville');
        gsap.from(section4Headings, {
            opacity: 0,
            y: 30,
            duration: defaultDuration,
            ease: defaultEase,
            stagger: 0.1,
            scrollTrigger: {
                trigger: section4Headings[0],
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Location images and grid
        const locationContent = section4.querySelectorAll('img, .flex.flex-col');
        gsap.from(locationContent, {
            opacity: 0,
            y: 40,
            duration: defaultDuration,
            ease: defaultEase,
            stagger: 0.15,
            scrollTrigger: {
                trigger: locationContent[0],
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    }

    // Section 5 - Layouts & Planning
    const section5 = document.querySelector('section:nth-of-type(5)');
    if (section5 && shouldAnimate) {
        // Heading animation
        const section5Heading = section5.querySelector('h3');
        if (section5Heading) {
            gsap.from(section5Heading, {
                opacity: 0,
                y: 30,
                duration: defaultDuration,
                ease: defaultEase,
                scrollTrigger: {
                    trigger: section5Heading,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // Master plan image and list
        const masterPlanContent = section5.querySelectorAll('img, h4, ul');
        gsap.from(masterPlanContent, {
            opacity: 0,
            x: isMobile ? 0 : -30,
            duration: defaultDuration,
            ease: defaultEase,
            stagger: 0.1,
            scrollTrigger: {
                trigger: masterPlanContent[0],
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    }

    // Section 6 - Unit Layout
    const section6 = Array.from(allSections).find(section =>
        section.textContent.includes('Unit Layout') ||
        section.classList.toString().includes('F7EEE6')
    );
    if (section6 && shouldAnimate) {
        // Heading animation
        const section6Heading = section6.querySelector('h3');
        if (section6Heading) {
            gsap.from(section6Heading, {
                opacity: 0,
                y: 30,
                duration: defaultDuration,
                ease: defaultEase,
                scrollTrigger: {
                    trigger: section6Heading,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // Layout images
        const layoutImages = section6.querySelectorAll('img[alt*="BHK"]');
        gsap.from(layoutImages, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: defaultDuration,
            ease: defaultEase,
            stagger: 0.2,
            scrollTrigger: {
                trigger: layoutImages[0],
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Button animation
        const section6Button = section6.querySelector('button');
        if (section6Button) {
            gsap.from(section6Button, {
                opacity: 0,
                y: 20,
                duration: defaultDuration,
                ease: defaultEase,
                scrollTrigger: {
                    trigger: section6Button,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }
    }

    // Section 7 - Trust & Governance
    const section7 = document.querySelector('section:nth-of-type(7)');
    if (section7 && shouldAnimate) {
        // Text content animation
        const section7Text = section7.querySelectorAll('h2, p');
        gsap.from(section7Text, {
            opacity: 0,
            y: 30,
            duration: defaultDuration,
            ease: defaultEase,
            stagger: 0.1,
            scrollTrigger: {
                trigger: section7Text[0],
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Image animation
        const section7Image = section7.querySelector('img');
        if (section7Image) {
            gsap.from(section7Image, {
                opacity: 0,
                scale: 0.9,
                duration: defaultDuration + 0.2,
                ease: defaultEase,
                scrollTrigger: {
                    trigger: section7Image,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }
    }

    // Section 8 - Featured Project (Form Section)
    const section8 = document.getElementById('featured-project');
    if (section8 && shouldAnimate) {
        // Form container
        const formContainer = section8.querySelector('#sec4-form');
        if (formContainer) {
            gsap.from(formContainer, {
                opacity: 0,
                x: isMobile ? 0 : -50,
                duration: defaultDuration,
                ease: defaultEase,
                scrollTrigger: {
                    trigger: formContainer,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // Cards animation
        const section8Cards = section8.querySelectorAll('#sec4-card1, #sec4-card2, #sec4-card3');
        gsap.from(section8Cards, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: defaultDuration,
            ease: defaultEase,
            stagger: 0.15,
            scrollTrigger: {
                trigger: section8Cards[0],
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    }

    // Footer animations
    const footer = document.getElementById('footer');
    if (footer && shouldAnimate) {
        const footerContent = footer.querySelectorAll('#footer-row1 > *, #footer-row2 > *');
        gsap.from(footerContent, {
            opacity: 0,
            y: 30,
            duration: defaultDuration,
            ease: defaultEase,
            stagger: 0.1,
            scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    }

    // Refresh ScrollTrigger after all animations are set up
    ScrollTrigger.refresh();

    // Refresh on resize for responsive behavior
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

// ============================================
// Amenity Cards Hover Animation with GSAP
// ============================================
function initAmenityCardsHover() {
    if (typeof gsap === 'undefined') {
        setTimeout(initAmenityCardsHover, 100);
        return;
    }

    const amenityCards = document.querySelectorAll('.amenity-card');

    if (!amenityCards.length) {
        return;
    }

    // Process each card individually
    amenityCards.forEach(card => {
        const overlay = card.querySelector('.amenity-hover-overlay');
        const title = card.querySelector('.amenity-title');

        if (!overlay || !title) return;

        // Set initial state
        // Overlay starts from bottom (hidden below)
        gsap.set(overlay, {
            y: '100%', // Start from bottom (fully below the card)
            opacity: 0
        });

        // Title starts visible at bottom
        gsap.set(title, {
            y: '0%',
            opacity: 1
        });

        // Create hover timeline: title hides (slides down) -> overlay shows (slides up)
        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline
            .to(title, {
                y: '100%', // Slide title down to hide
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in'
            })
            .to(overlay, {
                y: '0%', // Slide overlay up to show (starts after title is completely hidden)
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            }, '-=0.1'); // Start slightly before title animation ends for faster transition

        // Create leave timeline: overlay hides (slides down) -> title shows (slides up)
        const leaveTimeline = gsap.timeline({ paused: true });
        leaveTimeline
            .to(overlay, {
                y: '100%', // Slide overlay down to hide
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in'
            })
            .to(title, {
                y: '0%', // Slide title up to show (starts after overlay is completely hidden)
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            }, '-=0.1'); // Start slightly before overlay animation ends for faster transition

        card.addEventListener('mouseenter', function () {
            // Stop leave timeline if it's playing and restart hover timeline
            if (leaveTimeline.isActive()) {
                leaveTimeline.kill();
                // Reset to starting state for hover
                gsap.set(overlay, { y: '100%', opacity: 0 });
                gsap.set(title, { y: '0%', opacity: 1 });
            }
            hoverTimeline.restart();
        });

        card.addEventListener('mouseleave', function () {
            // Stop hover timeline if it's playing and restart leave timeline
            if (hoverTimeline.isActive()) {
                hoverTimeline.kill();
                // Reset to starting state for leave
                gsap.set(title, { y: '100%', opacity: 0 });
                gsap.set(overlay, { y: '0%', opacity: 1 });
            }
            leaveTimeline.restart();
        });
    });
}

// Initialize amenity cards hover when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAmenityCardsHover);
} else {
    initAmenityCardsHover();
}

// ============================================
// Enquiry Popup Modal Functionality
// ============================================
function initEnquiryPopup() {
    const popup = document.getElementById('enquiry-popup');
    const popupContent = document.getElementById('popup-content');
    const popupCloseBtn = document.getElementById('popup-close-btn');
    const popupOverlay = document.getElementById('popup-overlay');
    const triggerButtons = document.querySelectorAll('.enquiry-popup-trigger');

    if (!popup || !popupContent) return;

    // Function to open popup
    function openPopup() {
        popup.classList.remove('hidden');
        popup.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevent background scroll

        // Animate popup content with GSAP if available
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(popupContent,
                { scale: 0.95, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
        } else {
            // Fallback CSS animation
            setTimeout(() => {
                popupContent.classList.remove('scale-95', 'opacity-0');
                popupContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }
    }

    // Function to close popup
    function closePopup() {
        // Animate popup content out with GSAP if available
        if (typeof gsap !== 'undefined') {
            gsap.to(popupContent, {
                scale: 0.95,
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    popup.classList.add('hidden');
                    popup.classList.remove('flex');
                    document.body.style.overflow = ''; // Restore background scroll
                }
            });
        } else {
            // Fallback CSS animation
            popupContent.classList.add('scale-95', 'opacity-0');
            popupContent.classList.remove('scale-100', 'opacity-100');
            setTimeout(() => {
                popup.classList.add('hidden');
                popup.classList.remove('flex');
                document.body.style.overflow = ''; // Restore background scroll
            }, 200);
        }
    }

    // Add click event listeners to trigger buttons
    triggerButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            openPopup();
        });
    });

    // Close button click handler
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', closePopup);
    }

    // Overlay click handler (close when clicking outside)
    if (popupOverlay) {
        popupOverlay.addEventListener('click', closePopup);
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
            closePopup();
        }
    });

    // Auto-open popup after 7 seconds (only once per session)
    const hasAutoOpened = sessionStorage.getItem('enquiry-popup-auto-opened');
    if (!hasAutoOpened) {
        setTimeout(() => {
            openPopup();
            sessionStorage.setItem('enquiry-popup-auto-opened', 'true');
        }, 7000); // 7 seconds
    }
}

// Initialize enquiry popup when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnquiryPopup);
} else {
    initEnquiryPopup();
}

// ============================================
// Country Code Data and Functions
// ============================================
const countryCodes = [
    { "country": "India", "code": "+91", "value": "91" },
    { "country": "Pakistan", "code": "+92", "value": "92" },
    { "country": "Bangladesh", "code": "+880", "value": "880" },
    { "country": "Sri Lanka", "code": "+94", "value": "94" },
    { "country": "Nepal", "code": "+977", "value": "977" },
    { "country": "China", "code": "+86", "value": "86" },
    { "country": "Japan", "code": "+81", "value": "81" },
    { "country": "South Korea", "code": "+82", "value": "82" },
    { "country": "Thailand", "code": "+66", "value": "66" },
    { "country": "Malaysia", "code": "+60", "value": "60" },
    { "country": "Singapore", "code": "+65", "value": "65" },
    { "country": "Indonesia", "code": "+62", "value": "62" },
    { "country": "Philippines", "code": "+63", "value": "63" },
    { "country": "Vietnam", "code": "+84", "value": "84" },
    { "country": "Afghanistan", "code": "+93", "value": "93" },
    { "country": "Saudi Arabia", "code": "+966", "value": "966" },
    { "country": "United Arab Emirates", "code": "+971", "value": "971" },
    { "country": "Qatar", "code": "+974", "value": "974" },
    { "country": "Kuwait", "code": "+965", "value": "965" },
    { "country": "Oman", "code": "+968", "value": "968" },
    { "country": "Bahrain", "code": "+973", "value": "973" },
    { "country": "Iran", "code": "+98", "value": "98" },
    { "country": "Iraq", "code": "+964", "value": "964" },
    { "country": "Israel", "code": "+972", "value": "972" },
    { "country": "Jordan", "code": "+962", "value": "962" },
    { "country": "Lebanon", "code": "+961", "value": "961" },
    { "country": "Yemen", "code": "+967", "value": "967" },
    { "country": "United Kingdom", "code": "+44", "value": "44" },
    { "country": "Germany", "code": "+49", "value": "49" },
    { "country": "France", "code": "+33", "value": "33" },
    { "country": "Italy", "code": "+39", "value": "39" },
    { "country": "Spain", "code": "+34", "value": "34" },
    { "country": "Netherlands", "code": "+31", "value": "31" },
    { "country": "Belgium", "code": "+32", "value": "32" },
    { "country": "Switzerland", "code": "+41", "value": "41" },
    { "country": "Austria", "code": "+43", "value": "43" },
    { "country": "Sweden", "code": "+46", "value": "46" },
    { "country": "Norway", "code": "+47", "value": "47" },
    { "country": "Denmark", "code": "+45", "value": "45" },
    { "country": "Poland", "code": "+48", "value": "48" },
    { "country": "Russia", "code": "+7", "value": "7" },
    { "country": "United States", "code": "+1", "value": "1" },
    { "country": "Canada", "code": "+1", "value": "1" },
    { "country": "Mexico", "code": "+52", "value": "52" },
    { "country": "Brazil", "code": "+55", "value": "55" },
    { "country": "Argentina", "code": "+54", "value": "54" },
    { "country": "Chile", "code": "+56", "value": "56" },
    { "country": "Colombia", "code": "+57", "value": "57" },
    { "country": "Peru", "code": "+51", "value": "51" },
    { "country": "Venezuela", "code": "+58", "value": "58" },
    { "country": "Uruguay", "code": "+598", "value": "598" },
    { "country": "Paraguay", "code": "+595", "value": "595" },
    { "country": "Bolivia", "code": "+591", "value": "591" }
];

/**
 * Populate country code dropdown
 * @param {HTMLElement} selectElement - The select element to populate
 * @param {string} defaultValue - Default country code value (default: "91" for India)
 */
function populateCountryCodeDropdown(selectElement, defaultValue = "91") {
    if (!selectElement) return;

    // Clear existing options
    selectElement.innerHTML = '';

    // Sort countries alphabetically by country name
    const sortedCountries = [...countryCodes].sort((a, b) => {
        return a.country.localeCompare(b.country);
    });

    // Add options with country name and code
    sortedCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.value;
        // Display format: "Country Name +Code" (e.g., "India +91")
        option.textContent = `${country.country} ${country.code}`;
        option.setAttribute('data-code', country.code);
        option.setAttribute('data-country', country.country);
        selectElement.appendChild(option);
    });

    // Set default to India (+91)
    selectElement.value = defaultValue;
}

/**
 * Initialize country code dropdowns
 */
function initCountryCodeDropdowns() {
    const callbackCountryCode = document.getElementById('callback-country-code');
    const popupCountryCode = document.getElementById('popup-country-code');

    if (callbackCountryCode) {
        populateCountryCodeDropdown(callbackCountryCode, "91");
    }

    if (popupCountryCode) {
        populateCountryCodeDropdown(popupCountryCode, "91");
    }
}

/**
 * Format phone number with country code
 * @param {string} countryCodeValue - Country code value (e.g., "91")
 * @param {string} phoneNumber - Phone number without country code
 * @returns {string} Formatted phone number (e.g., "91-1234567890")
 */
function formatPhoneNumberWithCountryCode(countryCodeValue, phoneNumber) {
    if (!phoneNumber) return '';

    // Remove any spaces, dashes, or special characters, but keep all digits
    let cleanPhone = phoneNumber.replace(/[^\d]/g, '');

    // Remove leading country code if user accidentally included it
    // Check if phone starts with the selected country code
    if (cleanPhone.startsWith(countryCodeValue)) {
        cleanPhone = cleanPhone.substring(countryCodeValue.length);
    }

    // Format as "91-00000000" (numeric value only, no + sign)
    return `${countryCodeValue}-${cleanPhone}`;
}

// Initialize country code dropdowns when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountryCodeDropdowns);
} else {
    initCountryCodeDropdowns();
}

/**
 * Validate phone input to allow only numbers
 * @param {HTMLElement} inputElement - The phone input element
 */
function validatePhoneInput(inputElement) {
    if (!inputElement) return;

    inputElement.addEventListener('input', function (e) {
        // Remove any non-numeric characters
        const value = e.target.value.replace(/[^\d]/g, '');

        // Update the input value with only numbers
        if (e.target.value !== value) {
            e.target.value = value;
        }
    });

    // Also prevent paste of non-numeric characters
    inputElement.addEventListener('paste', function (e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const numericOnly = pastedText.replace(/[^\d]/g, '');

        // Get current cursor position
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const currentValue = this.value;

        // Insert numeric text at cursor position
        this.value = currentValue.substring(0, start) + numericOnly + currentValue.substring(end);

        // Set cursor position after inserted text
        this.setSelectionRange(start + numericOnly.length, start + numericOnly.length);
    });
}

/**
 * Initialize phone input validation for all phone fields
 */
function initPhoneInputValidation() {
    const callbackPhone = document.getElementById('callback-phone');
    const popupPhone = document.getElementById('popup-phone');

    if (callbackPhone) {
        validatePhoneInput(callbackPhone);
    }

    if (popupPhone) {
        validatePhoneInput(popupPhone);
    }
}

// Initialize phone input validation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhoneInputValidation);
} else {
    initPhoneInputValidation();
}

// ============================================
// Form Submission Handler for Google Sheets
// ============================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbgQFvYkV6GbTJeA3KVeS-wPVQiuslC40zreZLHJKB2x7J-xpHvnP7elkqZSZTGjhA/exec';

// ============================================
// Popup Control Functions
// ============================================

/**
 * Show loader popup
 */
function showLoader() {
    const loader = document.getElementById('loader-popup');
    if (loader) {
        loader.classList.remove('hidden');
        loader.classList.add('flex', 'active');
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(loader, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
    }
}

/**
 * Hide loader popup
 */
function hideLoader() {
    const loader = document.getElementById('loader-popup');
    if (loader) {
        if (typeof gsap !== 'undefined') {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    loader.classList.add('hidden');
                    loader.classList.remove('flex', 'active');
                }
            });
        } else {
            loader.classList.add('hidden');
            loader.classList.remove('flex', 'active');
        }
    }
}

/**
 * Show error popup with message
 */
function showErrorPopup(message = 'Something went wrong. Please try again.') {
    const errorPopup = document.getElementById('error-popup');
    const errorMessage = document.getElementById('error-popup-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    if (errorPopup) {
        errorPopup.classList.remove('hidden');
        errorPopup.classList.add('flex', 'active');
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(errorPopup,
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
            );
        }
    }
}

/**
 * Hide error popup
 */
function hideErrorPopup() {
    const errorPopup = document.getElementById('error-popup');
    if (errorPopup) {
        if (typeof gsap !== 'undefined') {
            gsap.to(errorPopup, {
                scale: 0.9,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    errorPopup.classList.add('hidden');
                    errorPopup.classList.remove('flex', 'active');
                }
            });
        } else {
            errorPopup.classList.add('hidden');
            errorPopup.classList.remove('flex', 'active');
        }
    }
}

// Initialize popup close buttons
function initPopupCloseButtons() {
    const errorClose = document.getElementById('error-popup-close');

    if (errorClose) {
        errorClose.addEventListener('click', hideErrorPopup);
    }

    // Close on overlay click
    const errorPopup = document.getElementById('error-popup');

    if (errorPopup) {
        errorPopup.addEventListener('click', (e) => {
            if (e.target === errorPopup) {
                hideErrorPopup();
            }
        });
    }
}

// Initialize popup close buttons when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopupCloseButtons);
} else {
    initPopupCloseButtons();
}

/**
 * Universal function to submit form data to Google Sheets
 * @param {HTMLFormElement} form - The form element to submit
 * @param {string} sheetName - The name of the Google Sheet tab to write to
 * @param {Object} options - Optional configuration
 * @param {Function} options.onSuccess - Callback function on successful submission
 * @param {Function} options.onError - Callback function on error
 */
async function submitToGoogleSheets(form, sheetName, options = {}) {
    // Validate inputs
    if (!form || !sheetName) {
        console.error('Form and sheetName are required');
        return;
    }

    if (!GOOGLE_SCRIPT_URL) {
        console.error('Google Script URL not configured');
        return;
    }

    // Silent submission - no UI changes, no error handling

    try {
        // Collect form data
        const formData = new FormData(form);
        const data = {};

        // Convert FormData to object
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Format phone number with country code
        // Check if this form has a country code selector
        const countryCodeSelect = form.querySelector('select[name="CountryCode"]');
        const phoneInput = form.querySelector('input[name="Phone"]');

        if (countryCodeSelect && phoneInput) {
            const countryCodeValue = countryCodeSelect.value || "91";
            // Get the full phone number value directly from the input
            const phoneNumber = phoneInput.value.trim();

            // Only format if phone number exists
            if (phoneNumber) {
                // Format phone number as "91-00000000" (numeric value only, no + sign)
                data.Phone = formatPhoneNumberWithCountryCode(countryCodeValue, phoneNumber);
            }

            // Keep country code value separate (numeric value only, no + sign)
            data.CountryCode = countryCodeValue;
        }

        // Add Date and Time in Indian format (IST - Indian Standard Time)
        // IST is UTC+5:30
        const now = new Date();

        // Get UTC time components
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
        // Add IST offset (5 hours 30 minutes = 5.5 * 60 * 60 * 1000 milliseconds)
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(utcTime + istOffset);

        // Format Date as DD/MM/YYYY (Indian format)
        const day = String(istTime.getDate()).padStart(2, '0');
        const month = String(istTime.getMonth() + 1).padStart(2, '0');
        const year = istTime.getFullYear();
        data.Date = `${day}/${month}/${year}`;

        // Format Time as HH:MM:SS (24-hour format, IST)
        const hours = String(istTime.getHours()).padStart(2, '0');
        const minutes = String(istTime.getMinutes()).padStart(2, '0');
        const seconds = String(istTime.getSeconds()).padStart(2, '0');
        data.Time = `${hours}:${minutes}:${seconds}`;

        // Add sheetName to data
        data.sheetName = 'Sheet1';

        // Convert data to URL-encoded format (as expected by Google Apps Script)
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
            // Always include Date, Time, and sheetName even if empty
            if (key === 'Date' || key === 'Time' || key === 'sheetName') {
                params.append(key, data[key] || '');
            } else if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
                params.append(key, data[key]);
            }
        });

        // Debug: Log all params being sent
        console.log('Form data being sent:', Object.fromEntries(params));

        // Try to send POST request with CORS first (if enabled in Google Apps Script)
        let response;
        let submissionSuccess = false;

        try {
            // Try with CORS enabled (if Google Apps Script has CORS headers)
            response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString()
            });

            if (response.ok) {
                const result = await response.json();
                if (result.result === 'success') {
                    submissionSuccess = true;
                } else {
                    throw new Error(result.error?.message || 'Submission failed');
                }
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (corsError) {
            // If CORS fails, try with no-cors mode (assumes success if no network error)
            console.log('CORS not enabled, using no-cors mode:', corsError);
            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString()
                });
                // With no-cors, we assume success if no network error
                submissionSuccess = true;
            } catch (networkError) {
                throw networkError;
            }
        }

        if (!submissionSuccess) {
            console.error('Google Sheets submission failed silently');
        } else {
            console.log('Google Sheets submission successful (silent)');
        }

    } catch (error) {
        // Silent error - just log it
        console.error('Error submitting form to Google Sheets (silent):', error);
    }
}

// ============================================
// CRM Submission Functions
// ============================================
const CRM_BASE_URL = 'https://crm.fgpindia.in/WebCreate.aspx';
const PROJECT_NAME = 'Fab Luxe Residences';

/**
 * Generate a unique lead ID
 * @returns {string} Unique lead ID
 */
function generateUniqueId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `LEAD-${timestamp}-${random}`;
}

/**
 * Get clean URL without http:// and query string
 * @returns {string} Clean URL
 */
function getCleanUrl() {
    const url = window.location.href;
    // Remove protocol (http:// or https://)
    let cleanUrl = url.replace(/^https?:\/\//, '');
    // Remove query string
    cleanUrl = cleanUrl.split('?')[0];
    return cleanUrl;
}

/**
 * Extract UTM parameters from URL
 * @returns {Object} Object with UTM parameters
 */
function getUtmParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        source: urlParams.get('utm_source') || '',
        campaign: urlParams.get('utm_campaign') || '',
        medium: urlParams.get('utm_medium') || '',
        keyword: urlParams.get('utm_keyword') || ''
    };
}

/**
 * Get phone number without country code (for CRM @mob parameter)
 * @param {string} phoneNumber - Full phone number
 * @param {string} countryCodeValue - Country code value
 * @returns {string} Phone number without country code
 */
function getPhoneWithoutCountryCode(phoneNumber, countryCodeValue) {
    if (!phoneNumber) return '';

    // Remove all non-numeric characters
    let cleanPhone = phoneNumber.replace(/[^\d]/g, '');

    // Remove country code if it's at the start
    if (cleanPhone.startsWith(countryCodeValue)) {
        cleanPhone = cleanPhone.substring(countryCodeValue.length);
    }

    return cleanPhone;
}

/**
 * Submit form data to CRM
 * @param {HTMLFormElement} form - The form element
 * @param {Object} formData - Form data object
 */
async function submitToCRM(form, formData) {
    // Get submit button for UI control
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : '';
    const originalBtnBg = submitBtn ? submitBtn.style.backgroundColor : '';
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    const hasImage = submitBtn ? submitBtn.querySelector('img') : null;

    // Disable submit button and show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        if (!hasImage) {
            submitBtn.textContent = 'Submitting...';
        } else {
            if (submitBtn.style) {
                submitBtn.style.opacity = '0.5';
            }
        }
        if (submitBtn.style) {
            submitBtn.style.cursor = 'not-allowed';
        }
    }

    // Show loader popup
    showLoader();

    try {
        // Get country code and phone number
        const countryCodeSelect = form.querySelector('select[name="CountryCode"]');
        const phoneInput = form.querySelector('input[name="Phone"]');

        // Extract required fields
        const isd = countryCodeSelect ? (countryCodeSelect.value || '91') : '91';
        // Get phone number directly from input field (not from formData which might be formatted)
        const phoneNumber = phoneInput ? phoneInput.value.trim() : '';
        const mob = getPhoneWithoutCountryCode(phoneNumber, isd);
        const email = formData.Email || '';
        const name = (formData.Name || '').trim();
        const city = formData.City || '';
        const location = formData.Location || '';
        const project = PROJECT_NAME;
        const remark = formData.Message || '';
        const uniqueId = generateUniqueId();
        const url = getCleanUrl();
        const utmParams = getUtmParameters();

        // Debug logging
        console.log('CRM Submission Data:', {
            isd,
            mob,
            phoneNumber,
            email,
            name,
            project,
            uniqueId,
            hasPhoneInput: !!phoneInput,
            phoneInputValue: phoneInput ? phoneInput.value : 'N/A'
        });

        // Validate mandatory fields
        if (!isd || !mob || !project || !uniqueId) {
            console.warn('CRM submission skipped: Missing mandatory fields', {
                isd: !!isd,
                mob: !!mob,
                mobValue: mob,
                project: !!project,
                uniqueId: !!uniqueId,
                phoneNumber: phoneNumber
            });
            return;
        }

        // Additional validation: ensure mob has at least some digits
        if (mob.length === 0) {
            console.warn('CRM submission skipped: Mobile number is empty after processing');
            return;
        }

        // Build CRM URL with parameters
        const crmParams = new URLSearchParams({
            UID: 'fourqt',
            PWD: 'wn9mxO76f34=',
            Channel: 'MS',
            Src: 'Website',
            ISD: isd,
            Mob: mob,
            Email: email,
            name: name,
            City: city,
            Location: location,
            Project: project,
            Remark: remark,
            url: url,
            UniqueId: 0,
            fld1: utmParams.source,
            fld2: utmParams.campaign,
            fld3: utmParams.medium,
            fld4: utmParams.keyword
        });

        // Build the complete CRM URL
        const crmUrl = `${CRM_BASE_URL}?${crmParams.toString()}`;

        console.log('CRM URL:', crmUrl);
        console.log('Sending data to CRM...');
        console.log('Data being sent:', {
            ISD: isd,
            Mob: mob,
            Email: email,
            Name: name,
            Project: project,
            UniqueId: uniqueId
        });

        // Simple fetch request
        const response = await fetch(crmUrl, {
            method: 'GET'
        });

        console.log('CRM Response:', response);
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('OK:', response.ok);

        // Check if request was successful (status 200 or 0 for no-cors)
        if (response.status === 200 || response.status === 0) {
            // Try to read response
            try {
                const responseText = await response.text();
                console.log('Response Text:', responseText);
            } catch (e) {
                console.log('Cannot read response (normal for cross-origin)');
            }

            // Hide loader
            hideLoader();

            // Close enquiry popup if it's open (for enquiry form)
            const isEnquiryForm = form.id === 'enquiry-form';
            if (isEnquiryForm) {
                const enquiryPopup = document.getElementById('enquiry-popup');
                const popupContent = document.getElementById('popup-content');
                if (enquiryPopup && !enquiryPopup.classList.contains('hidden')) {
                    // Close popup with animation
                    if (typeof gsap !== 'undefined' && popupContent) {
                        gsap.to(popupContent, {
                            scale: 0.9,
                            opacity: 0,
                            y: 50,
                            duration: 0.3,
                            ease: 'power2.in'
                        });
                        gsap.to(enquiryPopup, {
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.in',
                            delay: 0.1,
                            onComplete: () => {
                                enquiryPopup.classList.remove('active', 'flex');
                                enquiryPopup.classList.add('hidden');
                                document.body.style.overflow = '';
                            }
                        });
                    } else {
                        // Fallback: just hide it
                        enquiryPopup.classList.add('hidden');
                        enquiryPopup.classList.remove('flex', 'active');
                        document.body.style.overflow = '';
                    }
                }
            }

            // Navigate to thank you page after successful submission
            setTimeout(() => {
                window.location.href = 'thankyou.html';
            }, isEnquiryForm ? 400 : 300);

            console.log('✅ CRM data sent successfully!');
        } else {
            throw new Error(`CRM submission failed with status: ${response.status}`);
        }

    } catch (error) {
        console.error('Error submitting to CRM:', error);

        // Hide loader
        hideLoader();

        // Show error popup
        const errorMessage = error.message || 'There was an error submitting the form. Please try again later.';
        showErrorPopup(errorMessage);

        // Reset button
        if (submitBtn) {
            if (hasImage && originalBtnHtml) {
                submitBtn.innerHTML = originalBtnHtml;
            } else {
                submitBtn.textContent = originalBtnText;
            }
            submitBtn.style.backgroundColor = originalBtnBg;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = '';
        }
    }
}

// ============================================
// Initialize All Forms
// ============================================

// Initialize Enquiry Form (Popup Form)
function initEnquiryForm() {
    const enquiryForm = document.getElementById('enquiry-form');
    if (!enquiryForm) return;

    enquiryForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Basic validation
        if (!enquiryForm.checkValidity()) {
            enquiryForm.reportValidity();
            return;
        }

        // Collect form data for CRM
        const formData = new FormData(enquiryForm);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Format phone number with country code for Google Sheets
        const countryCodeSelect = enquiryForm.querySelector('select[name="CountryCode"]');
        const phoneInput = enquiryForm.querySelector('input[name="Phone"]');

        if (countryCodeSelect && phoneInput && data.Phone) {
            const countryCodeValue = countryCodeSelect.value || "91";
            const phoneNumber = phoneInput.value.trim();

            if (phoneNumber) {
                data.Phone = formatPhoneNumberWithCountryCode(countryCodeValue, phoneNumber);
            }
            data.CountryCode = countryCodeValue;
        }

        // Submit to CRM first (this controls UI - loader, errors, navigation)
        await submitToCRM(enquiryForm, data);

        // Submit to Google Sheets silently in background (no UI changes)
        submitToGoogleSheets(enquiryForm, 'Enquiry').catch(err => {
            console.error('Silent Google Sheets submission error:', err);
        });
    });
}

// Initialize Callback Form
function initCallbackForm() {
    const callbackForm = document.getElementById('callback-form');
    if (!callbackForm) return;

    callbackForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Basic validation
        if (!callbackForm.checkValidity()) {
            callbackForm.reportValidity();
            return;
        }

        // Collect form data for CRM
        const formData = new FormData(callbackForm);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Format phone number with country code for Google Sheets
        const countryCodeSelect = callbackForm.querySelector('select[name="CountryCode"]');
        const phoneInput = callbackForm.querySelector('input[name="Phone"]');

        if (countryCodeSelect && phoneInput && data.Phone) {
            const countryCodeValue = countryCodeSelect.value || "91";
            const phoneNumber = phoneInput.value.trim();

            if (phoneNumber) {
                data.Phone = formatPhoneNumberWithCountryCode(countryCodeValue, phoneNumber);
            }
            data.CountryCode = countryCodeValue;
        }

        // Submit to CRM first (this controls UI - loader, errors, navigation)
        await submitToCRM(callbackForm, data);

        // Submit to Google Sheets silently in background (no UI changes)
        submitToGoogleSheets(callbackForm, 'Callback').catch(err => {
            console.error('Silent Google Sheets submission error:', err);
        });
    });
}

// Initialize Footer Email Form
function initFooterEmailForm() {
    const footerForm = document.getElementById('footer-email-form');
    if (!footerForm) return;

    footerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const emailInput = document.getElementById('footer-email-input');
        const email = emailInput.value.trim();

        // Validate email
        if (!email) {
            showErrorPopup('Please enter your email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showErrorPopup('Please enter a valid email address.');
            return;
        }

        // Create a temporary form data object for footer form
        // Footer form needs special handling - add "Footer Enquiry" as message
        const tempForm = document.createElement('form');
        const nameInput = document.createElement('input');
        nameInput.type = 'hidden';
        nameInput.name = 'Name';
        nameInput.value = email.split('@')[0] || 'Footer Subscriber';

        const emailInputField = document.createElement('input');
        emailInputField.type = 'hidden';
        emailInputField.name = 'Email';
        emailInputField.value = email;

        const phoneInput = document.createElement('input');
        phoneInput.type = 'hidden';
        phoneInput.name = 'Phone';
        phoneInput.value = 'N/A';

        const messageInput = document.createElement('input');
        messageInput.type = 'hidden';
        messageInput.name = 'Message';
        messageInput.value = 'Footer Enquiry';

        tempForm.appendChild(nameInput);
        tempForm.appendChild(emailInputField);
        tempForm.appendChild(phoneInput);
        tempForm.appendChild(messageInput);

        // Submit to Google Sheets with sheet name "Footer"
        await submitToGoogleSheets(tempForm, 'Footer', {
            onSuccess: (data) => {
                console.log('Footer form submitted successfully:', data);
                // Clear the input
                emailInput.value = '';
            },
            onError: (error) => {
                console.error('Error submitting footer form:', error);
            }
        });
    });
}

// Initialize all forms when DOM is ready
function initAllForms() {
    initEnquiryForm();
    initCallbackForm();
    initFooterEmailForm();
}

// Initialize forms when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllForms);
} else {
    initAllForms();
}

// Tab Content Data
const tabContentData = [
    {
        desination: "Chairman",
        name: "Arun Kumar Sharma",
        image: "img/founders/fond11.jpg",
        content: `He is a retired senior Indian Police Services (IPS) officer from the 1987 batch, Gujarat cadre, who has served in various positions including Additional Director of the Central Bureau of Investigation (CBI). He has held several positions of distinction and important responsibilities and has a remarkable record of service. He has been honoured with the President’s Police Medal for Distinguished Service and awarded the Indian Police Medal for Meritorious Service.  <br><br>

With over 34 years of expertise, he has held a pivotal role in investigations of bank and security fraud cases and also played an important advisory role in stressed asset management. He has attained specialisation in restructuring, management, and recovery of distressed assets. His acumen in strategy and planning serves as a guiding force for the organisation and helps in formulating optimal future action plans. <br><br>

He also lends his expertise in engaging with law enforcement agencies, adeptly addressing jurisdictional issues and overcoming roadblocks to expedite ongoing matters within the organisation. His extensive experience includes effectively managing public order and contributing to decision-making on vigilance and policy matters. He is currently handling and demonstrating a profound interest and active involvement in the real estate sector, which is the second-largest economy in India.`
    },
    {
        desination: "Chairman",
        desination2: "(Project Development)",
        name: "Avdhesh Kumar Goel",
        image: "img/founders/fond44.jpg",
        content: `Dynamic executive leader with more than 35 years of distinguished expertise spanning finance, regulatory compliance, corporate governance, strategic project management, and real estate development. A highly accomplished Chartered Accountant, Cost & Works Accountant, and Company Secretary, Mr. Goel has provided strategic financial advisory, audit, and restructuring services to many renowned multinational and Indian corporations.  <br><br>
        
        Since transitioning into real estate in 2006, he has strategically shaped successful residential, commercial, IT, and farmhouse projects. With comprehensive experience in project development and marketing, Mr. Goel excels at overseeing end-to-end execution of complex developments, emphasizing financial efficiency and innovative, market-relevant solutions.  <br><br>
He brings in the Core Competencies of Strategic Leadership & Corporate Governance, Real Estate Development & Project Management, Financial Analysis & Risk Management, Stakeholder Engagement & Partnership Building, Business Structuring & Regulatory Compliance, Investment Strategy & Capital Markets. <br><br>
He brings in deep expertise in financial advisory, regulatory compliance, and corporate governance, followed by more than 20 years in real estate development and project leadership. He has led development of innovative residential, commercial, IT space, and farmhouse projects in Delhi NCR region with a focus on market-driven growth and expansion. He specializes in distressed asset acquisitions, land aggregation, legal documentation of real estate projects, and investment advisory, consistently delivering high-impact urban development projects.

        `
    },
    {
        desination: "Director",
        name: "Mona Vij",
        image: "img/founders/fond21.jpg",
        content: `
       With over 25 years of extensive and diverse experience, she has worked in real estate, project management, marketing communication, and brand and business development. She has consistently demonstrated success in formulating strategies for brand launches and establishing a strong market presence, along with creating aspirational brand images post-launch.  <br><br>

She is strong in innovation, having pioneered the concept of in-film movie tie-ups at India's leading telecom operator, Airtel—a concept that was subsequently adopted by others within and beyond the industry. Additionally, she has established an international initiative that fosters innovation in the telecom sector among youth and has several other groundbreaking initiatives to her credit. <br><br>

In recent years, her focus and involvement have been in the real estate sector. Notably, she played a key role in securing the Indirapuram Habitat Centre project, a distinctive venture encompassing socio-cultural, recreational, and commercial aspects, spanning an expansive area of more than 2 million square feet. 
`
    },
    {
        desination: "Director",
        name: "Mani Gupta",
        image: "img/founders/mani-gupta.jpg",
        content: `It is always a privilege of working alongside a professional whose depth of experience and instinct for excellence have consistently elevated our collective vision. With over a decade immersed in the real estate industry, spanning hospitality, healthcare, and large-scale development, Mani embodies a rare synthesis of entrepreneurial drive and meticulous execution. Her ability to lead complex initiatives, craft meaningful client experiences, and cultivate high-value relationships has been instrumental in shaping the stature and substance of our projects. <br><br>
She brings more than just expertise, she brings perspective. Whether it's steering promotional strategy, guiding narrative development, or overseeing cross-functional programs, her presence ensures that every endeavor is thoughtful, innovative, and aligned with long-term impact. Her leadership continues to set a benchmark within our organization – quietly powerful, unwaveringly strategic, and always a step ahead.
`
    },
    {
        desination: "Vice President",
        desination2: "(Business Development)",
        name: "Aditya Goel",
        image: "img/founders/Aditya-Goel2.jpg",
        content: `
       Aditya Goel, brings over 10 years of experience in the real estate sector, built through consistent execution and a long-term operating mindset. He holds an LLB and a BBA with a specialisation in Real Estate and Urban Infrastructure, grounding his leadership in both commercial acumen and regulatory understanding.  <br><br>

His career spans sales strategy, luxury real estate marketing, business development, portfolio advisory, and transaction structuring across high-value residential assets. Known for a sharp reading of market cycles and disciplined decision-making, he has worked closely with discerning homeowners, investors, and strategic partners in the premium and luxury segments. <br><br>

Aditya's leadership is defined by clarity, discretion, and operational depth. Rather than scale through noise, he has focused on building trust-led systems and sustainable growth. He reflects stability, refined execution, and a mature approach to luxury real estate driven by long-term value creation.
        `
    },
    {
        desination: "Executive Lead",
        desination2: "(Middle East Region)",
        name: "Yaman Rizvi",
        image: "img/founders/yaman-rizvi.jpg",
        content: `
        With over a decade of experience across hospitality, healthcare, and real estate, she brings a unique blend of entrepreneurial instinct and refined operational expertise. Known for turning ambitious ideas into high-performing ventures, she has led diverse projects and luxury-focused events with creativity, precision, and a sharp understanding of elevated experiences.  <br><br>
In real estate, her strategic influence is both sophisticated and impactful. She plays a key role in positioning projects for high-net-worth individuals and global investors, especially across the Middle East. By cultivating meaningful relationships and extending curated investment opportunities, she continues to shape ventures that are not only successful but enduringly iconic.`
    }
];

// Tab Switching Functionality - Container 1 (all 6 tabs: 0, 1, 2, 3, 4, 5)
function initTabSwitchingContainer1() {
    const container1Tabs = document.querySelectorAll('.tab-card[data-tab="0"], .tab-card[data-tab="1"], .tab-card[data-tab="2"], .tab-card[data-tab="3"], .tab-card[data-tab="4"], .tab-card[data-tab="5"]');
    const textElement1 = document.getElementById('tab-content-text');
    const imageElement1 = document.getElementById('tab-content-image');
    const mobileNameElement1 = document.querySelector('.tab-content-name-mobile');
    const designationElement1 = document.getElementById('tab-content-designation');
    const designationElement2 = document.getElementById('tab-content-designation2');

    if (!container1Tabs.length || !textElement1 || !imageElement1) return;

    // Set initial designation
    if (designationElement1 && tabContentData[0] && tabContentData[0].desination) {
        designationElement1.textContent = tabContentData[0].desination;
    }
    // Set initial designation2
    if (designationElement2 && tabContentData[0]) {
        if (tabContentData[0].desination2) {
            designationElement2.textContent = tabContentData[0].desination2;
            designationElement2.style.display = 'block';
        } else {
            designationElement2.style.display = 'none';
        }
    }

    function switchTabContainer1(tabIndex) {
        // Remove active class from all tabs in container 1
        container1Tabs.forEach((tab) => {
            const tabDataIndex = parseInt(tab.getAttribute('data-tab'));
            if (tabDataIndex === tabIndex) {
                tab.classList.remove('deactiveTabCard');
                tab.classList.add('activeTabCard');
            } else {
                tab.classList.remove('activeTabCard');
                tab.classList.add('deactiveTabCard');
            }
        });

        // Get the data for the selected tab
        const tabData = tabContentData[tabIndex];
        if (!tabData) return;

        // Update content instantly without animation
        textElement1.innerHTML = tabData.content;
        imageElement1.src = tabData.image;
        imageElement1.alt = tabData.name;
        if (mobileNameElement1) mobileNameElement1.textContent = tabData.name;
        if (designationElement1 && tabData.desination) designationElement1.textContent = tabData.desination;

        // Handle designation2 - show if exists, hide if not
        if (designationElement2) {
            if (tabData.desination2) {
                designationElement2.textContent = tabData.desination2;
                designationElement2.style.display = 'block';
            } else {
                designationElement2.style.display = 'none';
            }
        }
    }

    // Add click event listeners to all tabs in container 1
    container1Tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const tabIndex = parseInt(tab.getAttribute('data-tab'));
            if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 5) {
                switchTabContainer1(tabIndex);
            }
        });
    });
}

// Initialize all tab switching functions
function initTabSwitching() {
    initTabSwitchingContainer1();
}

// Initialize tab switching on page load
window.addEventListener('load', () => {
    initTabSwitching();
});

// ============================================
// Navigation Functions
// ============================================

// Function to navigate to Home page (opens in new tab)
function navigateToHome(event) {
    if (event) {
        event.preventDefault();
    }
    window.open('https://fgpindia.com/', '_blank');
}

// Function to navigate to Luxury & Clarity page (opens in new tab)
function navigateToLuxuryClarity(event) {
    if (event) {
        event.preventDefault();
    }
    window.open('https://fgpindia.com/', '_blank');
}

// Function to navigate to Featured Project page (opens in new tab)
function navigateToFeaturedProject(event) {
    if (event) {
        event.preventDefault();
    }
    window.open('https://fgpindia.com/fab-luxe/', '_blank');
}

// Function to scroll to top hero section with smooth scrolling
function scrollToAboutUs(event) {
    if (event) {
        event.preventDefault();
    }
    const heroSection = document.querySelector('.s1');
    if (heroSection) {
        if (lenis) {
            // Use Lenis smooth scroll if available
            lenis.scrollTo(heroSection, {
                offset: 0,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else {
            // Fallback to native smooth scroll
            heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        // Fallback: scroll to top of page
        if (lenis) {
            lenis.scrollTo(0, {
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Function to initialize navigation event listeners
function initNavigation() {
    // Home links
    const homeLinks = document.querySelectorAll('.nav-home-link');
    homeLinks.forEach(link => {
        link.addEventListener('click', navigateToHome);
    });

    // Logo link
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', navigateToHome);
    }

    // Luxury & Clarity links
    const luxuryLinks = document.querySelectorAll('.nav-luxury-link');
    luxuryLinks.forEach(link => {
        link.addEventListener('click', navigateToLuxuryClarity);
    });

    // Featured Project links
    const featuredLinks = document.querySelectorAll('.nav-featured-link');
    featuredLinks.forEach(link => {
        link.addEventListener('click', navigateToFeaturedProject);
    });

    // About Us links
    const aboutLinks = document.querySelectorAll('.nav-about-link');
    aboutLinks.forEach(link => {
        link.addEventListener('click', scrollToAboutUs);
    });
}

// Initialize navigation on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
});

// ============================================
// Advisors Panel Swiper Slider
// ============================================

// Advisor data (alphabetically sorted)
const advisorsData = [
    {
        name: 'Anil Kumar Yadav',
        image: 'img/advisor/advisor5.jpg',
        designation: '',
        content: `A greatly respected legal expert with more than three decades of experience, this illustrious Advocate and former Judicial Officer has dedicated his entire life to the cause of law and justice. Starting his legal career in 1992, the journey continued in the Uttar Pradesh Judicial Service in 2003, where his illustrious career continued until 2021. During this period, he has occupied many important judicial and administrative offices, such as Civil Judge (Senior Division), Chief Judicial Magistrate, Additional District & Sessions Judge, Special Judge under the Essential Commodities Act, and Secretary of the District Legal Services Authority in various districts of Uttar Pradesh.<br><br>
Renowned for their integrity, leadership qualities, and dedication to legal reforms, they have been at the forefront of Mega Lok Adalats, development of mediation services, legal awareness, and support for the implementation of digital court services. Their service to the nation during the COVID-19 pandemic resulted in several Corona Warrior Awards and a Corona Warrior World Record.<br><br>
Currently practicing as an Advocate, he possesses unparallelled judicial experience and expertise in his area of practice. Outside legal practice, he is ardent about writing, poetry, singing, and social service, which portrays his personality as a combination of legal acumen and creativity.`
    },
    {
        name: 'Dr. Arindam Chaudhuri',
        image: 'img/advisor/advisor9.jpg',
        designation: '',
        content: `Dr. Arindam Chaudhuri is the Honorary Advisor to Forbes Global Properties with the title of Distinguished Economic Fellow – India Real Estate Trends & Macro Economic Strategies. He is a renowned economist, leadership guru, and real estate thought leader with decades of experience across sectors. He has written the book "Star Realty," which is considered the first real estate guide in India, and has been associated with debates on urban development, macroeconomic strategies, and the housing market for a long time.<br><br>
With a PhD in Leadership from the University of Buckingham and a Master's degree in Economics from the University of Madras, Dr. Chaudhuri has also done extensive global certifications in longevity science, public health, and preventive healthcare. He has been an advisor to the Planning Commission of India on education and social sectors and has been known for his passion for science, rational thinking, public health, and economic growth.<br><br>
A successful author of several bestselling books on leadership, economics, and personal development, he is also an educator, media personality, and public speaker who has addressed premier academic institutions and trained senior leadership of the defense, civil services, and corporate world. His work has always straddled economic understanding, human development, and societal advancement.`
    },
    {
        name: 'Divam Kapoor',
        image: 'img/advisor/divyan-kumar.jpg',
        designation: '',
        content: `A dynamic and new-generation real estate leader, Divam embodies the perfect fusion of legacy, innovation, and purpose-driven growth in the Indian real estate sector. With Gulshan's illustrious 36+ year legacy, he has been instrumental in creating iconic projects like Gulshan Dynasty and One29, which are recognized for their best-in-class design, visionary planning, and long-term value creation. Simultaneously, he is the force behind DMA Infra, where his interests range from development, leasing, and real estate consulting, thereby helping to create a modern and sustainable urban environment.<br><br>
However, Divam is also recognized for his efforts to bring mindfulness and leadership together in the corporate world. As an Art of Living Teacher and an active CREDAI Youth Wing Leader, he encourages conscious leadership, wellness, and sustainability in the real estate sector. His commitment to the environment is evident through his involvement in movements such as the Kalpavriksh Movement, which has successfully implemented the plantation of over two million trees, thereby reiterating his conviction that development and environmental stewardship can coexist.<br><br>
As a national-level athlete and an engaging public speaker, Divam is the epitome of discipline, resilience, & progressive leadership. His personal journey is a unique blend of success in the business world and personal development, and he inspires a future-ready and socially responsible approach to the real estate sector.`
    },
    {
        name: 'Rakesh Kumar Jain',
        image: 'img/advisor/advisor3.jpg',
        designation: '',
        content: `With more than three decades of experience in leadership roles, Rakesh is a seasoned real estate strategist who has successfully managed large-scale real estate projects and turned around challenging business environments. He has occupied senior leadership positions like CEO and Executive Director at some of India's most respected real estate companies, including Ansals, SuperTech, Essel Realty, and Wave Infratech. Throughout his illustrious career, he has successfully conceptualized, set up, and managed varied real estate business portfolios in the form of integrated townships, SEZs, commercial and residential projects, IT parks, malls, and multiplexes.<br><br>
Rakesh has also operated as a trusted strategic advisor to the senior management of some of the most respected companies, including Unitech, Omaxe, Vatika Group, and Aerens, where he played an important role in managing complex strategic and operational issues while aligning the interests of various stakeholders. His area of expertise includes managing multi-million-dollar real estate projects with a special focus on strategic acquisitions, legal structuring, and commercial success.<br><br>
His key strengths are in the areas of portfolio management and risk, mergers and acquisitions, joint ventures, global financing, operational re-engineering, and turnaround management. Rakesh is known for his acute investment analysis, cross-cultural negotiation acumen, and his ability to add value to assets, and he has been delivering sustainable growth, profitability, and strategic impact in the real estate space.`
    },
    {
        name: 'Rajiv K Anand',
        image: 'img/advisor/advisor2.jpg',
        designation: 'Executive Director (FGP India)',
        content: `Rajiv K. Anand is the Executive Director, bringing with him nearly three decades of experience that is quite diverse, ranging from real estate development to capital advisory and cross-border transactions. With a background in civil engineering, he brings with him a rich mix of technical knowledge and acumen, which helps him take a holistic view of real estate projects that are complex in nature and are spread across India and other international markets.<br><br>
Rajiv has been known for his ability to provide clarity and execute plans in a disciplined manner, which has helped him work on projects that require both technical sophistication and prudent financial management. His job description includes providing strategic guidance, especially in the realm of capital structuring, risk management, and governance structures.<br><br>
Rajiv is known for his well-rounded judgment and extensive knowledge of the market. He evaluates opportunities with the mindset of resilience, preservation of value, and sustainable growth. His unique skill of connecting the dots between the engineering aspects of the business and the strategic planning of the venture enables him to lead the business in a manner that is not only profitable but also resilient in structure.`
    },
    {
        name: 'DGP Sanjay Kumar',
        image: 'img/advisor/dgp-sanjay-kumar.jpg',
        designation: '',
        content: `Shri Sanjay Kumar, an officer of the 1985 batch of the Indian Police Service (IPS) and belonging to the Himachal Pradesh cadre, is a highly respected former senior police officer with over three decades of distinguished service in law and order, internal security, vigilance, and disaster management at the state and national levels. He is known for his strategic vision & operational acumen and has made significant contributions to the development of the security and disaster management frameworks in India.<br><br>
An alumnus of the University of Delhi, he holds a Master's degree in Physics with specialization in Electronics and was a National Science Talent Search Scholar, which indicates his strong analytical background that contributed to his methodical and forward-looking approach to policing and administration.<br><br>
Throughout his service, Shri Sanjay Kumar has held many key leadership positions, such as the Director General of the National Disaster Response Force (NDRF) and the Director General of Police, Himachal Pradesh. He has also held key positions in national organizations such as CISF, Department of Space, and Railway Protection Force. A strong believer in professional development, he has played a very important role in setting up the Himachal Pradesh Institute of Police Studies (HPIPS). His service has been recognized with many key national awards, symbolizing his legacy of integrity, leadership, and excellence in public service.`
    },
    {
        name: 'Subhal Garg',
        image: 'img/advisor/advisor4.jpg',
        designation: 'Executive Director - FGP India',
        content: `Subhal Garg is the Forbes Global Properties India head, responsible for leading the company in India in the creation of an institutionally driven real estate platform that is based on global standards of credibility, governance, and excellence. As a leader in the company, he is responsible for market strategies, strategic partnerships, and structuring scalable real estate initiatives in the Indian market. He works in close collaboration with the global leadership team of Forbes Global Properties and plays an important role in adapting global principles to India-specific strategies and market operating frameworks.<br><br>
Subhal is a Chartered Accountant and has more than two decades of experience in finance, banking, infrastructure, and real estate. His diverse experience allows him to look at real estate not only as a development asset class but also as a structured financial opportunity. He works with developers, landowners, institutional investors, and family offices to structure transaction opportunities, align capital structures, and position assets for long-term sustainable value creation.<br><br>
Subhal is known for his prudent financial management, governance-oriented approach, and leadership style that focuses on execution. His approach to work stresses the importance of transparency, risk-adjusted growth, and best practices. His efforts help to develop professionally managed real estate platforms that are commercially successful as well as structurally sound.`
    },
    {
        name: 'Vishal Sahni',
        image: 'img/advisor/advisor1.jpg',
        designation: 'Senior Vice President - <br> Business Development',
        content: `With over three decades of experience across various industries, including real estate and telecom, and as a strategic sales leader, he is known as a market expansion expert and luxury real estate deal maker. He has played important leadership and advisory roles with prominent real estate companies like Saya Group, Ansals, Omaxe, Raheja, Supertech, and Lodha Group, which have helped shape the success of large-scale real estate projects in India.<br><br>
His area of specialization includes sales and market positioning of integrated townships, residential and commercial projects, IT parks, malls, and multiplexes, which have shown exemplary revenue performance and market presence. He is known for his specialization in Ultra High Net Worth Individuals (UHNI) and High Net Worth Individuals (HNI), and has expertise in luxury residential and commercial transactions in marquee projects.<br><br>
On the international side, he is the head of the international real estate sales in Dubai, Singapore, and the United States, working with some of the world's top luxury developers like DAMAC, Sobha, Emaar, BnW, and Danube. His international clientele is built through organized global exhibitions and lead generation programs. His strategy combines relationship-based advisory with structured deal-making, facilitating sustainable growth and positioning of high-value assets.`
    }
];

let advisorSwiper = null;

// Function to update advisor content
function updateAdvisorContent(index) {
    const advisor = advisorsData[index];
    if (!advisor) return;

    const contentText = document.getElementById('advisor-content-text');
    const contentImage = document.getElementById('advisor-content-image');
    const contentName = document.getElementById('advisor-content-name');
    const contentDesignation = document.getElementById('advisor-content-designation');

    if (contentText) contentText.innerHTML = advisor.content;
    if (contentImage) contentImage.src = advisor.image;
    if (contentImage) contentImage.alt = advisor.name;
    if (contentName) contentName.textContent = advisor.name;
    if (contentDesignation) {
        contentDesignation.innerHTML = advisor.designation || '';
        contentDesignation.style.display = advisor.designation ? 'block' : 'none';
    }

    // Update active tab indicator
    const allTabs = document.querySelectorAll('.advisor-tab-card');
    const allIndicators = document.querySelectorAll('.advisor-tab-indicator');

    allTabs.forEach(tab => tab.classList.remove('active-advisor-tab'));
    allIndicators.forEach(indicator => indicator.classList.add('hidden'));

    const activeTab = document.querySelector(`[data-advisor-index="${index}"]`);
    if (activeTab) {
        activeTab.classList.add('active-advisor-tab');
        const indicator = activeTab.querySelector('.advisor-tab-indicator');
        if (indicator) indicator.classList.remove('hidden');
    }
}

// Initialize Advisors Swiper
function initAdvisorsSwiper() {
    const swiperElement = document.querySelector('.advisor-swiper');
    if (!swiperElement || typeof Swiper === 'undefined') {
        console.warn('Swiper not available or element not found');
        return;
    }

    // Verify navigation buttons exist
    const nextBtn = document.querySelector('.advisor-swiper-button-next');
    const prevBtn = document.querySelector('.advisor-swiper-button-prev');
    if (!nextBtn || !prevBtn) {
        console.warn('Navigation buttons not found');
    }

    advisorSwiper = new Swiper('.advisor-swiper', {
        slidesPerView: 5,
        spaceBetween: 24,
        loop: true,
        navigation: {
            nextEl: '.advisor-swiper-button-next',
            prevEl: '.advisor-swiper-button-prev',
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 16,
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 24,
            },
            1280: {
                slidesPerView: 5,
                spaceBetween: 24,
            },
        },
    });

    // Initialize first content
    updateAdvisorContent(0);
    const firstTab = document.querySelector('[data-advisor-index="0"]');
    if (firstTab) {
        firstTab.classList.add('active-advisor-tab');
        const indicator = firstTab.querySelector('.advisor-tab-indicator');
        if (indicator) indicator.classList.remove('hidden');
    }

    // Add click event listeners to advisor cards
    const advisorCards = document.querySelectorAll('.advisor-tab-card');
    advisorCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (advisorSwiper) {
                // Use slideToLoop for loop mode
                advisorSwiper.slideToLoop(index);
                updateAdvisorContent(index);
            }
        });
    });

    // Update content on slide change
    advisorSwiper.on('slideChange', function () {
        const realIndex = this.realIndex;
        updateAdvisorContent(realIndex);

        // Update active tab indicators
        const allTabs = document.querySelectorAll('.advisor-tab-card');
        const allIndicators = document.querySelectorAll('.advisor-tab-indicator');

        allTabs.forEach(tab => tab.classList.remove('active-advisor-tab'));
        allIndicators.forEach(indicator => indicator.classList.add('hidden'));

        const activeTab = document.querySelector(`[data-advisor-index="${realIndex}"]`);
        if (activeTab) {
            activeTab.classList.add('active-advisor-tab');
            const indicator = activeTab.querySelector('.advisor-tab-indicator');
            if (indicator) indicator.classList.remove('hidden');
        }
    });
}

// Initialize advisors swiper when DOM is ready and Swiper is loaded
function initAdvisorsSwiperOnReady() {
    if (typeof Swiper !== 'undefined') {
        // Destroy existing swiper if any
        if (advisorSwiper) {
            advisorSwiper.destroy(true, true);
            advisorSwiper = null;
        }
        initAdvisorsSwiper();
    } else {
        // Wait for Swiper to load
        setTimeout(initAdvisorsSwiperOnReady, 100);
    }
}

// Initialize advisors swiper on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initAdvisorsSwiperOnReady, 500);
    });
} else {
    setTimeout(initAdvisorsSwiperOnReady, 500);
}

// Also try on window load as fallback
window.addEventListener('load', () => {
    if (!advisorSwiper && typeof Swiper !== 'undefined') {
        setTimeout(() => {
            initAdvisorsSwiper();
        }, 300);
    }
});