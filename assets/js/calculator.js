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
        input.addEventListener('input', calculateCost);
        
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
    
    // Set up the filament type selector
    document.getElementById('filamentType').addEventListener('change', updateDefaultValues);
    
    // Add click event for "Calculate" button
    document.querySelector('.calculate-btn').addEventListener('click', function() {
        calculateCost();
        
        // Add a visual feedback animation to the button
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 200);
    });
    
    // Initialize calculator with default values
    updateDefaultValues();
    calculateCost();
});

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
        const resultsElement = document.getElementById('results');
        const rect = resultsElement.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } catch (error) {
        console.error("Error calculating cost:", error);
    }
}

function updateCostDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    const formattedValue = `$${value.toFixed(2)}`;
    
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