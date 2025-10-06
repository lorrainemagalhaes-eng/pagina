
// 1. Seleção dos elementos
const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = calculator.querySelector('.calculator-screen');

// 2. Variáveis de estado para o cálculo
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

// 3. Função para calcular o resultado
function calculate(n1, operator, n2) {
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);

    if (operator === '+') return num1 + num2;
    if (operator === '-') return num1 - num2;
    if (operator === '*') return num1 * num2;
    if (operator === '/') return num1 / num2;
}

// 4. Tratamento de clique nos botões
keys.addEventListener('click', event => {
    // Verifica se o elemento clicado é um botão
    if (!event.target.matches('button')) return;

    const key = event.target;
    const action = key.dataset.action; // Pega o atributo data-action ou data-number/operator
    const keyContent = key.textContent;
    const displayedNum = display.value;

    // --- Ações de Número e Ponto Decimal ---
    if (!action) {
        // Se o display for '0' ou se estiver esperando o segundo valor, substitui o valor
        if (displayedNum === '0' || waitingForSecondValue) {
            display.value = keyContent;
            waitingForSecondValue = false;
        } else {
            // Caso contrário, anexa o número
            display.value = displayedNum + keyContent;
        }
    }

    // Ponto Decimal
    if (key.dataset.decimal) {
        // Evita múltiplos pontos decimais
        if (!displayedNum.includes('.')) {
            display.value = displayedNum + '.';
        }
        // Se estiver esperando o segundo valor, começa com '0.'
        if (waitingForSecondValue) {
            display.value = '0.';
            waitingForSecondValue = false;
        }
    }

    // --- Ações de Operador ---
    if (key.dataset.operator) {
        // Se já tivermos um primeiro valor e um operador, calcula o resultado intermediário
        if (firstValue && operator && !waitingForSecondValue) {
            const result = calculate(firstValue, operator, displayedNum);
            display.value = result;
            firstValue = result; // O resultado se torna o novo primeiro valor
        } else {
            // Guarda o valor atual do display como o primeiro valor
            firstValue = displayedNum;
        }

        // Guarda o operador clicado
        operator = key.value;
        waitingForSecondValue = true;
    }

    // --- Ação de Igual (=) ---
    if (key.dataset.equals) {
        // Evita calcular se não houver um operador
        if (firstValue === null || operator === null) return;

        const secondValue = displayedNum;
        const result = calculate(firstValue, operator, secondValue);

        display.value = result;

        // Reseta o estado para um novo cálculo
        firstValue = null;
        operator = null;
        waitingForSecondValue = false;
    }

    // --- Ação de Limpar (AC) ---
    if (key.dataset.clear) {
        display.value = '0';
        firstValue = null;
        operator = null;
        waitingForSecondValue = false;
    }
});