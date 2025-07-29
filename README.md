# 🧠 LegalLens AI

LegalLens AI is an intelligent contract analyzer that allows users to upload legal documents (PDFs), extract key clauses using AI, and get risk insights — all in a sleek, secure, and user-friendly interface.


## 🌐 Live Demo: [https://legal-lens-ai-tan.vercel.app/]

---

## 🚀 Features

- 📄 **PDF Upload** – Upload legal contracts securely.
- 🤖 **AI-Powered Clause Extraction** – Detects clauses like auto-renewal, termination, indemnity, etc.
- 🔍 **Risk Detection & Insights** – Highlights risky language and suggests alternatives.
- 📄 **Downloadable Insights** – Instantly download AI-extracted clause insights as a neatly formatted PDF report.
- 🔐 **JWT Authentication** – Signup/Login with secure token-based access.
- 📂 **Dashboard** – View, manage, and delete uploaded contracts.
- 💾 **MongoDB Integration** – Contracts and users stored securely.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14 (App Router)**
- **TypeScript + Tailwind CSS + shadcn/ui**
- **Axios** for API communication
- **JWT-based auth** with localStorage
- **Vercel** for deployment

### Backend
- **Node.js + Express.js**
- **MongoDB Atlas** (Mongoose ODM)
- **Gemini APIs** for clause insights
- **pdf-parse** for extracting text from contracts
- **CORS, JWT, bcrypt** for secure auth
- **Render** for deployment

---
## 📄 Folder structure
LegalLens_AI/
├── client/                     # Frontend (Next.js)
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── utils/
│   ├── .env.local
│   ├── package.json
│   └── next.config.ts
├── server/
|   ├── config/                     # Backend (Express.js)
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/                # Stored PDF files (temporary)
│   ├── .env
│   ├── server.js
│   └── package.json
├── .gitignore

