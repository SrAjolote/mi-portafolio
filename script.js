// ===== PORTFOLIO JAVASCRIPT =====
// Modern interactive portfolio with smooth animations and functionality

// Global Configuration
const CONFIG = {
    whatsappNumber: '+527861624359', // David's WhatsApp number
    emailAddress: 'indecentoff@gmail.com', // David's email
    animationDuration: 600,
    scrollOffset: 80,
    typingSpeed: 100,
    deletingSpeed: 50
};

// DOM Elements
const elements = {
    navbar: null,
    mobileMenuToggle: null,
    navMenu: null,
    navLinks: null,
    themeToggle: null,
    contactForm: null,
    skillBars: null,
    projectCards: null,
    filterButtons: null,
    scrollIndicator: null,
    heroText: null,
    sections: null
};

// State Management
const state = {
    currentTheme: 'light',
    mobileMenuOpen: false,
    currentFilter: 'all',
    isScrolling: false,
    animatedElements: new Set(),
    typingIndex: 0,
    isDeleting: false,
    currentRole: 0
};

// Initialize Portfolio
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    initializeAnimations();
    initializeTheme();
    initializeScrollAnimations();
    initializeTypingEffect();
    initializeParticles();
    
    console.log('Portfolio initialized successfully!');
});

// Initialize DOM Elements
function initializeElements() {
    elements.navbar = document.querySelector('.navbar');
    elements.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    elements.navMenu = document.querySelector('.nav-menu');
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.themeToggle = document.querySelector('.theme-toggle');
    elements.contactForm = document.querySelector('.contact-form');
    elements.skillBars = document.querySelectorAll('.skill-progress');
    elements.projectCards = document.querySelectorAll('.project-card');
    elements.filterButtons = document.querySelectorAll('.filter-btn');
    elements.scrollIndicator = document.querySelector('.scroll-indicator');
    elements.heroText = document.querySelector('.hero-name');
    elements.sections = document.querySelectorAll('section');
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Mobile menu toggle
    if (elements.mobileMenuToggle) {
        elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Navigation links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }

    // Contact form
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Project filters
    elements.filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });

    // Scroll events
    window.addEventListener('scroll', throttle(handleScroll, 16));
    window.addEventListener('resize', debounce(handleResize, 250));

    // Scroll indicator
    if (elements.scrollIndicator) {
        elements.scrollIndicator.addEventListener('click', scrollToAbout);
    }

    // WhatsApp buttons
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', openWhatsApp);
    });

    // Social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', handleSocialClick);
    });

    // Project cards hover effects
    elements.projectCards.forEach(card => {
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Mobile Menu Functions
function toggleMobileMenu() {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    
    elements.mobileMenuToggle.classList.toggle('active');
    elements.navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = state.mobileMenuOpen ? 'hidden' : '';
    
    // Animate hamburger lines
    animateHamburger();
}

function closeMobileMenu() {
    if (state.mobileMenuOpen) {
        toggleMobileMenu();
    }
}

function animateHamburger() {
    const lines = elements.mobileMenuToggle.querySelectorAll('.hamburger-line');
    lines.forEach((line, index) => {
        line.style.transition = 'all 0.3s ease';
    });
}

// Navigation Functions
function handleNavClick(e) {
    e.preventDefault();
    
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        // Update active nav link
        elements.navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        
        // Smooth scroll to section
        smoothScrollTo(targetSection);
        
        // Close mobile menu if open
        closeMobileMenu();
    }
}

function smoothScrollTo(target) {
    const targetPosition = target.offsetTop - CONFIG.scrollOffset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + CONFIG.scrollOffset + 50;
    
    elements.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Theme Functions
function initializeTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    setTheme(savedTheme);
}

function toggleTheme() {
    const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    state.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    
    // Update theme toggle icon
    if (elements.themeToggle) {
        const icon = elements.themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// Scroll Functions
function handleScroll() {
    if (state.isScrolling) return;
    
    state.isScrolling = true;
    
    requestAnimationFrame(() => {
        updateNavbarBackground();
        updateActiveNavLink();
        animateOnScroll();
        updateScrollIndicator();
        
        state.isScrolling = false;
    });
}

function updateNavbarBackground() {
    if (!elements.navbar) return;
    
    const scrolled = window.scrollY > 50;
    elements.navbar.classList.toggle('scrolled', scrolled);
}

function updateScrollIndicator() {
    if (!elements.scrollIndicator) return;
    
    const scrolled = window.scrollY > window.innerHeight * 0.3;
    elements.scrollIndicator.style.opacity = scrolled ? '0' : '1';
}

function scrollToAbout() {
    const aboutSection = document.querySelector('#sobre-mi');
    if (aboutSection) {
        smoothScrollTo(aboutSection);
    }
}

// Animation Functions
function initializeAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll(
        '.hero-text, .hero-visual, .about-intro, .skill-category, .project-card, .contact-card'
    );
    
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
}

function initializeScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !state.animatedElements.has(entry.target)) {
                    animateElement(entry.target);
                    state.animatedElements.add(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );
    
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

function animateElement(element) {
    element.classList.add('animated');
    
    // Special animations for specific elements
    if (element.classList.contains('skill-category')) {
        animateSkillBars(element);
    }
    
    if (element.classList.contains('hero-visual')) {
        animateFloatingCards();
    }
}

function animateOnScroll() {
    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero-particles');
    if (heroBackground) {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
}

// Skill Bar Animations
function animateSkillBars(container) {
    const skillBars = container.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const level = bar.getAttribute('data-width') || '0';
        
        setTimeout(() => {
            bar.style.width = level + '%';
        }, index * 200);
    });
}

// Typing Effect
function initializeTypingEffect() {
    const roles = [
        'Desarrollador Backend',
        'Especialista en APIs',
        'Arquitecto de Software',
        'Desarrollador Full Stack'
    ];
    
    const roleElement = document.querySelector('.role-highlight');
    if (!roleElement) return;
    
    function typeRole() {
        const currentRoleText = roles[state.currentRole];
        
        if (!state.isDeleting) {
            // Typing
            roleElement.textContent = currentRoleText.substring(0, state.typingIndex + 1);
            state.typingIndex++;
            
            if (state.typingIndex === currentRoleText.length) {
                state.isDeleting = true;
                setTimeout(typeRole, 2000); // Pause before deleting
                return;
            }
            
            setTimeout(typeRole, CONFIG.typingSpeed);
        } else {
            // Deleting
            roleElement.textContent = currentRoleText.substring(0, state.typingIndex - 1);
            state.typingIndex--;
            
            if (state.typingIndex === 0) {
                state.isDeleting = false;
                state.currentRole = (state.currentRole + 1) % roles.length;
                setTimeout(typeRole, 500); // Pause before typing next role
                return;
            }
            
            setTimeout(typeRole, CONFIG.deletingSpeed);
        }
    }
    
    // Start typing effect
    setTimeout(typeRole, 1000);
}

// Floating Cards Animation
function animateFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotate(0deg)';
        }, index * 300);
    });
}

