/**
 * Error Handling & User Feedback System
 * 
 * This system demonstrates professional failure-aware engineering:
 * - Input validation with clear error messages
 * - Centralized feedback controller
 * - Graceful error recovery
 * - User-friendly status communication
 */

// Centralized Feedback Controller
class FeedbackController {
    constructor(messageElementId) {
        this.messageElement = document.getElementById(messageElementId);
    }

    /**
     * Display feedback message with appropriate styling
     * @param {string} message - The message to display
     * @param {string} type - Message type: 'success', 'warning', 'error'
     */
    showMessage(message, type) {
        // Clear previous classes and hide element
        this.messageElement.className = 'status-message';
        this.messageElement.textContent = message;
        
        // Add appropriate type class
        this.messageElement.classList.add(type);
        
        // Trigger smooth fade-in animation
        setTimeout(() => {
            this.messageElement.classList.add('show');
        }, 10);
    }

    /**
     * Clear the current message
     */
    clearMessage() {
        this.messageElement.classList.remove('show');
        setTimeout(() => {
            this.messageElement.textContent = '';
            this.messageElement.className = 'status-message';
        }, 300);
    }
}

// Email Validation Module
class EmailValidator {
    /**
     * Validate email input and return validation result
     * @param {string} email - Email string to validate
     * @returns {Object} Validation result with isValid, type, and message
     */
    static validate(email) {
        // Check for empty input
        if (!email || email.trim() === '') {
            return {
                isValid: false,
                type: 'error',
                message: 'Email address is required. Please enter your email.'
            };
        }

        // Check email format using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email.trim())) {
            return {
                isValid: false,
                type: 'warning',
                message: 'Please enter a valid email address (e.g., user@example.com)'
            };
        }

        // Validation passed
        return {
            isValid: true,
            type: 'success',
            message: 'Email validated successfully! Form submission complete.'
        };
    }
}

// Main Application Controller
class ErrorHandlingApp {
    constructor() {
        this.feedbackController = new FeedbackController('statusMessage');
        this.emailInput = document.getElementById('email');
        this.form = document.getElementById('emailForm');
        
        this.initializeEventListeners();
    }

    /**
     * Set up event listeners for form interaction
     */
    initializeEventListeners() {
        // Handle form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            this.handleFormSubmission();
        });

        // Clear messages when user starts typing (recovery mechanism)
        this.emailInput.addEventListener('input', () => {
            this.feedbackController.clearMessage();
        });

        // Clear messages when user focuses on input
        this.emailInput.addEventListener('focus', () => {
            this.feedbackController.clearMessage();
        });
    }

    /**
     * Handle form submission with validation and feedback
     */
    handleFormSubmission() {
        const email = this.emailInput.value;
        
        // Validate email input
        const validationResult = EmailValidator.validate(email);
        
        // Display appropriate feedback
        this.feedbackController.showMessage(
            validationResult.message,
            validationResult.type
        );

        // If validation fails, focus back to input for user correction
        if (!validationResult.isValid) {
            setTimeout(() => {
                this.emailInput.focus();
            }, 100);
        } else {
            // Success case - could trigger next steps in real application
            console.log('Form submitted successfully with email:', email.trim());
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ErrorHandlingApp();
    
    console.log('Error Handling & User Feedback System initialized');
    console.log('Teaching concepts: Input validation, error recovery, user feedback');
});