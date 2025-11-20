# Currency Converter Challenge (React + TypeScript)

This project implements a single-page currency converter, fulfilling the technical requirements of the code challenge.


## MVVM Architecture (Model-View-ViewModel)

The application follows the MVVM pattern to ensure separation of concerns and high testability. The layers are structured as follows:

* **View (src/components/ConverterForm/index.tsx):** The presentation layer. It contains the JSX, styling (via Styled Components), and only receives data and handlers from the ViewModel to render the interface.
* **ViewModel (src/hooks/useCurrencyConverter.ts):** The state and logic layer. It contains the \`useState\`, \`useEffect\`, validation (\`yup\`), swap functions, and is responsible for orchestrating API calls and the final calculation.
* **Model (src/services/currencyApi.ts & src/types/index.ts):** The data layer. It is responsible for defining data interfaces and encapsulating communication with the external service (Currencyapi) via Axios.

-----

## Technologies Used:

* **Frontend:** React, TypeScript, Vite
* **Styling:** Styled Components (custom components, no external libraries)
* **Logic/State:** Custom Hooks (ViewModel), `date-fns`
* **Validation:** `yup`
* **Tests:** Vitest, React Testing Library

-----


## Local Setup and Execution

### 1. API Token Configuration

The converter relies on the free Currencyapi service to fetch currency rates and available currencies. You must configure your API access token.

1. Create a file named **.env** in the project root directory (next to `package.json`).
2. Add the following environment variables, replacing <YOUR_API_KEY> with your actual key:

```bash
VITE_CURRENCYAPI_KEY="<YOUR_API_KEY>"
VITE_CURRENCYAPI_BASE_URL="https://api.currencyapi.com/v3"
```

### 2. Installation and Running

After configuring the .env file, follow these steps to run the application locally:

```bash
# 1. Install project dependencies
npm install

# 2. Start the development server (application will be available at http://localhost:5173)
npm run dev
```

-----

## Automated Testing

The project includes a complete suite of unit and integration tests for the business logic (ViewModel), ensuring correct calculation, state handling, and form validation.

```bash
# Executes all unit and integration tests
npm run test
```
