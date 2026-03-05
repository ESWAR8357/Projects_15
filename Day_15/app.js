// Professional Portfolio & Career Readiness System
// Teaching interns to think professionally about skill packaging and career ownership

class CareerPortfolio {
    constructor() {
        this.skills = [];
        this.projects = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Skills functionality
        document.getElementById('add-skill-btn').addEventListener('click', () => this.addSkill());
        document.getElementById('skill-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addSkill();
        });

        // Projects functionality
        document.getElementById('add-project-btn').addEventListener('click', () => this.addProject());
        document.getElementById('project-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addProject();
        });
        document.getElementById('project-description').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addProject();
        });
    }

    // Add skill to portfolio - building professional skill inventory
    addSkill() {
        const skillInput = document.getElementById('skill-input');
        const skillValue = skillInput.value.trim();

        // Prevent empty submissions - professional quality control
        if (!skillValue) {
            this.showInputError(skillInput, 'Please enter a skill');
            return;
        }

        // Prevent duplicates - maintain clean portfolio
        if (this.skills.includes(skillValue.toLowerCase())) {
            this.showInputError(skillInput, 'Skill already added');
            return;
        }

        // Add to skills array and display
        this.skills.push(skillValue.toLowerCase());
        this.displaySkill(skillValue);
        
        // Clear input and update readiness
        skillInput.value = '';
        this.updateCareerReadiness();
    }

    // Add project to portfolio - showcasing proof of work
    addProject() {
        const projectInput = document.getElementById('project-input');
        const descriptionInput = document.getElementById('project-description');
        
        const projectName = projectInput.value.trim();
        const projectDescription = descriptionInput.value.trim();

        // Validate inputs - professional standards
        if (!projectName) {
            this.showInputError(projectInput, 'Please enter a project name');
            return;
        }

        if (!projectDescription) {
            this.showInputError(descriptionInput, 'Please enter a description');
            return;
        }

        // Create project object and add to portfolio
        const project = {
            name: projectName,
            description: projectDescription
        };

        this.projects.push(project);
        this.displayProject(project);
        
        // Clear inputs and update readiness
        projectInput.value = '';
        descriptionInput.value = '';
        this.updateCareerReadiness();
    }

    // Display skill in UI - visual proof of capabilities
    displaySkill(skill) {
        const skillsList = document.getElementById('skills-list');
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item';
        skillElement.textContent = skill;
        
        skillsList.appendChild(skillElement);
    }

    // Display project in UI - showcasing work portfolio
    displayProject(project) {
        const projectsList = document.getElementById('projects-list');
        const projectElement = document.createElement('div');
        projectElement.className = 'project-item';
        
        projectElement.innerHTML = `
            <h4>${project.name}</h4>
            <p>${project.description}</p>
        `;
        
        projectsList.appendChild(projectElement);
    }

    // Update career readiness indicators - progress tracking for interviews
    updateCareerReadiness() {
        // Update counters
        document.getElementById('skills-count').textContent = this.skills.length;
        document.getElementById('projects-count').textContent = this.projects.length;
        
        // Update readiness message based on portfolio completeness
        const readinessMessage = document.getElementById('readiness-message');
        const totalItems = this.skills.length + this.projects.length;
        
        if (totalItems === 0) {
            readinessMessage.textContent = 'Portfolio in progress - Keep building!';
            readinessMessage.className = 'readiness-message';
        } else if (totalItems < 5) {
            readinessMessage.textContent = 'Good start! Add more skills and projects to strengthen your portfolio.';
            readinessMessage.className = 'readiness-message';
        } else if (totalItems < 10) {
            readinessMessage.textContent = 'Portfolio developing well - You\'re building interview readiness!';
            readinessMessage.className = 'readiness-message';
        } else {
            readinessMessage.textContent = 'Excellent portfolio! You\'re interview-ready and career-focused!';
            readinessMessage.className = 'readiness-message ready';
        }
    }

    // Show input validation errors - maintaining professional standards
    showInputError(inputElement, message) {
        inputElement.style.borderColor = '#e74c3c';
        inputElement.placeholder = message;
        
        // Reset after 2 seconds
        setTimeout(() => {
            inputElement.style.borderColor = '#ecf0f1';
            if (inputElement.id === 'skill-input') {
                inputElement.placeholder = 'Enter a skill (e.g., JavaScript, Problem Solving)';
            } else if (inputElement.id === 'project-input') {
                inputElement.placeholder = 'Enter project name';
            } else {
                inputElement.placeholder = 'Brief description';
            }
        }, 2000);
    }
}

// Initialize the Career Portfolio System when page loads
// Teaching interns to think systematically about career development
document.addEventListener('DOMContentLoaded', () => {
    new CareerPortfolio();
    
    // Professional mindset reminder in console
    console.log('🚀 Professional Portfolio System Loaded');
    console.log('💡 Remember: Every skill and project you add builds your professional identity');
    console.log('🎯 Goal: Package your capabilities for career opportunities');
});