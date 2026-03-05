/**
 * OBSERVABILITY DASHBOARD - Teaching System Health Monitoring
 * 
 * Key Observability Concepts Demonstrated:
 * 1. Continuous Monitoring - Systems must be watched constantly
 * 2. Health States - Clear categorization of component status
 * 3. Early Warning - Degraded state prevents total failures
 * 4. Alert Management - Immediate notification of critical issues
 * 5. Real-time Updates - Fresh data for accurate decision making
 */

class ObservabilityDashboard {
    constructor() {
        // System components to monitor - represents real microservices/infrastructure
        this.components = [
            { id: 'api-gateway', name: 'API Gateway', status: 'healthy', description: 'Main entry point for all requests' },
            { id: 'user-service', name: 'User Service', status: 'healthy', description: 'Authentication and user management' },
            { id: 'payment-service', name: 'Payment Service', status: 'healthy', description: 'Payment processing and billing' },
            { id: 'database', name: 'Primary Database', status: 'healthy', description: 'Main PostgreSQL cluster' },
            { id: 'cache-redis', name: 'Redis Cache', status: 'healthy', description: 'Session and data caching' },
            { id: 'message-queue', name: 'Message Queue', status: 'healthy', description: 'Async task processing' }
        ];

        // Health monitoring configuration
        this.updateInterval = 3000; // 3 seconds - frequent updates for demo
        this.healthCheckTimer = null;
        this.alertShown = false;

        // Initialize the dashboard
        this.init();
    }

    /**
     * Initialize the observability dashboard
     * Sets up DOM elements, starts monitoring, and begins health simulation
     */
    init() {
        this.renderComponents();
        this.updateStats();
        this.startHealthMonitoring();
        this.setupEventListeners();
        this.updateTimestamp();
        
        console.log('🔍 Observability Dashboard initialized - Monitoring started');
    }

    /**
     * CORE CONCEPT: Continuous Health Monitoring
     * Real systems need constant health checks to detect issues early
     */
    startHealthMonitoring() {
        this.healthCheckTimer = setInterval(() => {
            this.simulateHealthChanges();
            this.renderComponents();
            this.updateStats();
            this.checkForAlerts();
            this.updateTimestamp();
        }, this.updateInterval);
    }

    /**
     * Simulate realistic health state transitions
     * Teaching concept: Systems don't just fail - they degrade first
     */
    simulateHealthChanges() {
        this.components.forEach(component => {
            const random = Math.random();
            
            // Health state transition probabilities (realistic simulation)
            switch (component.status) {
                case 'healthy':
                    if (random < 0.05) { // 5% chance to degrade
                        component.status = 'degraded';
                        console.log(`⚠️ ${component.name} is now DEGRADED`);
                    }
                    break;
                    
                case 'degraded':
                    if (random < 0.15) { // 15% chance to fail from degraded
                        component.status = 'down';
                        console.log(`🚨 ${component.name} is now DOWN`);
                    } else if (random < 0.25) { // 10% chance to recover
                        component.status = 'healthy';
                        console.log(`✅ ${component.name} recovered to HEALTHY`);
                    }
                    break;
                    
                case 'down':
                    if (random < 0.20) { // 20% chance to start recovering
                        component.status = 'degraded';
                        console.log(`🔄 ${component.name} recovering to DEGRADED`);
                    }
                    break;
            }
            
            // Update last check timestamp
            component.lastCheck = new Date();
        });
    }

    /**
     * Render component cards with current health status
     * Visual representation is crucial for quick status assessment
     */
    renderComponents() {
        const container = document.getElementById('components-grid');
        
        container.innerHTML = this.components.map(component => `
            <div class="component-card ${component.status}">
                <div class="component-header">
                    <div class="component-name">${component.name}</div>
                    <div class="status-badge ${component.status}">${component.status}</div>
                </div>
                <div class="component-details">
                    ${component.description}
                    <div class="last-check">
                        Last check: ${component.lastCheck ? this.formatTime(component.lastCheck) : 'Never'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Update overview statistics
     * High-level metrics help identify system-wide trends
     */
    updateStats() {
        const stats = this.components.reduce((acc, component) => {
            acc[component.status] = (acc[component.status] || 0) + 1;
            return acc;
        }, {});

        document.getElementById('healthy-count').textContent = stats.healthy || 0;
        document.getElementById('degraded-count').textContent = stats.degraded || 0;
        document.getElementById('down-count').textContent = stats.down || 0;
    }

    /**
     * CRITICAL CONCEPT: Alert Management
     * Failed components must trigger immediate notifications
     */
    checkForAlerts() {
        const downComponents = this.components.filter(c => c.status === 'down');
        const alertBanner = document.getElementById('alert-banner');
        const alertMessage = document.getElementById('alert-message');

        if (downComponents.length > 0 && !this.alertShown) {
            // Show alert for critical failures
            const componentNames = downComponents.map(c => c.name).join(', ');
            alertMessage.textContent = `🚨 CRITICAL: ${downComponents.length} component(s) down: ${componentNames}`;
            alertBanner.classList.remove('hidden');
            this.alertShown = true;
            
            // Log for debugging/audit trail
            console.error(`🚨 ALERT TRIGGERED: ${componentNames} are down`);
            
        } else if (downComponents.length === 0 && this.alertShown) {
            // Auto-dismiss alert when all components recover
            alertBanner.classList.add('hidden');
            this.alertShown = false;
            console.log('✅ All components recovered - Alert cleared');
        }
    }

    /**
     * Setup event listeners for user interactions
     */
    setupEventListeners() {
        // Manual alert dismissal
        document.getElementById('dismiss-alert').addEventListener('click', () => {
            document.getElementById('alert-banner').classList.add('hidden');
            this.alertShown = false;
        });
    }

    /**
     * Update the last updated timestamp
     * Shows users that monitoring is active and data is fresh
     */
    updateTimestamp() {
        document.getElementById('last-updated').textContent = this.formatTime(new Date());
    }

    /**
     * Format timestamp for display
     */
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    /**
     * Cleanup method - important for production systems
     */
    destroy() {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
            console.log('🛑 Health monitoring stopped');
        }
    }
}

/**
 * TEACHING MOMENT: Why Observability Matters
 * 
 * This dashboard demonstrates core observability principles:
 * 
 * 1. VISIBILITY: You can't fix what you can't see
 * 2. PROACTIVE MONITORING: Catch issues before users do
 * 3. HEALTH STATES: Not just up/down - degraded state prevents cascading failures
 * 4. REAL-TIME UPDATES: Stale data leads to wrong decisions
 * 5. ALERTING: Critical issues need immediate attention
 * 6. CONTEXT: Each component shows what it does and when it was last checked
 * 
 * In production systems, this would connect to:
 * - Health check endpoints (/health, /ready, /live)
 * - Metrics systems (Prometheus, CloudWatch)
 * - Log aggregation (ELK stack, Splunk)
 * - APM tools (New Relic, Datadog)
 */

// Initialize the dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new ObservabilityDashboard();
    
    // Educational console messages for interns
    console.log(`
🎯 OBSERVABILITY LEARNING OBJECTIVES:

1. Monitor component health continuously
2. Use color coding for quick status assessment  
3. Show degraded state as early warning
4. Alert immediately on critical failures
5. Keep data fresh with regular updates
6. Provide context for each component

Watch the console for health state changes!
    `);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.dashboard) {
        window.dashboard.destroy();
    }
});