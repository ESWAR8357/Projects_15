/**
 * Authentication System - Secure Login Flow with Session Management
 * Educational implementation of authentication patterns with route guards
 */

class AuthenticationApp {
    constructor() {
        // Hardcoded credentials for demo (educational purpose)
        this.validCredentials = {
            admin: 'password123',
            user: 'secret456'
        };

        this.currentSession = null;
        this.initializeElements();
        this.initializeEventListeners();
        this.checkExistingSession(); // Route guard on app load
    }

    // Initialize DOM element references
    initializeElements() {
        // Auth elements
        this.authContainer = document.getElementById('authContainer');
        this.authForm = document.getElementById('authForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.loginBtn = document.getElementById('loginBtn');
        this.loginSpinner = document.getElementById('loginSpinner');
        this.loginText = document.getElementById('loginText');
        
        // Error elements
        this.usernameError = document.getElementById('usernameError');
        this.passwordError = document.getElementById('passwordError');
        this.formError = document.getElementById('formError');
        
        // Dashboard elements
        this.dashboard = document.getElementById('dashboard');
        this.userName = document.getElementById('userName');
        this.sessionUser = document.getElementById('sessionUser');
        this.sessionTime = document.getElementById('sessionTime');
        this.sessionId = document.getElementById('sessionId');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Loading overlay
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }

    // Set up event listeners
    initializeEventListeners() {
        // Auth form submission
        this.authForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Password visibility toggle
        this.passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
        
        // Logout button
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Real-time input validation
        this.usernameInput.addEventListener('input', () => this.clearFieldError('username'));
        this.passwordInput.addEventListener('input', () => this.clearFieldError('password'));
        
        // Feature buttons (demo functionality)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('feature-btn')) {
                this.handleFeatureClick(e.target);
            }
        });
    }

    // ROUTE GUARD: Check for existing session on app load
    checkExistingSession() {
        const session = localStorage.getItem('auth_session');
        
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                
                // Validate session integrity
                if (this.isValidSession(sessionData)) {
                    this.currentSession = sessionData;
                    this.showDashboard();
                    console.log('🔐 Existing session restored');
                    return;
                }
            } catch (error) {
                console.error('Invalid session data:', error);
                this.clearSession();
            }
        }
        
        // No valid session found, show login
        this.showLogin();
    }

    // Validate session data structure and expiry
    isValidSession(sessionData) {
        if (!sessionData || !sessionData.username || !sessionData.sessionId || !sessionData.loginTime) {
            return false;
        }
        
        // Check if session is expired (24 hours)
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            console.log('Session expired');
            return false;
        }
        
        return true;
    }

    // AUTHENTICATION: Handle login form submission
    async handleLogin(e) {
        e.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();
        
        // Clear previous errors
        this.clearAllErrors();
        
        // Validate inputs
        if (!this.validateInputs(username, password)) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate authentication delay (real-world API call)
            await this.delay(1200);
            
            // Authenticate credentials
            if (this.authenticateUser(username, password)) {
                await this.loginUser(username);
            } else {
                this.showFormError('Invalid username or password. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showFormError('An error occurred during login. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    // Validate login inputs
    validateInputs(username, password) {
        let isValid = true;
        
        if (!username) {
            this.usernameError.textContent = 'Username is required';
            isValid = false;
        } else if (username.length < 3) {
            this.usernameError.textContent = 'Username must be at least 3 characters';
            isValid = false;
        }
        
        if (!password) {
            this.passwordError.textContent = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            this.passwordError.textContent = 'Password must be at least 6 characters';
            isValid = false;
        }
        
        return isValid;
    }

    // Authenticate user credentials
    authenticateUser(username, password) {
        return this.validCredentials[username] === password;
    }

    // Create session and login user
    async loginUser(username) {
        // Create session data
        const sessionData = {
            username: username,
            sessionId: this.generateSessionId(),
            loginTime: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        // Store session
        this.currentSession = sessionData;
        localStorage.setItem('auth_session', JSON.stringify(sessionData));
        
        // Show loading transition
        this.showLoadingOverlay();
        await this.delay(800);
        this.hideLoadingOverlay();
        
        // Navigate to dashboard
        this.showDashboard();
        
        console.log('🔐 User authenticated successfully:', username);
    }

    // Quick login for demo accounts
    quickLogin(username, password) {
        this.usernameInput.value = username;
        this.passwordInput.value = password;
        this.handleLogin(new Event('submit'));
    }

    // LOGOUT: Handle user logout
    handleLogout() {
        // Clear session data
        this.clearSession();
        
        // Show login screen
        this.showLogin();
        
        console.log('🔐 User logged out');
    }

    // Clear session from memory and storage
    clearSession() {
        this.currentSession = null;
        localStorage.removeItem('auth_session');
    }

    // UI STATE MANAGEMENT: Show login screen
    showLogin() {
        this.authContainer.style.display = 'flex';
        this.dashboard.style.display = 'none';
        this.clearForm();
        this.clearAllErrors();
    }

    // Show protected dashboard
    showDashboard() {
        this.authContainer.style.display = 'none';
        this.dashboard.style.display = 'flex';
        this.updateDashboardInfo();
    }

    // Update dashboard with session information
    updateDashboardInfo() {
        if (!this.currentSession) return;
        
        const { username, loginTime, sessionId } = this.currentSession;
        
        // Update user display
        this.userName.textContent = username;
        this.sessionUser.textContent = username;
        
        // Format and display login time
        const loginDate = new Date(loginTime);
        this.sessionTime.textContent = this.formatDateTime(loginDate);
        
        // Display session ID (truncated for UI)
        this.sessionId.textContent = sessionId.substring(0, 12) + '...';
    }

    // UTILITY FUNCTIONS
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    formatDateTime(date) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Password visibility toggle
    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        this.passwordToggle.querySelector('.toggle-icon').textContent = isPassword ? '🙈' : '👁️';
    }

    // Loading state management
    setLoadingState(isLoading) {
        this.loginBtn.disabled = isLoading;
        this.loginSpinner.style.display = isLoading ? 'inline-block' : 'none';
        this.loginText.textContent = isLoading ? 'Signing In...' : 'Sign In';
    }

    showLoadingOverlay() {
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoadingOverlay() {
        this.loadingOverlay.style.display = 'none';
    }

    // Error handling
    clearFieldError(field) {
        if (field === 'username') {
            this.usernameError.textContent = '';
        } else if (field === 'password') {
            this.passwordError.textContent = '';
        }
        this.formError.style.display = 'none';
    }

    clearAllErrors() {
        this.usernameError.textContent = '';
        this.passwordError.textContent = '';
        this.formError.style.display = 'none';
    }

    showFormError(message) {
        this.formError.textContent = message;
        this.formError.style.display = 'block';
    }

    clearForm() {
        this.usernameInput.value = '';
        this.passwordInput.value = '';
        this.passwordInput.type = 'password';
        this.passwordToggle.querySelector('.toggle-icon').textContent = '👁️';
    }

    // Feature button demo functionality
    handleFeatureClick(button) {
        const featureName = button.closest('.feature-card').querySelector('h3').textContent;
        
        // Simulate feature action
        button.style.opacity = '0.6';
        button.textContent = 'Loading...';
        
        setTimeout(() => {
            button.style.opacity = '1';
            button.textContent = `Open ${featureName}`;
            alert(`${featureName} feature would open here in a real application.`);
        }, 1000);
    }

    // Public methods for debugging
    getCurrentSession() {
        return this.currentSession ? { ...this.currentSession } : null;
    }

    isAuthenticated() {
        return this.currentSession !== null;
    }
}

// Initialize the authentication app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.authApp = new AuthenticationApp();
    
    console.log('🔐 Authentication System initialized');
    console.log('👥 Demo accounts: admin/password123, user/secret456');
    console.log('🛡️ Features: Session persistence, route guards, input validation');
    console.log('🔧 Try: authApp.getCurrentSession() to see current session');
    console.log('🔍 Try: authApp.isAuthenticated() to check auth status');
});