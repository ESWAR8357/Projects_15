/**
 * Async Data Dashboard - Production-Quality Async JavaScript
 * Demonstrates proper async/await patterns with comprehensive error handling
 */

class AsyncDataDashboard {
    constructor() {
        // Single source of truth for application state
        this.state = {
            isLoading: false,
            data: null,
            error: null,
            lastUpdated: null,
            requestInProgress: false
        };
        
        this.initializeElements();
        this.initializeEventListeners();
        this.render();
    }

    // Initialize DOM element references
    initializeElements() {
        // Control elements
        this.loadBtn = document.getElementById('loadBtn');
        this.retryBtn = document.getElementById('retryBtn');
        this.loadIcon = document.getElementById('loadIcon');
        this.loadText = document.getElementById('loadText');
        
        // Status elements
        this.statusIndicator = document.getElementById('statusIndicator');
        this.lastUpdated = document.getElementById('lastUpdated');
        this.updateTime = document.getElementById('updateTime');
        this.dataCount = document.getElementById('dataCount');
        
        // State display elements
        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        this.successState = document.getElementById('successState');
        this.dataDisplay = document.getElementById('dataDisplay');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorDetails = document.getElementById('errorDetails');
    }

    // Set up event listeners
    initializeEventListeners() {
        this.loadBtn.addEventListener('click', () => this.handleLoadData());
        this.retryBtn.addEventListener('click', () => this.handleRetry());
    }

    // ASYNC CORE: Main data fetching function with proper error handling
    async fetchData() {
        try {
            // Simulate API endpoint - replace with real API
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
            
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Parse JSON data
            const data = await response.json();
            
            // Simulate processing time for better UX demonstration
            await this.delay(800);
            
            return data;
            
        } catch (error) {
            // Differentiate between network and server errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Please check your internet connection');
            } else if (error.message.includes('HTTP')) {
                throw new Error(`Server error: ${error.message}`);
            } else {
                throw new Error(`Unexpected error: ${error.message}`);
            }
        }
    }

    // Utility function to simulate async delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ASYNC LIFECYCLE: Handle load data with complete async flow
    async handleLoadData() {
        // Prevent multiple simultaneous requests
        if (this.state.requestInProgress) {
            console.log('Request already in progress, ignoring...');
            return;
        }

        try {
            // Set loading state
            this.updateState({
                isLoading: true,
                error: null,
                requestInProgress: true
            });

            // Fetch data using async/await
            const data = await this.fetchData();

            // Set success state
            this.updateState({
                isLoading: false,
                data: data,
                error: null,
                lastUpdated: new Date(),
                requestInProgress: false
            });

            // Show success message temporarily
            this.showSuccessMessage();

        } catch (error) {
            // Set error state
            this.updateState({
                isLoading: false,
                data: null,
                error: error.message,
                requestInProgress: false
            });

            console.error('Data fetch failed:', error);
        }
    }

    // Handle retry action
    async handleRetry() {
        await this.handleLoadData();
    }

    // State management - single source of truth
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    // RENDER FUNCTION: Single function to update entire UI based on state
    render() {
        this.renderControlPanel();
        this.renderDataSection();
        this.renderStatusIndicator();
    }

    // Render control panel based on current state
    renderControlPanel() {
        // Update load button
        if (this.state.isLoading) {
            this.loadBtn.disabled = true;
            this.loadIcon.textContent = '⏳';
            this.loadText.textContent = 'Loading...';
        } else {
            this.loadBtn.disabled = false;
            this.loadIcon.textContent = '📊';
            this.loadText.textContent = 'Load Data';
        }

        // Show/hide retry button
        if (this.state.error && !this.state.isLoading) {
            this.retryBtn.style.display = 'inline-flex';
        } else {
            this.retryBtn.style.display = 'none';
        }

        // Update last updated timestamp
        if (this.state.lastUpdated) {
            this.lastUpdated.style.display = 'flex';
            this.updateTime.textContent = this.formatTimestamp(this.state.lastUpdated);
        } else {
            this.lastUpdated.style.display = 'none';
        }
    }

    // Render data section based on current state
    renderDataSection() {
        // Hide all states first
        this.hideAllStates();

        if (this.state.isLoading) {
            this.showLoadingState();
        } else if (this.state.error) {
            this.showErrorState();
        } else if (this.state.data) {
            this.showDataState();
        } else {
            this.showEmptyState();
        }

        // Update data count
        const count = this.state.data ? this.state.data.length : 0;
        this.dataCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    }

    // Render status indicator
    renderStatusIndicator() {
        const statusText = this.statusIndicator.querySelector('.status-text');
        
        // Remove all status classes
        this.statusIndicator.classList.remove('loading', 'success', 'error');
        
        if (this.state.isLoading) {
            this.statusIndicator.classList.add('loading');
            statusText.textContent = 'Loading...';
        } else if (this.state.error) {
            this.statusIndicator.classList.add('error');
            statusText.textContent = 'Error';
        } else if (this.state.data) {
            this.statusIndicator.classList.add('success');
            statusText.textContent = 'Data Loaded';
        } else {
            statusText.textContent = 'Ready';
        }
    }

    // State display functions
    hideAllStates() {
        this.loadingState.style.display = 'none';
        this.errorState.style.display = 'none';
        this.successState.style.display = 'none';
        this.dataDisplay.innerHTML = '';
    }

    showLoadingState() {
        this.loadingState.style.display = 'block';
        this.loadingState.classList.add('fade-in');
    }

    showErrorState() {
        this.errorState.style.display = 'block';
        this.errorMessage.textContent = this.state.error;
        
        // Show technical details for debugging
        this.errorDetails.textContent = `Error occurred at: ${new Date().toLocaleString()}`;
        this.errorState.classList.add('fade-in');
    }

    showDataState() {
        this.renderDataCards();
    }

    showEmptyState() {
        this.dataDisplay.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No data loaded</h3>
                <p>Click "Load Data" to fetch information from the API</p>
            </div>
        `;
    }

    // Render data as formatted cards
    renderDataCards() {
        if (!this.state.data || this.state.data.length === 0) {
            this.showEmptyState();
            return;
        }

        const cardsHTML = this.state.data.map(item => `
            <div class="data-card fade-in">
                <h4>${this.truncateText(item.title, 50)}</h4>
                <p>${this.truncateText(item.body, 120)}</p>
                <div class="data-meta">
                    <div>ID: ${item.id} • User: ${item.userId}</div>
                </div>
            </div>
        `).join('');

        this.dataDisplay.innerHTML = `
            <div class="data-grid">
                ${cardsHTML}
            </div>
        `;
    }

    // Show temporary success message
    showSuccessMessage() {
        this.successState.style.display = 'block';
        this.successState.classList.add('fade-in');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.successState.style.display = 'none';
        }, 3000);
    }

    // Utility functions
    formatTimestamp(date) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Public method to get current state (for debugging)
    getState() {
        return { ...this.state };
    }

    // Public method to manually trigger data load (for testing)
    async loadData() {
        await this.handleLoadData();
    }
}

// Initialize the dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AsyncDataDashboard();
    
    console.log('🚀 Async Data Dashboard initialized');
    console.log('📡 Features: async/await, error handling, loading states');
    console.log('🔧 Try: dashboard.getState() to see current state');
    console.log('🔄 Try: dashboard.loadData() to manually trigger fetch');
});