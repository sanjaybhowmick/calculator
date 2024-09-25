const display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let resultDisplayed = false;

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
    if (currentInput === '') return;

    if (previousInput === '') {
        previousInput = currentInput;
    } else if (operator) {
        previousInput = calculate(previousInput, currentInput, operator);
        display.value = previousInput;
    }
    operator = op;
    currentInput = '';
}

function handleEquals() {
    if (previousInput === '' || currentInput === '') return;

    previousInput = calculate(previousInput, currentInput, operator);
    display.value = previousInput;
    currentInput = '';
    operator = '';
    resultDisplayed = true;
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

// Handle keyboard input
window.addEventListener('keydown', (e) => {
    if (!isNaN(e.key) || e.key === '.') {
        handleNumber(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(e.key);
    } else if (e.key === 'Enter') {
        handleEquals();
    } else if (e.key === 'Backspace') {
        document.getElementById('backspace').click();
    } else if (e.key === 'Escape') {
        document.getElementById('clear').click();
    }
});
