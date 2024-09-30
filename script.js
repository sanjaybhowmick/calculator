const display = document.getElementById('display');
const historyDisplay = document.getElementById('history'); // Display area for history
let currentInput = '';
let operator = '';
let previousInput = '';
let resultDisplayed = false;
let history = []; // Array to store calculation history

// Toggle light/dark theme
const themeToggle = document.getElementById('toggle-theme');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// Clear input
document.getElementById('clear').addEventListener('click', () => {
    currentInput = '';
    operator = '';
    previousInput = '';
    display.value = '';
});

// Backspace
document.getElementById('backspace').addEventListener('click', () => {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
});

// Number and operator input
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.textContent;

        if (!isNaN(value) || value === '.') {
            handleNumber(value);
        } else if (['+', '-', '*', '/'].includes(value)) {
            handleOperator(value);
        } else if (value === '=') {
            handleEquals();
        }
    });
});

function handleNumber(value) {
    if (resultDisplayed) {
        currentInput = value;
        resultDisplayed = false;
    } else {
        currentInput += value;
    }
    display.value = currentInput;
}

function handleOperator(op) {
    if (currentInput === '') {
        if (previousInput !== '' && resultDisplayed) {
            operator = op; // Allow chaining of operations even after result
        }
        return;
    }

    if (previousInput === '') {
        previousInput = currentInput;
    } else if (operator) {
        previousInput = calculate(previousInput, currentInput, operator);
        display.value = previousInput;
    }
    operator = op;
    currentInput = '';
    resultDisplayed = false; // Reset result flag
}

function handleEquals() {
    if (previousInput === '' || currentInput === '') return;

    const result = calculate(previousInput, currentInput, operator);
    // Save the calculation to history
    saveToHistory(previousInput, currentInput, operator, result);

    previousInput = result;
    display.value = previousInput;
    currentInput = '';
    operator = '';
    resultDisplayed = true; // Set result flag to true
}

function calculate(num1, num2, op) {
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    switch (op) {
        case '+':
            return (a + b).toString();
        case '-':
            return (a - b).toString();
        case '*':
            return (a * b).toString();
        case '/':
            return (b !== 0) ? (a / b).toString() : 'Error';
        default:
            return '';
    }
}

// Save calculation to history and display it
function saveToHistory(num1, num2, op, result) {
    const calculation = `${num1} ${op} ${num2} = ${result}`;
    history.push(calculation);
    updateHistoryDisplay();
}

// Update the history display on the web page
function updateHistoryDisplay() {
    historyDisplay.innerHTML = 'History:<br>' + history.join('<br>');
}

// Handle keyboard input
window.addEventListener('keydown', (e) => {
    // Prevent default behavior for the slash ("/") key to stop the quick find box
    if (e.key === '/') {
        e.preventDefault(); // Prevent browser's default quick find behavior
        handleOperator('/'); // Handle division operation
    }
    
    // Handle number and dot inputs
    if (!isNaN(e.key) || e.key === '.') {
        handleNumber(e.key);
    }
    // Handle other operators
    else if (['+', '-', '*'].includes(e.key)) {
        handleOperator(e.key);
    }
    // Handle Enter (equals)
    else if (e.key === 'Enter') {
        e.preventDefault(); // Prevent any default behavior tied to the Enter key
        handleEquals();
    }
    // Handle backspace
    else if (e.key === 'Backspace') {
        e.preventDefault(); // Prevent default backspace navigation
        document.getElementById('backspace').click();
    }
    // Handle Escape (clear all)
    else if (e.key === 'Escape') {
        e.preventDefault(); // Prevent default behavior
        document.getElementById('clear').click();
    }
});

