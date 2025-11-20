# 🚀 Currency Converter Challenge (React + TypeScript)

This project implements a single-page currency converter, fulfilling the technical requirements of the code challenge.

---

## 🏛️ MVVM Architecture (Model-View-ViewModel)

The application follows the **MVVM** pattern to ensure **separation of concerns** and **high testability**. The layers are structured as follows:

* **View (`src/components/ConverterForm/index.tsx`):** The presentation layer. It contains the JSX, styling (via Styled Components), and only receives data and handlers from the ViewModel to render the interface.
* **ViewModel (`src/hooks/useCurrencyConverter.ts`):** The state and logic layer. It contains the `useState`, `useEffect`, validation (`yup`), swap functions, and is responsible for orchestrating API calls and the final calculation.
* **Model (`src/services/currencyApi.ts` & `src/types/index.ts`):** The data layer. It is responsible for defining data interfaces and encapsulating communication with the external service (Currencyapi) via Axios.

---

## 🛠️ Technologies Used:

* **Frontend:** React, TypeScript, Vite
* **Styling:** Styled Components (custom components, no external libraries)
* **Logic/State:** Custom Hooks (ViewModel), `date-fns`
* **Validation:** `yup`
* **Tests:** Vitest, React Testing Library

---

## ⚙️ Local Setup and Execution

### 1. API Token Configuration

The converter relies on the free **Currencyapi** service to fetch currency rates and available currencies. You must configure your API access token.

1. Create a file named **`.env`** in the project root directory (next to `package.json`).
2. Add the following environment variables, replacing `<YOUR_API_KEY>` with your actual key:

```bash
VITE_CURRENCYAPI_KEY="<YOUR_API_KEY>"
VITE_CURRENCYAPI_BASE_URL="https://api.currencyapi.com/v3"
```

### 2. Installation and Running

After configuring the `.env` file, follow these steps to run the application locally:

```bash
# 1. Install project dependencies
npm install

# 2. Start the development server (application will be available at http://localhost:5173)
npm run dev
```

---

## 🧪 Automated Testing

The project includes a complete suite of unit and integration tests for the business logic (ViewModel), ensuring correct calculation, state handling, and form validation.

```bash
# Executes all unit and integration tests
npm run test
&&A

---

## 🤖 GitHub Actions CI/CD Pipeline

The project uses a GitHub Actions workflow to automate the testing, build, and production deployment on Vercel. This pipeline is triggered automatically on every **`push`** to the **`main`** branch.

### Pipeline Flow (`test-build-deploy` Job):

1. **`Checkout code`**: Retrieves the repository source code.
2. **`Setup Node.js`**: Configures the Node.js environment (v20) and uses caching for `npm` dependencies.
3. **`Install dependencies`**: Installs all project dependencies using `npm ci`.
4. **`Check coverage threshold`**: **Executes the tests** and checks if the code coverage for the logic in the `src/hooks` directory meets the minimum required threshold of **80%**. The build fails if the coverage is below this value.
5. **`Create .env file`**: Creates a temporary `.env` file for the build, injecting the necessary **API keys** and **base URL** using **GitHub Secrets**.
6. **`Build application`**: Compiles the final production application using `npm run build`.
7. **`Deploy to Vercel`**: Deploys the application to **Vercel** as a **production** environment (`--prod`), using the configured Vercel secrets for authentication and identification.

### Obtaining Vercel Secrets

To connect the GitHub Action to your Vercel project, you need three secrets: a token, your organization/user ID, and the project ID.

#### 1. VERCEL_TOKEN

1. Navigate to the **Vercel Dashboard**.
2. Go to **Account Settings** > **Tokens**.
3. Generate a new Token. This token is used by GitHub Actions to authenticate the deployment.
4. **Copy the generated token immediately**, as Vercel will not show it again.

#### 2. VERCEL_ORG_ID and VERCEL_PROJECT_ID

1. In the **Vercel Dashboard**, select the project associated with this repository.
2. Go to **Settings** for that specific project.
3. Under the **General** section, you will find the **Project ID** listed. Copy this value.

# and the **Organization ID (Org ID)** 

### GitHub Secrets Configuration

To enable the pipeline to connect to the external API (Currencyapi) and Vercel for deployment, you must configure the following **Environment Secrets** in your GitHub repository.

#### Steps to Configure Secrets:

1. In your GitHub repository, navigate to **Settings** > **Security** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**.
3. Create the following secrets with their respective values:

| Secret Name | Purpose | Value to Provide |
| :--- | :--- | :--- |
| **`VITE_CURRENCYAPI_KEY`** | API Key for the Currency Converter (Currencyapi). | Your actual API Key. |
| **`VITE_CURRENCYAPI_BASE_URL`** | Base URL for the Currencyapi. | `https://api.currencyapi.com/v3` |
| **`VERCEL_TOKEN`** | Personal Access Token (PAT) for Vercel authentication. | Token obtained from Vercel (Settings -> Tokens). |
| **`VERCEL_ORG_ID`** | ID of the Vercel organization/user. | ID found in Vercel Dashboard (Settings). |
| **`VERCEL_PROJECT_ID`** | ID of the project registered on Vercel. | ID found in Vercel Dashboard (Settings). |
