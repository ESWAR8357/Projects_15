/* ================================
   NAVIGATION AND HAMBURGER MENU
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle hamburger menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

/* ================================
   PROJECT FILTERING
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects with animation
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Add fade-in animation
                    setTimeout(() => {
                        card.style.animation = 'fadeInUp 0.5s ease';
                    }, 0);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

/* ================================
   SCROLL ANIMATIONS
   ================================ */

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all project cards
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    const skillCategories = document.querySelectorAll('.skill-category');

    projectCards.forEach(card => {
        observer.observe(card);
    });

    skillCategories.forEach(category => {
        observer.observe(category);
    });
});

/* ================================
   SCROLL TO TOP BUTTON
   ================================ */

// Create scroll to top button
const scrollToTopButton = document.createElement('button');
scrollToTopButton.classList.add('scroll-to-top');
scrollToTopButton.innerHTML = '↑ Top';
document.body.appendChild(scrollToTopButton);

// Add CSS for scroll to top button
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 15px;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        font-weight: bold;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
    }

    .scroll-to-top.show {
        opacity: 1;
        visibility: visible;
    }

    .scroll-to-top:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
`;
document.head.appendChild(style);

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('show');
    } else {
        scrollToTopButton.classList.remove('show');
    }
});

// Scroll to top functionality
scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ================================
   STATS COUNTER ANIMATION
   ================================ */

// Animate numbers on scroll
function animateCounter(element, target, duration = 2000) {
    let currentValue = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        currentValue += increment;
        if (currentValue >= target) {
            element.textContent = target;
        } else {
            element.textContent = Math.floor(currentValue);
            requestAnimationFrame(updateCounter);
        }
    };
    
    updateCounter();
}

/* ================================
   KEYBOARD SHORTCUTS
   ================================ */

document.addEventListener('keydown', function(e) {
    // '/' key to focus search or show help
    if (e.key === '/') {
        e.preventDefault();
        // You can add search functionality here
    }
    
    // 'Home' key to go to top
    if (e.key === 'Home') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // 'End' key to go to footer
    if (e.key === 'End') {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
});

/* ================================
   PERFORMANCE OPTIMIZATION
   ================================ */

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

/* ================================
   ACCESSIBILITY FEATURES
   ================================ */

// Skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#projects';
skipLink.textContent = 'Skip to main content';
skipLink.classList.add('skip-link');
document.body.insertBefore(skipLink, document.body.firstChild);

// Add skip link styles
const skipLinkStyle = document.createElement('style');
skipLinkStyle.textContent = `
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
    }

    .skip-link:focus {
        top: 0;
    }
`;
document.head.appendChild(skipLinkStyle);

/* ================================
   PERFORMANCE METRICS
   ================================ */

// Log performance metrics (optional)
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const timings = window.performance.timing;
        const loadTime = timings.loadEventEnd - timings.navigationStart;
        console.log('Portfolio loaded in ' + loadTime + 'ms');
    }
});

/* ================================
   FORM SUBMISSION (IF NEEDED)
   ================================ */

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create email link
            const mailtoLink = `mailto:toletidurgeswararao@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showSuccessMessage('Thank you! Your email client is opening...');
            
            // Reset form
            this.reset();
        });
    }
});

function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    successMessage.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        z-index: 1001;
        animation: slideInDown 0.5s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;
    document.body.appendChild(successMessage);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        successMessage.style.animation = 'slideOutUp 0.5s ease';
        setTimeout(() => successMessage.remove(), 500);
    }, 3000);
}

/* ================================
   EXAMPLE CONTACT FORM (LEGACY)
   ================================ */

/* ================================
   DARK MODE TOGGLE (OPTIONAL)
   ================================ */

// Create dark mode toggle (optional feature)
function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.classList.add('dark-mode-toggle');
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        z-index: 999;
        transition: all 0.3s ease;
    `;

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    document.body.appendChild(darkModeToggle);

    // Restore dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️';
    }
}

// Add dark mode styles
const darkModeStyle = document.createElement('style');
darkModeStyle.textContent = `
    body.dark-mode {
        --text-primary: #ffffff;
        --text-secondary: #b0b0b0;
        --light-bg: #1a1a2e;
        background-color: #0f0f23;
        color: #ffffff;
    }

    body.dark-mode .project-card,
    body.dark-mode .skill-category,
    body.dark-mode .contact-item {
        background-color: #252541;
        color: #ffffff;
    }

    body.dark-mode .section-subtitle,
    body.dark-mode .project-description,
    body.dark-mode .contact-subtitle {
        color: #b0b0b0;
    }

    body.dark-mode .projects-section {
        background: #0f0f23;
    }

    body.dark-mode .skills-section {
        background: #1a1a2e;
    }

    body.dark-mode .contact-section {
        background: #1a1a2e;
    }

    body.dark-mode .filter-btn {
        background: #252541;
        color: #ffffff;
        border-color: #404060;
    }

    body.dark-mode .form-group input,
    body.dark-mode .form-group textarea {
        background-color: #252541;
        color: #ffffff;
        border-color: #404060;
    }

    body.dark-mode .form-group input:focus,
    body.dark-mode .form-group textarea:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    body.dark-mode .form-group label {
        color: #ffffff;
    }

    body.dark-mode .footer {
        background: #000;
    }
`;
document.head.appendChild(darkModeStyle);

// Initialize dark mode
initDarkMode();

/* ================================
   UTILITY FUNCTIONS
   ================================ */

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Log page analytics (optional)
function logPageView() {
    console.log('Portfolio page viewed at ' + new Date().toLocaleString());
}

logPageView();

/* ================================
   READY
   ================================ */

console.log('Portfolio initialized successfully! 🚀');
