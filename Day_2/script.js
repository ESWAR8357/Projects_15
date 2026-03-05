class StateControlPanel {
    constructor() {
        // SINGLE SOURCE OF TRUTH
        this.state = {
            counter: 0,
            updateCount: 0
        };
        
        this.initElements();
        this.initEvents();
        this.render();
    }

    initElements() {
        this.counterValue = document.getElementById('counterValue');
        this.counterDisplay = document.getElementById('counterDisplay');
        this.updateCountDisplay = document.getElementById('updateCount');
        this.increaseBtn = document.getElementById('increaseBtn');
        this.decreaseBtn = document.getElementById('decreaseBtn');
        this.resetBtn = document.getElementById('resetBtn');
    }

    initEvents() {
        this.increaseBtn.addEventListener('click', () => this.increase());
        this.decreaseBtn.addEventListener('click', () => this.decrease());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === '+') {
                e.preventDefault();
                this.increase();
            }
            if (e.key === 'ArrowDown' || e.key === '-') {
                e.preventDefault();
                this.decrease();
            }
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.reset();
            }
        });
    }

    // CORE: All state changes go through here
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.state.updateCount++;
        this.render(); // Always re-render after state change
    }

    // CORE: Single render function updates entire UI
    render() {
        const currentValue = parseInt(this.counterValue.textContent);
        const newValue = this.state.counter;
        
        // Update counter with animation
        if (currentValue !== newValue) {
            this.counterValue.classList.add('animate');
            this.counterValue.textContent = newValue;
            setTimeout(() => {
                this.counterValue.classList.remove('animate');
            }, 300);
        }
        
        // Update button states
        this.decreaseBtn.disabled = this.state.counter <= 0;
        
        // Update state info
        this.updateCountDisplay.textContent = this.state.updateCount;
        
        // Visual feedback
        this.counterDisplay.classList.add('pulse');
        setTimeout(() => {
            this.counterDisplay.classList.remove('pulse');
        }, 300);
    }

    increase() {
        this.updateState({ counter: this.state.counter + 1 });
    }

    decrease() {
        if (this.state.counter > 0) {
            this.updateState({ counter: this.state.counter - 1 });
        }
    }

    reset() {
        this.updateState({ counter: 0 });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.statePanel = new StateControlPanel();
    
    console.log('🎛️ State Control Panel initialized');
    console.log('🎹 Controls: ↑/+ increase, ↓/- decrease, R reset');
});