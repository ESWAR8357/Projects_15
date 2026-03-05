/**
 * Governance, Compliance & Ethics System
 * Demonstrates institutional controls through role-based access and policy enforcement
 */

class GovernanceSystem {
    constructor() {
        this.currentRole = 'guest';
        this.auditLog = [];
        this.initializeSystem();
    }

    /**
     * POLICY ENGINE - Defines institutional rules and access controls
     * Real-world lesson: Clear policies prevent system abuse and ensure accountability
     */
    getPolicyRules() {
        return {
            guest: {
                view: false,      // Guests cannot view sensitive data
                create: false,    // No creation rights
                edit: false,      // No modification rights
                delete: false,    // No deletion rights
                policy: false     // Cannot change governance rules
            },
            user: {
                view: true,       // Users can view data they own
                create: true,     // Can create new records
                edit: false,      // Cannot edit (requires approval)
                delete: false,    // Cannot delete (data protection)
                policy: false     // Cannot change policies
            },
            manager: {
                view: true,       // Full data visibility
                create: true,     // Can create records
                edit: true,       // Can edit team data
                delete: false,    // Cannot delete (audit trail protection)
                policy: false     // Cannot change core policies
            },
            admin: {
                view: true,       // Full system access
                create: true,     // Full creation rights
                edit: true,       // Full edit rights
                delete: true,     // Can delete with proper justification
                policy: true      // Can modify governance policies
            }
        };
    }

    /**
     * COMPLIANCE EVALUATOR - Checks if actions comply with current policies
     * Real-world lesson: Every action must be evaluated against established rules
     */
    evaluateAction(role, action) {
        const policies = this.getPolicyRules();
        const rolePermissions = policies[role];
        
        if (!rolePermissions) {
            return {
                allowed: false,
                reason: 'Invalid role - access denied by security policy'
            };
        }

        const isAllowed = rolePermissions[action] === true;
        
        return {
            allowed: isAllowed,
            reason: isAllowed 
                ? `Action authorized for ${role} role`
                : `Insufficient privileges - ${role} role lacks ${action} permissions`
        };
    }

    /**
     * AUDIT LOGGER - Records all decisions for accountability and compliance
     * Real-world lesson: Audit trails are essential for governance and regulatory compliance
     */
    logDecision(role, action, result, reason) {
        const timestamp = new Date().toLocaleString();
        const logEntry = {
            timestamp,
            role,
            action,
            result: result ? 'ALLOWED' : 'BLOCKED',
            reason,
            id: Date.now()
        };

        this.auditLog.unshift(logEntry);
        this.displayAuditEntry(logEntry);
        
        // Keep audit log manageable (in real systems, this would go to persistent storage)
        if (this.auditLog.length > 50) {
            this.auditLog = this.auditLog.slice(0, 50);
        }
    }

    /**
     * ACTION EXECUTOR - Processes user requests through governance pipeline
     * Real-world lesson: All actions must go through proper authorization channels
     */
    executeAction(action) {
        // Step 1: Policy Evaluation
        const evaluation = this.evaluateAction(this.currentRole, action);
        
        // Step 2: Decision Logging (for accountability)
        this.logDecision(this.currentRole, action, evaluation.allowed, evaluation.reason);
        
        // Step 3: User Feedback
        this.displayFeedback(action, evaluation);
        
        // Step 4: Action Execution (if authorized)
        if (evaluation.allowed) {
            this.performAuthorizedAction(action);
        }
        
        // Step 5: Update UI to reflect current permissions
        this.updateActionButtons();
    }

    /**
     * AUTHORIZED ACTION HANDLER - Simulates actual system operations
     * Real-world lesson: Only execute actions after proper authorization
     */
    performAuthorizedAction(action) {
        const actionMessages = {
            view: 'Data retrieved successfully - access logged for compliance',
            create: 'New record created - change tracked in audit system',
            edit: 'Record updated successfully - modification logged',
            delete: 'Record deleted - action recorded for audit trail',
            policy: 'Governance policy updated - change requires approval workflow'
        };

        // Simulate processing delay (real systems have processing time)
        setTimeout(() => {
            console.log(`✅ ${actionMessages[action]}`);
        }, 100);
    }

