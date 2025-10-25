const API_BASE = "https://api.frankfurter.app/latest";

let supportedCurrencies = null; // will hold keys from /currencies

const dropdowns = document.querySelectorAll('.dropdown select');
const btn = document.querySelector('form button');
const fromCurr = document.querySelector('.from select');
const toCurr = document.querySelector('.to select');
const message = document.querySelector('.msg');

// Populate dropdowns with currencies (now uses supportedCurrencies)
const populateDropdowns = () => {
  for (let select of dropdowns) {
    // clear any existing options
    select.innerHTML = '';

    for (let currCode in countryList) {
      // if we have a fetched supportedCurrencies list, skip unsupported codes
      if (supportedCurrencies && !supportedCurrencies.has(currCode)) continue;

      let option = document.createElement('option');
      option.value = currCode;
      option.innerText = currCode;

      if (select.name === 'from' && currCode === 'USD') option.selected = true;
      if (select.name === 'to' && currCode === 'SEK') option.selected = true;

      select.appendChild(option);
    }

    select.addEventListener('change', (evt) => updateFlag(evt.target));
  }
};

// Fetch supported currencies from Frankfurter and initialize UI
const init = async () => {
  try {
    const res = await fetch('https://api.frankfurter.app/currencies');
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    // data is an object mapping code -> name
    supportedCurrencies = new Set(Object.keys(data));
    console.log('Supported currencies:', supportedCurrencies);
  } catch (err) {
    // If we cannot fetch supported list, allow population but warn the user.
    console.warn('Could not fetch supported currencies, proceeding without filtering:', err);
    supportedCurrencies = null;
    message.innerText = "Warning: unable to verify supported currencies. Conversion may fail.";
  }

  populateDropdowns();
  updateExchangeRate();
};

// Validate before requesting conversion
const updateExchangeRate = async () => {
  let amountInput = document.querySelector('.amount input');
  let amountValue = parseFloat(amountInput.value);
  if (isNaN(amountValue) || amountValue < 1) {
    amountValue = 1;
    amountInput.value = '1';
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  // Validate selects and supported currencies
  if (!from || !to) {
    message.innerText = "Please select both currencies.";
    return;
  }
  if (supportedCurrencies && (!supportedCurrencies.has(from) || !supportedCurrencies.has(to))) {
    message.innerText = `Currency not supported by API: ${!supportedCurrencies.has(from) ? from : to}`;
    return;
  }

  const myURL = `${API_BASE}?amount=${encodeURIComponent(amountValue)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  console.log("Fetching:", myURL);

  try {
    const res = await fetch(myURL);

    if (!res.ok) {
      const body = await res.text().catch(() => '<no-body>');
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${body}`);
    }

    const data = await res.json();
    console.log('API response:', data);

    if (!data.rates || !data.rates[to]) throw new Error("Invalid API data: missing rate for " + to);

    const finalAmount = data.rates[to].toFixed(2);
    message.innerText = `${amountValue} ${from} = ${finalAmount} ${to}`;
  } catch (err) {
    console.error(err);
    message.innerText = "Error fetching exchange rate: " + err.message;
  }
};

// Update flag image
const updateFlag = (selectElement) => {
  const code = selectElement.value;
  const countryCode = countryList[code];
  const img = selectElement.parentElement.querySelector('img');
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Event listeners
btn.addEventListener('click', (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Initialize on load (fetch supported currencies then populate)
window.addEventListener('load', init);