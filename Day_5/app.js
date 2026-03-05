/**
 * RBAC Admin Dashboard - Role-Based Access Control Demo
 * Educational implementation of authorization patterns with UI guards
 */

class RBACApp {
    constructor() {
        // Central permissions map - role → allowed permissions
        this.permissions = {
            admin: [
                'manage_users', 'system_settings', 'view_logs', 'delete_data',
                'view_reports', 'manage_content', 'export_data',
                'view_profile', 'edit_profile', 'view_dashboard'
            ],
            manager: [
                'view_reports', 'manage_content', 'export_data',
                'view_profile', 'edit_profile', 'view_dashboard'
            ],
            user: [
                'view_profile', 'edit_profile', 'view_dashboard'
            ]
        };

        // Demo user accounts
        this.users = {
            admin: { username: 'admin', password: 'admin123', role: 'admin' },
            manager: { username: 'manager', password: 'manager123', role: 'manager' },
            user: { username: 'user', password: 'user123', role: 'user' }
        };

        this.currentUser = null;
        this.initializeElements();
        this.initializeEventListeners();
        this.checkSession();
    }

    // Initialize DOM element references
    initializeElements() {
        // Login elements
        this.loginContainer = document.getElementById('loginContainer');
        this.loginForm = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.usernameError = document.getElementById('usernameError');
        this.passwordError = document.getElementById('passwordError');
        
        // Dashboard elements
        this.dashboard = document.getElementById('dashboard');
        this.currentUserSpan = document.getElementById('currentUser');
        this.currentRoleSpan = document.getElementById('currentRole');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Panel elements
        this.adminPanel = document.getElementById('adminPanel');
        this.managerPanel = document.getElementById('managerPanel');
        this.userPanel = document.getElementById('userPanel');
        this.unauthorizedPanel = document.getElementById('unauthorizedPanel');
        this.requiredRole = document.getElementById('requiredRole');
        
        // Modal elements
        this.actionModal = document.getElementById('actionModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        this.modalClose = document.getElementById('modalClose');
    }

    // Set up event listeners
    initializeEventListeners() {
        // Login form
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Logout button
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Action buttons with permission guards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.action-btn')) {
                const permission = e.target.closest('.action-btn').dataset.permission;
                if (permission) {
                    this.handleAction(permission, e.target.closest('.action-btn'));
                }
            }
        });
        
        // Modal close
        this.modalClose.addEventListener('click', () => this.hideModal());
        this.actionModal.addEventListener('click', (e) => {
            if (e.target === this.actionModal) this.hideModal();
        });
    }

    // SESSION MANAGEMENT: Check for existing session
    checkSession() {
        const session = localStorage.getItem('rbac_session');
        if (session) {
            try {
                const userData = JSON.parse(session);
                if (this.isValidSession(userData)) {
                    this.currentUser = userData;
                    this.showDashboard();
                    return;
                }
            } catch (error) {
                console.error('Invalid session data:', error);
            }
        }
        this.showLogin();
    }

    // Validate session data
    isValidSession(userData) {
        return userData && 
               userData.username && 
               userData.role && 
               this.permissions[userData.role];
    }

    // AUTHENTICATION: Handle login form submission
    handleLogin(e) {
        e.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();
        
        // Clear previous errors
        this.clearErrors();
        
        // Validate inputs
        if (!this.validateLogin(username, password)) {
            return;
        }
        
        // Authenticate user
        const user = this.authenticateUser(username, password);
        if (user) {
            this.loginUser(user);
        } else {
            this.showError('Invalid username or password');
        }
    }

    // Validate login inputs
    validateLogin(username, password) {
        let isValid = true;
        
        if (!username) {
            this.usernameError.textContent = 'Username is required';
            isValid = false;
        }
        
        if (!password) {
            this.passwordError.textContent = 'Password is required';
            isValid = false;
        }
        
        return isValid;
    }

    // Authenticate user credentials
    authenticateUser(username, password) {
        const user = this.users[username];
        if (user && user.password === password) {
            return {
                username: user.username,
                role: user.role,
                loginTime: new Date().toISOString()
            };
        }
        return null;
    }

    // Login user and create session
    loginUser(user) {
        this.currentUser = user;
        
        // Store session in localStorage
        localStorage.setItem('rbac_session', JSON.stringify(user));
        
        // Show dashboard
        this.showDashboard();
    }

    // Quick login for demo accounts
    quickLogin(username, password) {
        this.usernameInput.value = username;
        this.passwordInput.value = password;
        this.handleLogin(new Event('submit'));
    }

    // AUTHORIZATION: Check if user has specific permission
    hasPermission(permission) {
        if (!this.currentUser || !this.currentUser.role) {
            return false;
        }
        
        const userPermissions = this.permissions[this.currentUser.role] || [];
        return userPermissions.includes(permission);
    }

    // Get minimum role required for permission
    getRequiredRole(permission) {
        for (const [role, permissions] of Object.entries(this.permissions)) {
            if (permissions.includes(permission)) {
                return role;
            }
        }
        return 'admin';
    }

    // UI GUARDS: Handle action with permission check
    handleAction(permission, buttonElement) {
        if (!this.hasPermission(permission)) {
            this.showUnauthorized(permission);
            return;
        }
        
        // Simulate action execution
        this.executeAction(permission, buttonElement);
    }

    // Execute authorized action
    executeAction(permission, buttonElement) {
        const actionText = buttonElement.querySelector('.action-text').textContent;
        
        // Simulate processing
        buttonElement.style.opacity = '0.6';
        buttonElement.style.pointerEvents = 'none';
        
        setTimeout(() => {
            buttonElement.style.opacity = '1';
            buttonElement.style.pointerEvents = 'auto';
            
            this.showActionResult(actionText, `${actionText} completed successfully!`);
        }, 800);
    }

    // Show unauthorized access message
    showUnauthorized(permission) {
        const requiredRole = this.getRequiredRole(permission);
        this.requiredRole.textContent = requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1);
        
        // Hide all panels and show unauthorized
        this.hideAllPanels();
        this.unauthorizedPanel.style.display = 'block';
        this.unauthorizedPanel.classList.add('fade-in');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.renderDashboard();
        }, 3000);
    }

    // LOGOUT: Handle user logout
    handleLogout() {
        // Clear session
        localStorage.removeItem('rbac_session');
        this.currentUser = null;
        
        // Show login screen
        this.showLogin();
    }

    // UI RENDERING: Show login screen
    showLogin() {
        this.loginContainer.style.display = 'flex';
        this.dashboard.style.display = 'none';
        this.clearForm();
        this.clearErrors();
    }

    // Show dashboard
    showDashboard() {
        this.loginContainer.style.display = 'none';
        this.dashboard.style.display = 'flex';
        this.dashboard.classList.add('fade-in');
        
        this.updateUserInfo();
        this.renderDashboard();
    }

    // Update user info in header
    updateUserInfo() {
        if (this.currentUser) {
            this.currentUserSpan.textContent = this.currentUser.username;
            this.currentRoleSpan.textContent = this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1);
            this.currentRoleSpan.className = `role-badge ${this.currentUser.role}`;
        }
    }

    // CORE RENDER: Render dashboard based on user role and permissions
    renderDashboard() {
        this.hideAllPanels();
        this.renderActionButtons();
        
        // Show panels based on role hierarchy
        if (this.hasPermission('view_profile')) {
            this.userPanel.style.display = 'block';
        }
        
        if (this.hasPermission('view_reports')) {
            this.managerPanel.style.display = 'block';
        }
        
        if (this.hasPermission('manage_users')) {
            this.adminPanel.style.display = 'block';
        }
    }

    // Apply permission guards to action buttons
    renderActionButtons() {
        const actionButtons = document.querySelectorAll('.action-btn[data-permission]');
        
        actionButtons.forEach(button => {
            const permission = button.dataset.permission;
            const hasAccess = this.hasPermission(permission);
            
            // UI Guard: Disable unauthorized buttons
            button.disabled = !hasAccess;
            
            // Visual feedback for unauthorized actions
            if (!hasAccess) {
                button.style.opacity = '0.5';
                button.title = `Requires ${this.getRequiredRole(permission)} role`;
            } else {
                button.style.opacity = '1';
                button.title = '';
            }
        });
    }

    // Hide all dashboard panels
    hideAllPanels() {
        this.adminPanel.style.display = 'none';
        this.managerPanel.style.display = 'none';
        this.userPanel.style.display = 'none';
        this.unauthorizedPanel.style.display = 'none';
    }

    // UTILITY FUNCTIONS
    clearForm() {
        this.usernameInput.value = '';
        this.passwordInput.value = '';
    }

    clearErrors() {
        this.usernameError.textContent = '';
        this.passwordError.textContent = '';
    }

    showError(message) {
        this.passwordError.textContent = message;
    }

    // Show action result modal
    showActionResult(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.actionModal.style.display = 'flex';
    }

    hideModal() {
        this.actionModal.style.display = 'none';
    }

    // Public method to get current user info (for debugging)
    getCurrentUser() {
        return this.currentUser ? { ...this.currentUser } : null;
    }

    // Public method to check permissions (for debugging)
    checkPermission(permission) {
        return this.hasPermission(permission);
    }
}

// Initialize the RBAC application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.rbacApp = new RBACApp();
    
    console.log('🔐 RBAC Admin Dashboard initialized');
    console.log('👥 Demo accounts: admin/admin123, manager/manager123, user/user123');
    console.log('🛡️ Features: Role-based permissions, UI guards, session management');
    console.log('🔧 Try: rbacApp.getCurrentUser() to see current session');
    console.log('🔍 Try: rbacApp.checkPermission("manage_users") to test permissions');
});