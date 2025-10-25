# currency Exchange

A simple **Currency Converter web application** built with **HTML, CSS, and JavaScript**. This app allows users to convert amounts between different currencies in real-time using live exchange rates from the **Frankfurter API**.

## Features
1. Convert amounts between supported currencies
2. Fetches live exchange rates via Fetch API
3. Dynamic dropdowns populated with supported currencies
4. Automatically updates country flags based on selected currency
5. Validates user input for safe conversions
6. User-friendly interface with responsive design

## Tech Stack
**Frontend:** HTML, CSS, JavaScript
**API:** Frankfurter API for live exchange rates
**Icons:** FlagsAPI for country flags
**Fetch API** for asynchronous HTTP requests

## How to Use
- Clone or download this repository
- Open index.html in your web browser
- Enter the **amount** you want to convert
- Select **From** and **To** currencies
- Click **Convert**
- The converted amount will be displayed instantly, along with the corresponding country flags

## Code Highlights
- Dynamic population of currency dropdowns using JavaScript
- Real-time conversion using **async/await** and the Fetch API
- Graceful error handling if the API fails or unsupported currencies are selected
- Flag images update automatically when currency changes

## Future Improvements
1. Add a swap button to switch “From” and “To” currencies quickly
2. Add historical exchange rates and charts
3. Mobile-friendly responsive design
4. Option to save favorite currency pairs

