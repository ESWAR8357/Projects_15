// Smart Profile UI - JavaScript
// Clean, readable code with proper function naming

class SmartProfile {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeTheme();
    }

    // Initialize DOM elements
    initializeElements() {
        this.nameInput = document.getElementById('nameInput');
        this.roleInput = document.getElementById('roleInput');
        this.saveBtn = document.getElementById('saveBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.outputSection = document.getElementById('outputSection');
        this.displayName = document.getElementById('displayName');
        this.displayRole = document.getElementById('displayRole');
        this.themeIcon = document.querySelector('.theme-icon');
    }

    // Set up event listeners
    initializeEventListeners() {
        this.saveBtn.addEventListener('click', () => this.saveProfile());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Enable Enter key to save profile
        this.nameInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
        this.roleInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
        
        // Real-time input validation
        this.nameInput.addEventListener('input', () => this.validateInputs());
        this.roleInput.addEventListener('input', () => this.validateInputs());
    }

    // Initialize theme based on user preference or default to light
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    // Handle Enter key press to save profile
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.saveProfile();
        }
    }

    // Validate inputs and update save button state
    validateInputs() {
        const name = this.nameInput.value.trim();
        const role = this.roleInput.value.trim();
        
        if (name && role) {
            this.saveBtn.disabled = false;
            this.saveBtn.style.opacity = '1';
        } else {
            this.saveBtn.disabled = true;
            this.saveBtn.style.opacity = '0.6';
        }
    }

    // Save profile and update display
    saveProfile() {
        const name = this.nameInput.value.trim();
        const role = this.roleInput.value.trim();

        // Validate inputs
        if (!name || !role) {
            this.showValidationError();
            return;
        }

        // Update display with smooth animation
        this.updateProfileDisplay(name, role);
        this.showOutputSection();
        this.showSuccessFeedback();
    }

    // Update profile display with new information
    updateProfileDisplay(name, role) {
        // Add fade-in animation class
        this.displayName.classList.add('fade-in');
        this.displayRole.classList.add('fade-in');
        
        // Update content
        this.displayName.textContent = name;
        this.displayRole.textContent = role;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.displayName.classList.remove('fade-in');
            this.displayRole.classList.remove('fade-in');
        }, 500);
    }

    // Show output section with smooth transition
    showOutputSection() {
        this.outputSection.classList.add('show');
    }

    // Show success feedback on save button
    showSuccessFeedback() {
        const originalText = this.saveBtn.querySelector('.btn-text').textContent;
        const btnText = this.saveBtn.querySelector('.btn-text');
        
        // Change button text temporarily
        btnText.textContent = '✓ Saved!';
        this.saveBtn.style.background = 'var(--success-color)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            btnText.textContent = originalText;
            this.saveBtn.style.background = 'var(--accent-color)';
        }, 2000);
    }

    // Show validation error
    showValidationError() {
        // Add shake animation to inputs
        const inputs = [this.nameInput, this.roleInput];
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ef4444';
                input.style.animation = 'shake 0.5s ease-in-out';
                
                // Reset styles after animation
                setTimeout(() => {
                    input.style.borderColor = 'var(--border-color)';
                    input.style.animation = '';
                }, 500);
            }
        });
    }

    // Toggle between light and dark theme
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    // Set theme and update UI
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon with smooth transition
        this.updateThemeIcon(theme);
    }

    // Update theme toggle icon
    updateThemeIcon(theme) {
        const icon = theme === 'dark' ? '☀️' : '🌙';
        this.themeIcon.style.transform = 'scale(0)';
        
        setTimeout(() => {
            this.themeIcon.textContent = icon;
            this.themeIcon.style.transform = 'scale(1)';
        }, 150);
    }
}

// Add shake animation for validation errors
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the Smart Profile when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmartProfile();
});

// Export for potential future use
window.SmartProfile = SmartProfile;