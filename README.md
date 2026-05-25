# MezoOS 🌐

**MezoOS** is a Bitcoin-native treasury and payments operating system. It helps users and internet businesses operate on Bitcoin without selling it by using BTC-backed MUSD as an operating balance. 

Built specifically for the Mezo ecosystem, this application allows users to manage treasury health, send MUSD payments, and unlock premium automation controls using MEZO.

---

## 🚀 Hackathon Features
- **Bitcoin-Native Onboarding**: Integrated with **Mezo Passport** to allow seamless connections via native Bitcoin wallets (e.g. Xverse, Unisat) and standard EVM wallets (e.g. MetaMask).
- **BTC-Backed Treasury**: Deposit BTC to safely mint MUSD dynamically, utilizing **Mezo Oracles** to guarantee loans are collateralized by live on-chain market data.
- **Smart Invoicing & Subscriptions**: Create and pay MUSD invoices entirely on-chain using the `InvoiceManager` and `RecurringPayments` smart contracts.
- **AI Financial Assistant**: Ask the AI (powered by OpenAI) to generate invoices, summarize treasury health, and handle automated financial actions using natural language.
- **MEZO Utility Tiers**: Stake MEZO tokens to unlock premium treasury controls.

---

## 📜 Deployed Smart Contracts (Mezo Testnet - Matsnet)

The core operating system relies on the following smart contracts deployed live to the Mezo Testnet (Chain ID: 31611):

| Contract | Address | Description |
|---|---|---|
| **MockMUSD** | `0xB07082059231eBa9cf8d5A1E41f86a60b7334Cef` | The BTC-backed stablecoin used for operations. |
| **MockMEZO** | `0xaEAD54C9251D14113f9d71Fee95183751a6F8bd1` | The utility token used for automation tiers and discounts. |
| **MockOracle** | `0x86900d01d9d9921Cb9eF05AAF5E81f002CbC1D68` | Provides live BTC pricing to the Treasury. |
| **MezoTreasury** | `0x1B1aB51446fCEcBFF632FFCec769C55504E50a02` | Core vault handling BTC deposits and MUSD minting. |
| **InvoiceManager** | `0xcDC70B86985CDF7dfC311d3c43fd5d9FF6023995` | Handles creation and MUSD settlement of business invoices. |
| **RecurringPayments** | `0xdaa0675bf1592FE3A0a822b0194bA2b9e9BFfB92` | Smart contract for handling MUSD subscriptions. |
| **MezoUtilityTier** | `0x20e61A9CB6Bf904Af5F1374326bE426D3Fce399f` | Staking contract to lock MEZO and unlock OS features. |

*Verify these transactions on the [Mezo Testnet Explorer](https://explorer.test.mezo.org/).*

---

## 🛠 Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, shadcn/ui, Wagmi, Mezo Passport
- **Backend**: Node.js, Express, MongoDB (Mongoose), OpenAI SDK
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB instance (local or MongoDB Atlas)
- OpenAI API Key

### 2. Install Dependencies
This is a monorepo setup using npm workspaces. Run this at the root:
```bash
npm install
```

### 3. Configure Environment Variables
**Backend (`apps/api/.env`):**
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

**Frontend (`apps/web/.env.local`):**
*(Optional: If your frontend requires any specific NEXT_PUBLIC vars)*

### 4. Start the Application

**Start the Express Backend:**
```bash
npm run dev:api
# Runs on http://localhost:3001
```

**Start the Next.js Frontend:**
```bash
npm run dev:web
# Runs on http://localhost:3000
```

---

## ☁️ Deployment Guide

### Deploying the Backend (Render)
1. Push your repository to GitHub.
2. Create an account on [Render](https://render.com/).
3. Click **New +** and select **Web Service**.
4. Connect your GitHub repository.
5. Configuration:
   - **Root Directory:** `apps/api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js` (or whatever your start script is, e.g. `npx ts-node src/server.ts` or `npm run start`)
6. Add your Environment Variables (`MONGODB_URI`, `OPENAI_API_KEY`, etc.).
7. Click **Deploy**. Once finished, copy the provided `onrender.com` URL.

### Deploying the Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository.
3. In the "Configure Project" step:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
4. In "Environment Variables", add the URL of your newly deployed Render backend:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`
5. Click **Deploy**.
