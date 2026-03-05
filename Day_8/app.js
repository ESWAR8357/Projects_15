/**
 * Secure Login + Remember Me System
 * Educational implementation of authentication with session management
 * Demonstrates LocalStorage vs SessionStorage security trade-offs
 */

class SecureAuthApp {
    constructor() {
        // Hardcoded credentials for demo (educational purpose)
        this.validCredentials = {
            admin: 'secure123',
            user: 'password456'
        };

        this.currentSession = null;
        this.sessionExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        this.initializeElements();
        this.initializeEventListeners();
        this.checkExistingSession(); // Session guard on app load
    }

    // Initialize DOM element references
    initializeElements() {
        // Login elements
        this.loginContainer = document.getElementById('loginContainer');
        this.loginForm = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
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
        this.sessionType = document.getElementById('sessionType');
        this.sessionTypeDetail = document.getElementById('sessionTypeDetail');
        this.sessionExpires = document.getElementById('sessionExpires');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Success overlay
        this.successOverlay = document.getElementById('successOverlay');
    }

    // Set up event listeners
    initializeEventListeners() {
        // Login form submission
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
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

    // SESSION GUARD: Check for existing session on app load
    checkExistingSession() {
        // Check both storage types for existing sessions
        let session = this.getSessionFromStorage();
        
        if (session && this.isValidSession(session)) {
            this.currentSession = session;
            this.showDashboard();
            console.log('🔐 Existing session restored:', session.storageType);
            return;
        }
        
        // No valid session found, show login
        this.showLogin();
    }

    // Get session from either storage type
    getSessionFromStorage() {
        // Check persistent storage first (Remember Me)
        const persistentSession = localStorage.getItem('secure_session');
        if (persistentSession) {
            try {
                const session = JSON.parse(persistentSession);
                session.storageType = 'persistent';
                return session;
            } catch (error) {
                console.error('Invalid persistent session:', error);
                localStorage.removeItem('secure_session');
            }
        }
        
        // Check session storage (temporary)
        const sessionSession = sessionStorage.getItem('secure_session');
        if (sessionSession) {
            try {
                const session = JSON.parse(sessionSession);
                session.storageType = 'session';
                return session;
            } catch (error) {
                console.error('Invalid session storage:', error);
                sessionStorage.removeItem('secure_session');
            }
        }
        
        return null;
    }

    // Validate session data and expiry
    isValidSession(sessionData) {
        if (!sessionData || !sessionData.username || !sessionData.sessionId || !sessionData.loginTime) {
            return false;
        }
        
        // Check if session is expired
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const timeDiff = now - loginTime;
        
        if (timeDiff > this.sessionExpiry) {
            console.log('Session expired');
            this.clearAllSessions();
            return false;
        }
        
        return true;
    }

    // AUTHENTICATION: Handle login form submission
    async handleLogin(e) {
        e.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();
        const rememberMe = this.rememberMeCheckbox.checked;
        
        // Clear previous errors
        this.clearAllErrors();
        
        // Validate inputs
        if (!this.validateInputs(username, password)) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate authentication delay
            await this.delay(1200);
            
            // Authenticate credentials
            if (this.authenticateUser(username, password)) {
                await this.loginUser(username, rememberMe);
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
    async loginUser(username, rememberMe) {
        // Create session data
        const sessionData = {
            username: username,
            sessionId: this.generateSessionId(),
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe,
            userAgent: navigator.userAgent.substring(0, 100) // Truncated for storage
        };
        
        // Store session based on Remember Me choice
        this.storeSession(sessionData, rememberMe);
        
        // Set current session
        sessionData.storageType = rememberMe ? 'persistent' : 'session';
        this.currentSession = sessionData;
        
        // Show success animation
        this.showSuccessAnimation();
        await this.delay(1500);
        
        // Navigate to dashboard
        this.showDashboard();
        
        console.log(`🔐 User authenticated: ${username} (${sessionData.storageType})`);
    }

    // STORAGE MANAGEMENT: Store session based on Remember Me choice
    storeSession(sessionData, rememberMe) {
        const sessionString = JSON.stringify(sessionData);
        
        if (rememberMe) {
            // Persistent storage - survives browser close
            localStorage.setItem('secure_session', sessionString);
            console.log('💾 Session stored in LocalStorage (persistent)');
        } else {
            // Session storage - clears when browser closes
            sessionStorage.setItem('secure_session', sessionString);
            console.log('🔒 Session stored in SessionStorage (temporary)');
        }
    }

    // Quick login for demo accounts
    quickLogin(username, password) {
        this.usernameInput.value = username;
        this.passwordInput.value = password;
        this.handleLogin(new Event('submit'));
    }

    // LOGOUT: Handle user logout
    handleLogout() {
        // Clear all sessions (both storage types)
        this.clearAllSessions();
        
        // Reset current session
        this.currentSession = null;
        
        // Show login screen
        this.showLogin();
        
        console.log('🔐 User logged out - all sessions cleared');
    }

    // Clear sessions from both storage types
    clearAllSessions() {
        localStorage.removeItem('secure_session');
        sessionStorage.removeItem('secure_session');
    }

    // UI STATE MANAGEMENT: Show login screen
    showLogin() {
        this.loginContainer.style.display = 'flex';
        this.dashboard.style.display = 'none';
        this.clearForm();
        this.clearAllErrors();
    }

    // Show protected dashboard
    showDashboard() {
        this.loginContainer.style.display = 'none';
        this.dashboard.style.display = 'flex';
        this.updateDashboardInfo();
    }

    // Show success animation
    showSuccessAnimation() {
        this.successOverlay.style.display = 'flex';
        setTimeout(() => {
            this.successOverlay.style.display = 'none';
        }, 1500);
    }

    // Update dashboard with session information
    updateDashboardInfo() {
        if (!this.currentSession) return;
        
        const { username, loginTime, sessionId, storageType, rememberMe } = this.currentSession;
        
        // Update user display
        this.userName.textContent = username;
        this.sessionUser.textContent = username;
        
        // Format and display login time
        const loginDate = new Date(loginTime);
        this.sessionTime.textContent = this.formatDateTime(loginDate);
        
        // Display session ID (truncated for UI)
        this.sessionId.textContent = sessionId.substring(0, 12) + '...';
        
        // Update session type indicators
        this.updateSessionTypeDisplay(storageType, rememberMe);
    }

    // Update session type display
    updateSessionTypeDisplay(storageType, rememberMe) {
        const sessionTypeEl = this.sessionType;
        const sessionExpiresEl = this.sessionExpires;
        
        if (storageType === 'persistent' && rememberMe) {
            sessionTypeEl.classList.add('persistent');
            sessionTypeEl.querySelector('.session-icon').textContent = '💾';
            sessionTypeEl.querySelector('.session-text').textContent = 'Remembered';
            sessionExpiresEl.querySelector('.expires-text').textContent = 'Persists across browser sessions';
            this.sessionTypeDetail.textContent = 'Local Storage (Persistent)';
        } else {
            sessionTypeEl.classList.remove('persistent');
            sessionTypeEl.querySelector('.session-icon').textContent = '🔒';
            sessionTypeEl.querySelector('.session-text').textContent = 'Session Only';
            sessionExpiresEl.querySelector('.expires-text').textContent = 'Expires when browser closes';
            this.sessionTypeDetail.textContent = 'Session Storage (Temporary)';
        }
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
        this.loginForm.reset();
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
            button.textContent = `Access ${featureName}`;
            alert(`${featureName} feature would open here in a real application.`);
        }, 1000);
    }

    // Public methods for debugging
    getCurrentSession() {
        return this.currentSession ? { ...this.currentSession } : null;
    }

    getStorageInfo() {
        return {
            localStorage: localStorage.getItem('secure_session') ? 'Has session' : 'Empty',
            sessionStorage: sessionStorage.getItem('secure_session') ? 'Has session' : 'Empty'
        };
    }

    isAuthenticated() {
        return this.currentSession !== null;
    }
}

// Initialize the secure authentication app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.authApp = new SecureAuthApp();
    
    console.log('🔐 Secure Login + Remember Me System initialized');
    console.log('👥 Demo accounts: admin/secure123, user/password456');
    console.log('🛡️ Features: Remember Me, session persistence, security indicators');
    console.log('🔧 Try: authApp.getCurrentSession() to see current session');
    console.log('💾 Try: authApp.getStorageInfo() to check storage state');
    console.log('🔍 Try: authApp.isAuthenticated() to check auth status');
});