    /**
     * UI FEEDBACK SYSTEM - Provides clear communication about governance decisions
     */
    displayFeedback(action, evaluation) {
        const feedbackElement = document.getElementById('feedbackMessage');
        const actionName = action.charAt(0).toUpperCase() + action.slice(1);
        
        if (evaluation.allowed) {
            feedbackElement.textContent = `✅ ${actionName} action completed successfully`;
            feedbackElement.className = 'feedback-message success';
        } else {
            feedbackElement.textContent = `❌ ${actionName} action blocked: ${evaluation.reason}`;
            feedbackElement.className = 'feedback-message error';
        }
    }

    /**
     * AUDIT DISPLAY - Shows governance decisions in real-time
     */
    displayAuditEntry(entry) {
        const auditLog = document.getElementById('auditLog');
        const entryElement = document.createElement('div');
        entryElement.className = `audit-entry ${entry.result.toLowerCase()}`;
        
        entryElement.innerHTML = `
            <span class="timestamp">${entry.timestamp}</span>
            <span class="details">
                ${entry.role.toUpperCase()} attempted ${entry.action.toUpperCase()} → ${entry.result}
                <br><small>${entry.reason}</small>
            </span>
        `;
        
        auditLog.insertBefore(entryElement, auditLog.firstChild);
    }

    /**
     * ROLE MANAGEMENT - Handles role changes and permission updates
     */
    changeRole(newRole) {
        const oldRole = this.currentRole;
        this.currentRole = newRole;
        
        // Log role change for security audit
        this.logDecision(oldRole, 'role_change', true, `Role changed from ${oldRole} to ${newRole}`);
        
        // Update UI to reflect new permissions
        document.getElementById('currentRole').textContent = newRole.charAt(0).toUpperCase() + newRole.slice(1);
        this.updateActionButtons();
        
        // Clear previous feedback
        const feedbackElement = document.getElementById('feedbackMessage');
        feedbackElement.textContent = `Role changed to ${newRole}. Permissions updated according to governance policy.`;
        feedbackElement.className = 'feedback-message info';
    }

    /**
     * PERMISSION VISUALIZER - Shows users what they can/cannot do
     * Real-world lesson: Transparency in permissions reduces confusion and support requests
     */
    updateActionButtons() {
        const policies = this.getPolicyRules();
        const currentPermissions = policies[this.currentRole];
        
        Object.keys(currentPermissions).forEach(action => {
            const button = document.querySelector(`[data-action="${action}"]`);
            if (button) {
                button.className = 'action-btn';
                if (currentPermissions[action]) {
                    button.classList.add('allowed');
                    button.title = `✅ You have permission to ${action}`;
                } else {
                    button.classList.add('blocked');
                    button.title = `❌ Insufficient privileges for ${action}`;
                }
            }
        });
    }

    /**
     * SYSTEM INITIALIZATION - Sets up governance framework
     */
    initializeSystem() {
        this.setupEventListeners();
        this.updateActionButtons();
        
        // Log system startup
        this.logDecision('system', 'initialize', true, 'Governance system initialized with default policies');
    }

    /**
     * EVENT HANDLERS - Connects UI to governance engine
     */
    setupEventListeners() {
        // Role selection handler
        document.getElementById('roleSelect').addEventListener('change', (e) => {
            this.changeRole(e.target.value);
        });

        // Action button handlers
        document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                this.executeAction(action);
            });
        });

        // Audit log management
        document.getElementById('clearLog').addEventListener('click', () => {
            this.clearAuditLog();
        });
    }

    /**
     * AUDIT LOG MANAGEMENT - Maintains system accountability records
     */
    clearAuditLog() {
        const auditLogElement = document.getElementById('auditLog');
        auditLogElement.innerHTML = `
            <div class="audit-entry system">
                <span class="timestamp">Log cleared by ${this.currentRole}</span>
                <span class="details">Audit log cleared - action logged for compliance</span>
            </div>
        `;
        
        this.auditLog = [];
        this.logDecision(this.currentRole, 'clear_log', true, 'Audit log cleared by authorized user');
    }
}

/**
 * SYSTEM STARTUP - Initialize governance framework when page loads
 * Real-world lesson: Governance must be built into systems from the start, not added later
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create global governance system instance
    window.governanceSystem = new GovernanceSystem();
    
    console.log('🏛️ Governance & Compliance System Initialized');
    console.log('📋 Teaching lesson: Great systems succeed through proper governance, not just good code');
    console.log('⚖️ Key concepts: Role-based access, policy enforcement, audit logging, accountability');
});