// Service Orchestrator System - Multi-Service Workflow Engine
// Demonstrates how real-world platforms coordinate multiple services

class ServiceOrchestrator {
    constructor() {
        this.logContainer = document.getElementById('logContent');
        this.runButton = document.getElementById('runWorkflow');
        this.isRunning = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.runButton.addEventListener('click', () => this.startWorkflow());
    }

    // Central logging system - tracks all service activities
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        this.logContainer.appendChild(logEntry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    // Main orchestrator function - controls entire workflow execution
    async startWorkflow() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.runButton.disabled = true;
        this.logContainer.innerHTML = '';
        
        this.log('🚀 WORKFLOW STARTED - Service Orchestrator Initialized', 'info');
        this.log('📋 Pipeline: Auth → Profile → Notification', 'info');
        this.log('─'.repeat(50), 'info');

        try {
            // Sequential service execution with failure handling
            await this.executeService('Auth Service', this.authService.bind(this));
            await this.executeService('Profile Service', this.profileService.bind(this));
            await this.executeService('Notification Service', this.notificationService.bind(this));
            
            this.log('─'.repeat(50), 'success');
            this.log('✅ WORKFLOW COMPLETED SUCCESSFULLY', 'success');
            this.log('All services executed without errors', 'success');
            
        } catch (error) {
            this.log('─'.repeat(50), 'error');
            this.log('❌ WORKFLOW FAILED', 'error');
            this.log(`Pipeline stopped due to: ${error.message}`, 'error');
        } finally {
            this.isRunning = false;
            this.runButton.disabled = false;
        }
    }

    // Service execution wrapper - handles logging and error propagation
    async executeService(serviceName, serviceFunction) {
        this.log(`⏳ Starting ${serviceName}...`, 'info');
        
        try {
            await serviceFunction();
            this.log(`✅ ${serviceName} completed successfully`, 'success');
        } catch (error) {
            this.log(`❌ ${serviceName} failed: ${error.message}`, 'error');
            throw error; // Stop pipeline on failure
        }
    }

    // Auth Service - Simulates user authentication
    async authService() {
        return new Promise((resolve, reject) => {
            // Simulate async authentication process
            setTimeout(() => {
                // 20% chance of failure to demonstrate error handling
                if (Math.random() < 0.2) {
                    reject(new Error('Authentication timeout'));
                } else {
                    this.log('  → User credentials validated', 'info');
                    this.log('  → JWT token generated', 'info');
                    resolve();
                }
            }, 1500);
        });
    }

    // Profile Service - Simulates user profile loading
    async profileService() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 15% chance of failure
                if (Math.random() < 0.15) {
                    reject(new Error('Profile database unavailable'));
                } else {
                    this.log('  → User profile retrieved', 'info');
                    this.log('  → Preferences loaded', 'info');
                    resolve();
                }
            }, 1200);
        });
    }

    // Notification Service - Simulates sending notifications
    async notificationService() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 10% chance of failure
                if (Math.random() < 0.1) {
                    reject(new Error('Notification service unreachable'));
                } else {
                    this.log('  → Welcome notification sent', 'info');
                    this.log('  → Email confirmation queued', 'info');
                    resolve();
                }
            }, 1000);
        });
    }
}

// Initialize the orchestrator when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ServiceOrchestrator();
});

/*
LEARNING POINTS FOR INTERNS:

1. ORCHESTRATOR PATTERN:
   - Central control point manages service execution
   - Enforces execution order and dependencies
   - Handles cross-service error propagation

2. ASYNC WORKFLOW MANAGEMENT:
   - Services run asynchronously but in sequence
   - Promise-based error handling stops pipeline on failure
   - Proper resource cleanup in finally blocks

3. LOGGING & OBSERVABILITY:
   - Comprehensive logging for debugging and monitoring
   - Timestamped entries for audit trails
   - Different log levels for various event types

4. ERROR HANDLING STRATEGY:
   - Fail-fast approach stops pipeline on first error
   - Graceful degradation with user feedback
   - Service isolation prevents cascading failures

5. REAL-WORLD APPLICATIONS:
   - User onboarding workflows
   - Payment processing pipelines
   - Data processing chains
   - Microservice orchestration
*/