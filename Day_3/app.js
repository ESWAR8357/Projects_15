/**
 * User Profile Manager - Production-Quality Architecture
 * Modular JavaScript with CRUD operations and LocalStorage persistence
 */

class UserProfileManager {
    constructor() {
        this.profiles = [];
        this.selectedProfile = null;
        this.isEditMode = false;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadProfiles();
        this.render();
    }

    // Initialize DOM element references
    initializeElements() {
        // Form elements
        this.form = document.getElementById('profileForm');
        this.nameInput = document.getElementById('nameInput');
        this.emailInput = document.getElementById('emailInput');
        this.roleInput = document.getElementById('roleInput');
        
        // Buttons
        this.saveBtn = document.getElementById('saveBtn');
        this.updateBtn = document.getElementById('updateBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        
        // Display elements
        this.formTitle = document.getElementById('formTitle');
        this.modeIndicator = document.getElementById('modeIndicator');
        this.profilesList = document.getElementById('profilesList');
        this.profileCount = document.getElementById('profileCount');
        this.emptyState = document.getElementById('emptyState');
        this.searchInput = document.getElementById('searchInput');
        
        // Modal elements
        this.deleteModal = document.getElementById('deleteModal');
        this.deletePreview = document.getElementById('deletePreview');
        this.confirmDelete = document.getElementById('confirmDelete');
        this.cancelDelete = document.getElementById('cancelDelete');
        
        // Error elements
        this.nameError = document.getElementById('nameError');
        this.emailError = document.getElementById('emailError');
        this.roleError = document.getElementById('roleError');
    }

    // Set up event listeners
    initializeEventListeners() {
        // Form events
        this.form.addEventListener('submit', (e) => this.handleSave(e));
        this.updateBtn.addEventListener('click', () => this.handleUpdate());
        this.cancelBtn.addEventListener('click', () => this.handleCancel());
        
        // Search
        this.searchInput.addEventListener('input', () => this.handleSearch());
        
        // Modal events
        this.cancelDelete.addEventListener('click', () => this.hideDeleteModal());
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) this.hideDeleteModal();
        });
        
        // Real-time validation
        this.nameInput.addEventListener('input', () => this.validateField('name'));
        this.emailInput.addEventListener('input', () => this.validateField('email'));
        this.roleInput.addEventListener('change', () => this.validateField('role'));
    }

    // CRUD Operations
    createProfile(profileData) {
        const profile = {
            id: this.generateId(),
            ...profileData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.profiles.push(profile);
        this.saveToStorage();
        return profile;
    }

    updateProfile(id, profileData) {
        const index = this.profiles.findIndex(p => p.id === id);
        if (index !== -1) {
            this.profiles[index] = {
                ...this.profiles[index],
                ...profileData,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage();
            return this.profiles[index];
        }
        return null;
    }

    deleteProfile(id) {
        const index = this.profiles.findIndex(p => p.id === id);
        if (index !== -1) {
            const deleted = this.profiles.splice(index, 1)[0];
            this.saveToStorage();
            return deleted;
        }
        return null;
    }

    getProfile(id) {
        return this.profiles.find(p => p.id === id);
    }

    // Data persistence
    saveToStorage() {
        localStorage.setItem('userProfiles', JSON.stringify(this.profiles));
    }

    loadProfiles() {
        const stored = localStorage.getItem('userProfiles');
        this.profiles = stored ? JSON.parse(stored) : [];
    }

    // Utility functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Validation
    validateField(field) {
        let isValid = true;
        let errorMessage = '';

        switch (field) {
            case 'name':
                const name = this.nameInput.value.trim();
                if (!name) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (name.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                this.nameError.textContent = errorMessage;
                break;

            case 'email':
                const email = this.emailInput.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(email)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                } else if (this.isEmailTaken(email)) {
                    errorMessage = 'This email is already in use';
                    isValid = false;
                }
                this.emailError.textContent = errorMessage;
                break;

            case 'role':
                const role = this.roleInput.value;
                if (!role) {
                    errorMessage = 'Please select a role';
                    isValid = false;
                }
                this.roleError.textContent = errorMessage;
                break;
        }

        return isValid;
    }

    validateForm() {
        const nameValid = this.validateField('name');
        const emailValid = this.validateField('email');
        const roleValid = this.validateField('role');
        
        return nameValid && emailValid && roleValid;
    }

    isEmailTaken(email) {
        return this.profiles.some(p => 
            p.email.toLowerCase() === email.toLowerCase() && 
            (!this.selectedProfile || p.id !== this.selectedProfile.id)
        );
    }

    // Event handlers
    handleSave(e) {
        e.preventDefault();
        
        if (!this.validateForm()) return;

        const profileData = {
            name: this.nameInput.value.trim(),
            email: this.emailInput.value.trim(),
            role: this.roleInput.value
        };

        const profile = this.createProfile(profileData);
        this.showSuccessMessage('Profile created successfully!');
        this.resetForm();
        this.render();
        
        // Highlight new profile
        setTimeout(() => {
            this.selectProfile(profile.id);
        }, 100);
    }

    handleUpdate() {
        if (!this.selectedProfile || !this.validateForm()) return;

        const profileData = {
            name: this.nameInput.value.trim(),
            email: this.emailInput.value.trim(),
            role: this.roleInput.value
        };

        this.updateProfile(this.selectedProfile.id, profileData);
        this.showSuccessMessage('Profile updated successfully!');
        this.exitEditMode();
        this.render();
    }

    handleCancel() {
        this.exitEditMode();
        this.resetForm();
    }

    handleSearch() {
        this.render();
    }

    handleEdit(profileId) {
        const profile = this.getProfile(profileId);
        if (!profile) return;

        this.selectedProfile = profile;
        this.isEditMode = true;
        
        // Populate form
        this.nameInput.value = profile.name;
        this.emailInput.value = profile.email;
        this.roleInput.value = profile.role;
        
        this.updateFormMode();
        this.clearErrors();
    }

    handleDelete(profileId) {
        const profile = this.getProfile(profileId);
        if (!profile) return;

        this.showDeleteModal(profile);
    }

    // UI State Management
    updateFormMode() {
        if (this.isEditMode) {
            this.formTitle.textContent = 'Edit Profile';
            this.modeIndicator.textContent = 'Edit Mode';
            this.modeIndicator.classList.add('edit-mode');
            this.saveBtn.style.display = 'none';
            this.updateBtn.style.display = 'inline-flex';
            this.updateBtn.disabled = false;
            this.cancelBtn.style.display = 'inline-flex';
        } else {
            this.formTitle.textContent = 'Create New Profile';
            this.modeIndicator.textContent = 'Create Mode';
            this.modeIndicator.classList.remove('edit-mode');
            this.saveBtn.style.display = 'inline-flex';
            this.updateBtn.style.display = 'inline-flex';
            this.updateBtn.disabled = true;
            this.cancelBtn.style.display = 'none';
        }
    }

    exitEditMode() {
        this.isEditMode = false;
        this.selectedProfile = null;
        this.updateFormMode();
    }

    resetForm() {
        this.form.reset();
        this.clearErrors();
        this.exitEditMode();
    }

    clearErrors() {
        this.nameError.textContent = '';
        this.emailError.textContent = '';
        this.roleError.textContent = '';
    }

    selectProfile(profileId) {
        this.selectedProfile = this.getProfile(profileId);
        this.render();
    }

    // Modal management
    showDeleteModal(profile) {
        this.deletePreview.innerHTML = `
            <strong>${profile.name}</strong><br>
            <small>${profile.email} • ${profile.role}</small>
        `;
        
        this.confirmDelete.onclick = () => {
            this.deleteProfile(profile.id);
            this.hideDeleteModal();
            this.showSuccessMessage('Profile deleted successfully!');
            
            if (this.selectedProfile && this.selectedProfile.id === profile.id) {
                this.resetForm();
            }
            
            this.render();
        };
        
        this.deleteModal.style.display = 'flex';
    }

    hideDeleteModal() {
        this.deleteModal.style.display = 'none';
    }

    // Success messaging
    showSuccessMessage(message) {
        // Simple success indication - could be enhanced with toast notifications
        const btn = this.isEditMode ? this.updateBtn : this.saveBtn;
        const originalText = btn.querySelector('.btn-text').textContent;
        
        btn.querySelector('.btn-text').textContent = '✓ ' + message.split(' ')[1];
        btn.classList.add('success-flash');
        
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = originalText;
            btn.classList.remove('success-flash');
        }, 2000);
    }

    // Main render function - single source of truth for UI updates
    render() {
        this.renderProfilesList();
        this.renderProfileCount();
        this.updateFormMode();
    }

    renderProfilesList() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredProfiles = this.profiles.filter(profile =>
            profile.name.toLowerCase().includes(searchTerm) ||
            profile.email.toLowerCase().includes(searchTerm) ||
            profile.role.toLowerCase().includes(searchTerm)
        );

        if (filteredProfiles.length === 0) {
            this.profilesList.innerHTML = this.emptyState.outerHTML;
            return;
        }

        this.profilesList.innerHTML = filteredProfiles.map(profile => `
            <div class="profile-item ${this.selectedProfile && this.selectedProfile.id === profile.id ? 'selected' : ''}" 
                 onclick="profileManager.selectProfile('${profile.id}')">
                <div class="profile-info">
                    <h4>${profile.name}</h4>
                    <p>${profile.email} • ${profile.role}</p>
                    <div class="profile-meta">
                        Created: ${this.formatDate(profile.createdAt)}
                        ${profile.updatedAt !== profile.createdAt ? `• Updated: ${this.formatDate(profile.updatedAt)}` : ''}
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="action-btn edit-btn" onclick="event.stopPropagation(); profileManager.handleEdit('${profile.id}')">
                        Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="event.stopPropagation(); profileManager.handleDelete('${profile.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderProfileCount() {
        const count = this.profiles.length;
        this.profileCount.textContent = `${count} profile${count !== 1 ? 's' : ''}`;
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new UserProfileManager();
    
    console.log('🚀 User Profile Manager initialized');
    console.log('📊 Architecture: Modular CRUD with LocalStorage persistence');
    console.log('🎯 Features: Validation, Search, Modal confirmations, Responsive design');
});