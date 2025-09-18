/**
 * Main JavaScript file for Velox website
 * Handles core functionality including navigation, modals, theme switching,
 * scroll behaviors, and general UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    initTheme();
    initNavigation();
    initScrollEffects();
    initModals();
    initToasts();
    loadPageContent();
    initAccessibility();
}

/**
 * Theme Management
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = prefersDark.matches ? 'dark' : 'light';
    const currentTheme = savedTheme || systemTheme;
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggleState(currentTheme);
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeToggleState(newTheme);
        }
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleState(newTheme);
}

function updateThemeToggleState(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', 
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }
}

/**
 * Navigation Management
 */
function initNavigation() {
    initMobileMenu();
    initStickyHeader();
    highlightCurrentPage();
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = nav?.querySelectorAll('.nav__link');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on nav links
    navLinks?.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                closeMobileMenu();
            }
        });
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
            closeMobileMenu();
            menuToggle.focus();
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('nav-open') && 
            !nav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const isOpen = nav.classList.contains('nav-open');
    
    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    
    nav.classList.add('nav-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    
    // Focus trap
    const focusableElements = nav.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

function closeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    
    nav.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
}

function initStickyHeader() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    let scrollThreshold = 10;
    
    if (!header) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            header.classList.add('header--shrunk');
        } else {
            header.classList.remove('header--shrunk');
        }
        
        lastScrollTop = scrollTop;
    }, 10));
}

function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        link.classList.remove('nav__link--active');
        
        if (currentPath === linkPath || 
            (currentPath === '/' && linkPath === '/') ||
            (currentPath.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('nav__link--active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    initBackToTop();
    initScrollProgress();
    initIntersectionObserver();
}

function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, 100));
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', throttle(() => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    }, 10));
}

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.observe-fade-up');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add animation classes to sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('observe-fade-up');
        observer.observe(section);
    });
}

/**
 * Modal Management
 */
function initModals() {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;
    
    // Close modal on backdrop click
    const backdrop = modal.querySelector('.modal__backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeQuoteModal);
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
            closeQuoteModal();
        }
    });
    
    // Trap focus in modal
    modal.addEventListener('keydown', trapFocus);
}

// Global functions for modal (called from HTML)
window.openQuoteModal = function() {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;
    
    modal.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus first input
    const firstInput = modal.querySelector('input, textarea, select, button');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
};

window.closeQuoteModal = function() {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;
    
    modal.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear form
    const form = modal.querySelector('.quote-form');
    if (form) {
        form.reset();
    }
};

function trapFocus(e) {
    if (e.key !== 'Tab') return;
    
    const modal = e.currentTarget;
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

/**
 * Toast Notifications
 */
function initToasts() {
    // Toast functions are global to be called from other modules
}

window.showToast = function(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const messageElement = toast.querySelector('.toast-message');
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    // Set toast type
    toast.className = 'toast';
    if (type === 'error') {
        toast.classList.add('toast-error');
    }
    
    // Show toast
    toast.classList.add('toast-show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideToast();
    }, 5000);
};

window.hideToast = function() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('toast-show');
    }
};

/**
 * Content Loading
 */
function loadPageContent() {
    loadFeaturedProducts();
    loadTestimonials();
}

async function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    try {
        const response = await fetch('/js/products.json');
        const products = await response.json();
        
        // Show only first 3 products on home page
        const featuredProducts = products.slice(0, 3);
        
        container.innerHTML = featuredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="20" width="80" height="20" rx="10" fill="currentColor" opacity="0.3"/>
                        <text x="50" y="35" text-anchor="middle" fill="currentColor" font-size="8">${product.name}</text>
                    </svg>
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-recycled">${product.recycledContent}% Recycled</span>
                    </div>
                    <button class="btn btn--primary btn--small" onclick="openQuoteModal()">Get Quote</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = '<p class="text-center text-muted">Unable to load products at this time.</p>';
    }
}

async function loadTestimonials() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;
    
    try {
        const response = await fetch('/js/testimonials.json');
        const testimonials = await response.json();
        
        track.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-slide">
                <blockquote class="testimonial-quote">"${testimonial.quote}"</blockquote>
                <cite class="testimonial-author">${testimonial.author}</cite>
                <div class="testimonial-company">${testimonial.company}</div>
            </div>
        `).join('');
        
        // Initialize testimonials carousel
        if (window.initTestimonialsCarousel) {
            window.initTestimonialsCarousel();
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        track.innerHTML = '<div class="testimonial-slide"><p class="text-center text-muted">Unable to load testimonials at this time.</p></div>';
    }
}

/**
 * Newsletter Signup
 */
window.handleNewsletter = function(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    // Simulate newsletter signup
    setTimeout(() => {
        showToast('Thank you for subscribing to our newsletter!');
        form.reset();
    }, 1000);
};

/**
 * Accessibility Helpers
 */
function initAccessibility() {
    // Add skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }
    
    // Improve focus visibility for keyboard users
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

/**
 * Utility Functions
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Error Handling
 */
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    // Could send error to analytics service here
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Could send error to analytics service here
});

// Expose utilities globally for other modules
window.VeloxUtils = {
    throttle,
    debounce,
    showToast,
    hideToast
};
