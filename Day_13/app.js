/**
 * Resilience & Recovery System
 * Teaching failure detection, recovery, and rollback strategies
 */

class ResilienceSystem {
    constructor() {
        // System components with their initial stable state
        this.components = {
            'auth-service': { name: 'Authentication Service', state: 'stable', lastStable: Date.now() },
            'api-gateway': { name: 'API Gateway', state: 'stable', lastStable: Date.now() },
            'database': { name: 'Database Cluster', state: 'stable', lastStable: Date.now() },
            'cache-layer': { name: 'Cache Layer', state: 'stable', lastStable: Date.now() }
        };
        
        this.incidentLog = [];
        this.init();
    }

    init() {
        this.renderComponents();
        this.bindEvents();
        this.logIncident('System initialized - All components stable', 'success');
    }

    /**
     * Render system components in the UI
     */
    renderComponents() {
        const grid = document.getElementById('componentsGrid');
        grid.innerHTML = '';
        
        Object.entries(this.components).forEach(([id, component]) => {
            const card = document.createElement('div');
            card.className = `component-card state-${component.state}`;
            card.innerHTML = `
                <div class="component-name">${component.name}</div>
                <div class="component-status">${component.state}</div>
            `;
            grid.appendChild(card);
        });
    }

    /**
     * Bind event listeners to control buttons
     */
    bindEvents() {
        document.getElementById('injectFailure').addEventListener('click', () => this.injectFailure());
        document.getElementById('recover').addEventListener('click', () => this.recover());
        document.getElementById('rollback').addEventListener('click', () => this.rollback());
    }

    /**
     * Failure Injection: Randomly fails one or more components
     * Teaching: Real systems fail unpredictably
     */
    injectFailure() {
        const stableComponents = Object.keys(this.components)
            .filter(id => this.components[id].state === 'stable');
        
        if (stableComponents.length === 0) {
            this.logIncident('No stable components to fail', 'warning');
            return;
        }

        // Randomly select 1-2 components to fail
        const failCount = Math.random() > 0.7 ? 2 : 1;
        const toFail = this.shuffleArray(stableComponents).slice(0, failCount);
        
        toFail.forEach(componentId => {
            this.components[componentId].state = 'failed';
            this.logIncident(`FAILURE: ${this.components[componentId].name} has failed`, 'error');
        });
        
        this.renderComponents();
        this.logIncident(`Failure injection complete - ${toFail.length} component(s) affected`, 'error');
    }

    /**
     * Recovery Process: Attempts to restore failed components
     * Teaching: Recovery is a process, not instant
     */
    async recover() {
        const failedComponents = Object.keys(this.components)
            .filter(id => this.components[id].state === 'failed');
        
        if (failedComponents.length === 0) {
            this.logIncident('No failed components to recover', 'info');
            return;
        }

        this.logIncident('Starting recovery process...', 'warning');
        
        // Set components to recovering state
        failedComponents.forEach(componentId => {
            this.components[componentId].state = 'recovering';
        });
        this.renderComponents();
        
        // Simulate recovery time (2-4 seconds per component)
        for (const componentId of failedComponents) {
            const recoveryTime = 2000 + Math.random() * 2000;
            
            setTimeout(() => {
                // 80% success rate for recovery
                if (Math.random() > 0.2) {
                    this.components[componentId].state = 'stable';
                    this.components[componentId].lastStable = Date.now();
                    this.logIncident(`RECOVERED: ${this.components[componentId].name} restored to stable`, 'success');
                } else {
                    this.components[componentId].state = 'failed';
                    this.logIncident(`RECOVERY FAILED: ${this.components[componentId].name} could not be restored`, 'error');
                }
                this.renderComponents();
            }, recoveryTime);
        }
    }

    /**
     * Rollback Strategy: Restore all components to last known stable state
     * Teaching: When recovery fails, rollback provides safety net
     */
    rollback() {
        this.logIncident('ROLLBACK INITIATED: Restoring all components to last stable state', 'warning');
        
        let rolledBackCount = 0;
        Object.keys(this.components).forEach(componentId => {
            if (this.components[componentId].state !== 'stable') {
                this.components[componentId].state = 'rolledback';
                rolledBackCount++;
            }
        });
        
        this.renderComponents();
        
        // Simulate rollback completion (1 second)
        setTimeout(() => {
            Object.keys(this.components).forEach(componentId => {
                if (this.components[componentId].state === 'rolledback') {
                    this.components[componentId].state = 'stable';
                    this.components[componentId].lastStable = Date.now();
                }
            });
            
            this.renderComponents();
            this.logIncident(`ROLLBACK COMPLETE: ${rolledBackCount} component(s) restored to stable state`, 'success');
            this.logIncident('System stability restored - Ready for normal operations', 'success');
        }, 1000);
    }

    /**
     * Incident Logging: Track all system events with timestamps
     * Teaching: Observability is crucial for system reliability
     */
    logIncident(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const entry = { timestamp, message, type };
        
        this.incidentLog.unshift(entry); // Add to beginning for newest first
        
        // Keep only last 50 entries
        if (this.incidentLog.length > 50) {
            this.incidentLog = this.incidentLog.slice(0, 50);
        }
        
        this.renderLog();
    }

    /**
     * Render incident log in the UI
     */
    renderLog() {
        const container = document.getElementById('logContainer');
        container.innerHTML = '';
        
        this.incidentLog.forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-${entry.type}`;
            logEntry.innerHTML = `
                <span class="timestamp">[${entry.timestamp}]</span>
                ${entry.message}
            `;
            container.appendChild(logEntry);
        });
        
        // Auto-scroll to top for newest entries
        container.scrollTop = 0;
    }

    /**
     * Utility: Shuffle array for random component selection
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

/**
 * Initialize the Resilience System when DOM is loaded
 * Teaching: System initialization is the foundation of reliability
 */
document.addEventListener('DOMContentLoaded', () => {
    window.resilienceSystem = new ResilienceSystem();
    
    // Educational console messages for interns
    console.log('🔧 Resilience & Recovery System Initialized');
    console.log('📚 Learning Objectives:');
    console.log('   • Failure is inevitable - plan for it');
    console.log('   • Quick detection enables fast recovery');
    console.log('   • Rollback strategies provide safety nets');
    console.log('   • Observability through logging is crucial');
    console.log('💡 Try: Inject failures, attempt recovery, use rollback when needed');
});