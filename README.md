<div align="center">
  <img width="1200" height="475" alt="AgriTrust Export Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# AgriTrust Export ☕⛓️

AgriTrust Export is a compliance and blockchain-verified export passport platform tailored for Vietnamese coffee exporters selling to EU buyers under EUDR (European Union Deforestation Regulation) regulations.

## 🚀 Key Features

* **EUDR Compliance Verification**: Automatic validation of farm location, deforestation history, and compliance requirements.
* **Blockchain-Verified Passports**: Secures export data and certificates on-chain to prevent tampering and guarantee authenticity.
* **Traceability Dashboard**: Interactive visualization of supply chain nodes from local farms to international buyers.
* **AI-Assisted Document Parsing**: Automatically extracts and checks compliance details from customs, land registration, and logistics files.

---

## 🛠️ Run Locally

### Prerequisites

* Node.js (v18+)
* Bun or npm

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   # or using Bun
   bun install
   ```

2. **Environment Variables**:
   Copy the `.env.example` file to `.env.local` and fill in your Gemini API key:
   ```bash
   cp .env.example .env.local
   ```
   Set `GEMINI_API_KEY` to your official Google AI Studio API key.

3. **Run Dev Server**:
   ```bash
   npm run dev
   # or using Bun
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.