// Project Filter Functions
function handleFilterClick(e) {
    const filter = e.target.getAttribute('data-filter');
    
    // Update active filter button
    elements.filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter projects
    filterProjects(filter);
    state.currentFilter = filter;
}

function filterProjects(filter) {
    elements.projectCards.forEach(card => {
        const categories = card.getAttribute('data-category')?.split(' ') || [];
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Contact Form Functions
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    showFormLoading(true);
    
    // Send to WhatsApp
    setTimeout(() => {
        sendToWhatsApp(data);
        showFormLoading(false);
        showFormSuccess();
        e.target.reset();
    }, 1000);
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    if (!data.message || data.message.length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormLoading(loading) {
    const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = loading;
        submitBtn.innerHTML = loading ? 
            '<i class="fas fa-spinner fa-spin"></i> Enviando...' : 
            '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
    }
}

function showFormSuccess() {
    showNotification('¡Mensaje enviado correctamente!', 'success');
}

function showFormErrors(errors) {
    const errorMessage = errors.join('\n');
    showNotification(errorMessage, 'error');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Social Media Functions
function handleSocialClick(e) {
    // Solo interceptar si el enlace tiene data-platform
    const platform = e.currentTarget.getAttribute('data-platform');
    
    if (platform) {
        e.preventDefault();
        const url = getSocialUrl(platform);
        
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }
    // Si no tiene data-platform, dejar que el enlace funcione normalmente
}

function getSocialUrl(platform) {
    const urls = {
        github: 'https://github.com/tu-usuario',
        linkedin: 'https://linkedin.com/in/tu-perfil',
        twitter: 'https://twitter.com/tu-usuario',
        instagram: 'https://instagram.com/tu-usuario',
        email: `mailto:${CONFIG.emailAddress}`
    };
    
    return urls[platform];
}

function openWhatsApp() {
    const message = encodeURIComponent('¡Hola! Me interesa contactarte para un proyecto.');
    const url = `https://wa.me/${CONFIG.whatsappNumber.replace('+', '')}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

function sendToWhatsApp(data) {
    const message = `¡Hola David! Te contacto desde tu portfolio web.

` +
                   `*Nombre:* ${data.name}
` +
                   `*Email:* ${data.email}
` +
                   `*Asunto:* ${data.subject}
` +
                   `*Mensaje:* ${data.message}

` +
                   `¡Espero tu respuesta!`;
    
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${CONFIG.whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

// Card Hover Effects
function handleCardHover(e) {
    const card = e.currentTarget;
    const overlay = card.querySelector('.project-overlay');
    
    if (overlay) {
        overlay.style.opacity = '1';
    }
    
    // Add tilt effect
    card.style.transform = 'translateY(-8px) rotateX(5deg)';
}

function handleCardLeave(e) {
    const card = e.currentTarget;
    const overlay = card.querySelector('.project-overlay');
    
    if (overlay) {
        overlay.style.opacity = '0';
    }
    
    // Remove tilt effect
    card.style.transform = 'translateY(0) rotateX(0deg)';
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && state.mobileMenuOpen) {
        closeMobileMenu();
    }
    
    // Arrow keys for project navigation
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        navigateProjects(e.key === 'ArrowRight');
    }
}

function navigateProjects(forward) {
    const visibleCards = Array.from(elements.projectCards).filter(card => 
        card.style.display !== 'none' && card.style.opacity !== '0'
    );
    
    if (visibleCards.length === 0) return;
    
    const focusedCard = document.activeElement.closest('.project-card');
    let currentIndex = visibleCards.indexOf(focusedCard);
    
    if (currentIndex === -1) {
        currentIndex = 0;
    } else {
        currentIndex = forward ? 
            (currentIndex + 1) % visibleCards.length : 
            (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    }
    
    visibleCards[currentIndex].focus();
}

// Particle System
function initializeParticles() {
    const particleContainer = document.querySelector('.hero-particles');
    if (!particleContainer) return;
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position and properties
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(99, 102, 241, 0.3);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: floatParticle ${duration}s infinite linear;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, duration * 1000);
}

// Resize Handler
function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && state.mobileMenuOpen) {
        closeMobileMenu();
    }
    
    // Recalculate scroll positions
    updateActiveNavLink();
}

// Utility Functions
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance Optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const criticalResources = [
        'styles.css',
        'cv.pdf'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'document';
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Add CSS for notifications and particles
const additionalStyles = `
<style>
/* Notification Styles */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-tooltip);
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.notification-success {
    border-left: 4px solid var(--success-color);
}

.notification-error {
    border-left: 4px solid var(--error-color);
}

.notification-warning {
    border-left: 4px solid var(--warning-color);
}

.notification-info {
    border-left: 4px solid var(--primary-color);
}

.notification-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: var(--radius-sm);
    transition: color var(--transition-fast);
}

.notification-close:hover {
    color: var(--text-primary);
}

/* Particle Animation */
@keyframes floatParticle {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}

/* Navbar scrolled state */
.navbar.scrolled {
    background: var(--bg-primary);
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-md);
}

[data-theme="dark"] .navbar.scrolled {
    background: var(--bg-primary);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
}

[data-theme="light"] .navbar.scrolled {
    background: var(--bg-primary);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

/* Focus styles for better accessibility */
.project-card:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 4px;
}

/* Loading animation for form */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.fa-spinner {
    animation: spin 1s linear infinite;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Export functions for external use
window.PortfolioJS = {
    toggleTheme,
    smoothScrollTo,
    showNotification,
    openWhatsApp,
    filterProjects
};

console.log('Portfolio JavaScript loaded successfully! 🚀');