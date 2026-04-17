# 🚀 Currency Converter Challenge (React + TypeScript)

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
VITE_CURRENCYAPI_BASE_URL="[https://api.currencyapi.com/v3](https://api.currencyapi.com/v3)"
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
```

---

## 🤖 GitHub Actions CI/CD Pipeline

The project uses a GitHub Actions workflow to automate the testing, build, and production deployment on Vercel via the Vercel CLI. This pipeline is triggered automatically on every **`push`** to the **`main`** branch.

### 📝 Vercel Pre-Configuration Steps

Since the deployment is controlled by the GitHub Actions, you must ensure the native Vercel build is disabled and that Vercel expects the build output from the CI runner.

1.  **Disable Automatic Build:**
    * Go to your **Vercel Dashboard** > **Project Settings** > **Git**.
    * Find the **Ignored Build Step** setting.
    * Select **Custom** and enter the command: `exit 1`.
    * This prevents Vercel from attempting its native build process (which would fail with `vite: command not found`).

2.  **Override Build Command (Recommended):**
    * Go to **Project Settings** > **Build & Deployment**.
    * Override the **Build Command** to: `echo "Build skipped via CI"`
    * This confirms to Vercel that the build will be provided by the CI.

---

### Pipeline Flow (`test-build-deploy` Job):

1. **`Checkout code`**: Retrieves the repository source code.
2. **`Setup Node.js`**: Configures the Node.js environment (v20) and uses caching for `npm` dependencies.
3. **`Install dependencies`**: Installs all dependencies (`npm ci`) and the Vercel CLI globally.
4. **`Check coverage threshold`**: **Executes the tests** and enforces the 80% coverage rule.
5. **`Create .env file`**: Creates a temporary `.env` file for the build.
6. **`Build application`**: Compiles the final production application (`npm run build`).
7. **`Prepare Vercel Prebuilt Structure`**: Creates the internal Vercel structure (`.vercel/output`) and copies the `dist` files, preparing the artifacts for the `--prebuilt` deploy command.
8. **`Deploy to Vercel (CLI)`**: Uses the Vercel CLI to deploy the pre-built application to **Vercel** as a **production** environment.

### GitHub Secrets Configuration

To enable the pipeline to connect to the external API (Currencyapi) and Vercel for deployment, you must configure the following **Environment Secrets** in your GitHub repository.

#### Obtaining Vercel Secrets (Canonical IDs)

For the Vercel CLI to authenticate and find your project correctly, you must use the internal, canonical IDs.

#### 1. VERCEL_TOKEN (Personal Access Token - PAT)

1. Navigate to the **Vercel Dashboard**.
2. Go to **Account Settings** > **Tokens**.
3. Generate a new Token, ensuring the **Scope** is set to your **Full Account** (`victorts1991`).
4. **Copy the generated token immediately** and use it for the `VERCEL_TOKEN` secret.

#### 2. VERCEL_ORG_ID and VERCEL_PROJECT_ID

The most reliable way to get these IDs is through the file generated by the Vercel CLI locally, which contains the canonical IDs:

1. In your project's root folder, run: `vercel link` (and follow the prompts to link the project).
2. The Vercel CLI creates a file: **`.vercel/project.json`** in your local directory.
3. Open this file and copy the values for:
    * **`orgId`**: This is your `VERCEL_ORG_ID` (it starts with `team_` or `user_`).
    * **`projectId`**: This is your `VERCEL_PROJECT_ID` (it starts with `prj_`).

### GitHub Secrets Configuration

| Secret Name | Purpose | Value to Provide |
| :--- | :--- | :--- |
| **`VITE_CURRENCYAPI_KEY`** | API Key for the Currency Converter (Currencyapi). | Your actual API Key. |
| **`VITE_CURRENCYAPI_BASE_URL`** | Base URL for the Currencyapi. | `https://api.currencyapi.com/v3` |
| **`VERCEL_TOKEN`** | Personal Access Token (PAT) for Vercel authentication. | Token obtained from Vercel (Full Account Scope). |
| **`VERCEL_ORG_ID`** | ID of the Vercel organization/user. | **Canonical ID** (`team_...` or `user_...`) from the `.vercel/cfg.json` file. |
| **`VERCEL_PROJECT_ID`** | ID of the project registered on Vercel. | **Project ID** (`prj_...`) from the `.vercel/cfg.json` file. |
