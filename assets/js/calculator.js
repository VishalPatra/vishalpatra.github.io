// Default values for different filament types
const filamentDefaults = {
    pla: { cost: 20, wattage: 150 },
    abs: { cost: 25, wattage: 180 },
    petg: { cost: 28, wattage: 165 },
    tpu: { cost: 35, wattage: 160 },
    custom: { cost: 20, wattage: 150 }
};

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners for all input fields to auto-calculate on change
    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(input => {
        // Auto-calculate on input change
        input.addEventListener('input', calculateCost);
        
        // For mobile: blur the input after entering a value
        input.addEventListener('change', function() {
            if (window.innerWidth < 768) {
                setTimeout(() => this.blur(), 100);
            }
        });
        
        // Add keyboard event handling for Enter key
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                calculateCost();
                e.preventDefault();
                
                // Find the next input to focus
                const form = Array.from(allInputs);
                const currentIndex = form.indexOf(e.target);
                const nextElement = form[currentIndex + 1];
                
                if (nextElement) {
                    nextElement.focus();
                } else {
                    // If last element, focus on the calculate button
                    document.querySelector('.calculate-btn').focus();
                }
            }
        });
    });
    
    // Fix for iOS numeric keyboard
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Add slight delay to ensure keyboard is shown
            setTimeout(() => {
                input.setAttribute('inputmode', 'decimal');
            }, 100);
        });
    });
    
    // Set up the filament type selector
    document.getElementById('filamentType').addEventListener('change', updateDefaultValues);
    
    // Add click event for "Calculate" button
    document.querySelector('.calculate-btn').addEventListener('click', function() {
        calculateCost();
        
        // Add haptic feedback for mobile devices if available
        if (navigator.vibrate && window.innerWidth < 768) {
            navigator.vibrate(15);
        }
        
        // Add a visual feedback animation to the button
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 200);
    });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(updateLayout, 300);
    });
    
    // Initialize calculator with default values
    updateDefaultValues();
    calculateCost();
    updateLayout();
});

function updateLayout() {
    // Adjust UI based on viewport height
    const vh = window.innerHeight;
    const calculator = document.querySelector('.calculator-box');
    
    if (vh < 600) {
        // For very small screens (like landscape on phone)
        calculator.classList.add('compact-view');
    } else {
        calculator.classList.remove('compact-view');
    }
}

function updateDefaultValues() {
    const filamentType = document.getElementById('filamentType').value;
    const defaults = filamentDefaults[filamentType];
    
    if (filamentType !== 'custom') {
        document.getElementById('filamentCost').value = defaults.cost;
        document.getElementById('printerWattage').value = defaults.wattage;
    }
}

function calculateCost() {
    try {
        // Get input values and handle potential empty values
        const filamentCost = parseFloat(document.getElementById('filamentCost').value) || 0;
        const printWeight = parseFloat(document.getElementById('printWeight').value) || 0;
        const printHours = parseFloat(document.getElementById('printHours').value) || 0;
        const printMinutes = parseFloat(document.getElementById('printMinutes').value) || 0;
        const electricityCost = parseFloat(document.getElementById('electricityCost').value) || 0;
        const printerWattage = parseFloat(document.getElementById('printerWattage').value) || 0;
        const failureRate = parseFloat(document.getElementById('failureRate').value) || 0;
        const laborCost = parseFloat(document.getElementById('laborCost').value) || 0;

        // Calculate total print time in hours
        const printTime = printHours + (printMinutes / 60);

        // Calculate costs
        const materialCost = (filamentCost * printWeight) / 1000;
        const powerCost = (printerWattage * printTime * electricityCost) / 1000;
        const laborCostTotal = laborCost * printTime;
        const subtotal = materialCost + powerCost + laborCostTotal;
        const riskCost = subtotal * (failureRate / 100);
        const totalCost = subtotal + riskCost;

        // Update results with animations
        updateCostDisplay('materialCost', materialCost);
        updateCostDisplay('powerCost', powerCost);
        updateCostDisplay('riskCost', riskCost);
        updateCostDisplay('laborCostResult', laborCostTotal);
        updateCostDisplay('totalCost', totalCost);
        
        // Scroll to results if they're not visible
        // Only on small screens and only if calculation was triggered by button
        if (window.innerWidth < 768 && document.activeElement === document.querySelector('.calculate-btn')) {
            const resultsElement = document.getElementById('results');
            const rect = resultsElement.getBoundingClientRect();
            
            if (rect.bottom > window.innerHeight) {
                resultsElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        }
    } catch (error) {
        console.error("Error calculating cost:", error);
    }
}

function updateCostDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    // Format with 2 decimal places and include dollar sign
    const formattedValue = `$${formatNumber(value)}`;
    
    // Only animate if the value has changed
    if (element.textContent !== formattedValue) {
        // Add animation class
        element.classList.add('update-animation');
        element.textContent = formattedValue;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('update-animation');
        }, 400);
    }
}

// Helper to format number with proper decimal places
function formatNumber(value) {
    // For values less than 0.1, show 3 decimal places
    if (value < 0.1 && value > 0) {
        return value.toFixed(3);
    } 
    // For values less than 100, show 2 decimal places
    else if (value < 100) {
        return value.toFixed(2);
    } 
    // For larger values, only show 1 decimal place
    else {
        return value.toFixed(1);
    }
} 