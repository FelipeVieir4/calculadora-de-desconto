document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculate-button');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateValues);
    }
    loadLastUsedValues();
    const cleanButton = document.getElementById('clear-button');
    cleanButton.addEventListener('click', cleanInputs);
});

function saveLastUsedValues() {
    const inputA = document.getElementById('input-a').value;
    const inputB = document.getElementById('input-b').value;

    localStorage.setItem('last-used-data', JSON.stringify({ inputA, inputB }));
}

function loadLastUsedValues() {
    const lastUsedData = JSON.parse(localStorage.getItem('last-used-data'));
    if (lastUsedData) {
        document.getElementById('input-a').value = lastUsedData.inputA;
        document.getElementById('input-b').value = lastUsedData.inputB;
    }
}

function validateInputs() {
    const inputA = document.getElementById('input-a').value;
    const inputB = document.getElementById('input-b').value;

    if (inputA === '' || inputB === '') {
        window.alert("Please fill in both fields.");
        return false;
    }

    // Check if the fields contain commas as decimal separators
    if (inputA.includes(',') || inputB.includes(',')) {
        window.alert("Please use dots as decimal separators instead of commas.");
        return false;
    }

    // Check if both fields are valid numbers
    if (isNaN(inputA) || isNaN(inputB)) {
        window.alert("Please enter valid values for both fields.");
        return false;
    }

    // Check if the numbers are positive
    if (parseFloat(inputA) <= 0 || parseFloat(inputB) <= 0) {
        window.alert("Values must be greater than zero.");
        return false;
    }

    return true;
}

function calculateValues() {
    if (!validateInputs()) {
        return; // Se a validação falhar, não continua com os cálculos
    }

    saveLastUsedValues();
    const inputA = parseFloat(document.getElementById('input-a').value);
    const inputB = parseFloat(document.getElementById('input-b').value);

    let firstPercentage = calculateFirstPercentage(inputA, inputB);
    let intermediateValue = inputA - (inputA * firstPercentage);
    let secondPercentage = calculateSecondPercentage(inputB, intermediateValue);
    let finalValue = intermediateValue - (intermediateValue * secondPercentage);

    let iterationCount = 0;

    while (getDecimalPart(finalValue) !== getDecimalPart(inputB)) {
        firstPercentage -= 0.0001;
        intermediateValue = inputA - (inputA * firstPercentage);
        secondPercentage = calculateSecondPercentage(inputB, intermediateValue);
        finalValue = intermediateValue - (intermediateValue * secondPercentage);

        if (iterationCount++ > 1000) break;
    }

    // Render the results in a table
    renderResults(inputA, firstPercentage, intermediateValue, secondPercentage, finalValue);
}

function calculateFirstPercentage(value1, value2) {
    return parseFloat((1 - value2 / value1).toFixed(4));
}

function calculateSecondPercentage(value2, intermediateValue) {
    return parseFloat((1 - value2 / intermediateValue).toFixed(4));
}

function getDecimalPart(value) {
    return (value % 1).toFixed(2);
}

function renderResults(inputA, firstPercentage, intermediateValue, secondPercentage, finalValue) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpa o conteúdo existente

    // Dados dos resultados
    const results = [
        { label: 'Initial Value', value: inputA.toFixed(2) },
        { label: 'First Percentage', value: `${firstPercentage.toFixed(4)} (${(inputA * firstPercentage).toFixed(2)})` },
        { label: 'Intermediate Value', value: intermediateValue.toFixed(2) },
        { label: 'Second Percentage', value: `${secondPercentage.toFixed(4)} (${(intermediateValue * secondPercentage).toFixed(2)})` },
        { label: 'Final Value', value: finalValue.toFixed(2) }
    ];

    // Criação do contêiner para os resultados
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('results-container');

    // Criando os itens de resultado com um layout de bloco
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <strong class="result-label">${result.label}:</strong>
            <span class="result-value">${result.value}</span>
        `;
        resultContainer.appendChild(resultItem);
    });

    // Adicionando o contêiner ao div de resultados
    resultsDiv.appendChild(resultContainer);
}


function cleanInputs() {
    document.getElementById('input-a').value = '';
    document.getElementById('input-b').value = '';
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpa o conteúdo existente
}
