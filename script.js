const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');
const offlineStatus = document.getElementById('offlineStatus');

const apiKey = '91e86951d91c2935dd3aec18'; 
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`; 

let exchangeRates = {};

async function fetchRates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        exchangeRates = data.conversion_rates;
        localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
        populateCurrencySelects(exchangeRates);
        offlineStatus.textContent = ''; 
    } catch (error) {
        console.log('Nu se poate conecta la API, folosim datele locale.');
        offlineStatus.textContent = 'Esti offline. Se folosesc datele stocate.';
        const storedRates = localStorage.getItem('exchangeRates');
        if (storedRates) {
            exchangeRates = JSON.parse(storedRates);
            populateCurrencySelects(exchangeRates);
        } else {
            resultDiv.textContent = 'Nu există date disponibile pentru conversie offline.';
        }
    }
}

function populateCurrencySelects(rates) {
    const currencyOptions = Object.keys(rates)
        .map(currency => `<option value="${currency}">${currency}</option>`)
        .join('');
    
    fromCurrencySelect.innerHTML = currencyOptions;
    toCurrencySelect.innerHTML = currencyOptions;
}

function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        resultDiv.textContent = 'Te rog introdu o sumă și selectează valute valide.';
        return;
    }

    const conversionRate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const convertedAmount = (amount * conversionRate).toFixed(2);
    resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
}

convertBtn.addEventListener('click', convertCurrency);

fetchRates();
