<div align="center">

  <img src="public/logo.png" alt="CareerAI / Sensai Logo" width="420"/>

  <p align="center">
    <strong>The Next-Generation AI Career Coach & Professional Growth Engine</strong>
  </p>

  <p align="center">
    Empowering professionals with real-time industry intelligence, ATS-tailored resume generation, contextual cover letters, and adaptive technical mock interview diagnostics.
  </p>

  <p align="center">
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-detailed-documentation">Architecture Docs</a> •
    <a href="#-license">License</a>
  </p>

  <!-- Shields & Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15.1.4-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15"/>
    <img src="https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19"/>
    <img src="https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini"/>
    <img src="https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
    <img src="https://img.shields.io/badge/Prisma-6.2.1-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma ORM"/>
    <img src="https://img.shields.io/badge/Inngest-Background_Jobs-000000?style=for-the-badge&logo=inngest&logoColor=white" alt="Inngest"/>
    <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk Auth"/>
    <img src="https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  </p>

  <br/>

  <!-- Hero Feature Showcase Preview -->
  <a href="public/features_preview.jpg">
    <img src="public/features_preview.jpg" alt="CareerAI Dashboard Interface Preview" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); border: 1px solid #1e293b;"/>
  </a>

</div>

<br/>

---

## 🌟 Why CareerAI?

Breaking into high-growth sectors or navigating career transitions is challenging. Traditional career tools offer static advice, generic resume templates, and expensive career coaching.

**CareerAI** (internally branded as **Sensai**) is engineered to democratize access to elite career guidance. By combining **Google's Gemini 2.5 Flash** LLM, serverless **PostgreSQL**, and **Inngest's** distributed workflow orchestration, CareerAI acts as a 24/7 personal career coach that adapts dynamically to your industry, target role, and current skill set.

<br/>

```
    🎯 Personalized Guidance     📈 Live Market Data         ⚡ Instant ATS Export
  ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
  │ Tailored to your exact │  │ Weekly automated scans │  │ Real-time markdown     │
  │ industry, sub-sector,  │  │ of salary ranges, skill│  │ builder with instant   │
  │ and experience level.  │  │ demand, and trends.    │  │ client-side PDF export.│
  └────────────────────────┘  └────────────────────────┘  └────────────────────────┘
```

---

## ✨ Key Features

### 1. 📈 Real-Time Industry Insights & Salary Benchmarking
- **Role-Based Salary Curves:** Interactive Recharts visualising 25th, median, and 75th percentile salary tiers across top industry positions.
- **Dynamic Market Outlooks:** Live sentiment analysis indicating `Positive`, `Neutral`, or `Negative` industry demand.
- **Top Competencies & Growth Rates:** Tracks high-velocity emerging skills and projected growth metrics for over 20+ industries and 100+ specializations.
- **Self-Healing Datasets:** When a user enters a new specialization, CareerAI generates fresh industry insights on demand.

### 2. 🎯 AI Adaptive Mock Interviews & Diagnostic Feedback
- **10-Question Dynamic Technical Quizzes:** Gemini generates multiple-choice quizzes tailored to your verified technical skills and domain.
- **Immediate Diagnostic Explanations:** Toggle in-depth answer explanations on any question to learn the reasoning behind every concept.
- **Smart Remediation Tips:** Evaluates incorrect answers to deliver encouraging, actionable 2-sentence study plans.
- **Historic Analytics:** Visualizes historic score trajectories with responsive Recharts trend lines.

### 3. 📄 Smart ATS Resume Builder & AI Rewriter
- **Dual-Pane Experience:** Toggle seamlessly between structured forms and full-featured Markdown editing with live syntax highlighting.
- **One-Click AI Bullet Optimizer:** Hit the AI wand button on any project or work experience bullet point. Gemini rewrites the description with active verbs, quantifiable metrics, and ATS keywords.
- **Instant Vector PDF Export:** High-fidelity client-side PDF rendering via `html2pdf.js` with professional typography and formatting.

### 4. ✉️ Context-Aware AI Cover Letter Generator
- **Role-Tailored Generation:** Matches company mission and specific job descriptions with your verified profile, skills, and background.
- **Markdown Document Preview:** Clean, business-formatted correspondence rendered in real time.
- **Document History & Archive:** Save, view, and permanently delete past cover letters with Radix UI confirmation modals.

### 5. ⚙️ Autonomous Weekly Market Refresh (Inngest Cron)
- **Zero-Downtime Cron Workflows:** Configured with Inngest serverless step functions running weekly on Sunday at midnight (`0 0 * * 0`).
- **Distributed Synchronization:** Sweeps through all tracked industry sectors, regenerates trends using Gemini, and refreshes database state without human intervention.

---

## 🏛️ System Architecture

CareerAI leverages a modern **Server-First App Router architecture** with Next.js 15, Clerk edge security, and direct Server Action RPCs:

```mermaid
graph TD
    User["👤 Candidate Browser"] -->|HTTPS / Requests| Edge["🛡️ Edge Middleware (Clerk Auth)"]
    
    subgraph Frontend Layer [Next.js 15 App Router]
        Edge --> Landing["Landing Page (/)"]
        Edge --> Onboarding["Onboarding (/onboarding)"]
        Edge --> Dashboard["Dashboard (/dashboard)"]
        Edge --> Resume["Resume Builder (/resume)"]
        Edge --> Cover["Cover Letter (/ai-cover-letter)"]
        Edge --> Interview["Mock Interview (/interview)"]
    end

    subgraph Server Action & Service Layer
        Dashboard --> DashAction["actions/dashboard.js"]
        Resume --> ResumeAction["actions/resume.js"]
        Cover --> CoverAction["actions/cover-letter.js"]
        Interview --> InterviewAction["actions/interview.js"]
        Onboarding --> UserAction["actions/user.js"]
    end

    subgraph AI & Background Orchestration
        DashAction -->|Prompt Inference| Gemini["🤖 Google Gemini 2.5 Flash"]
        ResumeAction -->|Bullet Enhancement| Gemini
        CoverAction -->|Cover Letter Drafting| Gemini
        InterviewAction -->|Quiz & Tip Generation| Gemini
        
        InngestCron["⏱️ Inngest Cron (Weekly 0 0 * * 0)"] -->|Webhook Callback| InngestRoute["/api/inngest Route Handler"]
        InngestRoute -->|step.ai.wrap| Gemini
    end

    subgraph Data & Persistence Layer
        UserAction --> Prisma["Prisma ORM Client"]
        DashAction --> Prisma
        ResumeAction --> Prisma
        CoverAction --> Prisma
        InterviewAction --> Prisma
        InngestRoute --> Prisma
        Prisma --> NeonDB[("🐘 Neon PostgreSQL (Serverless Pooler)")]
    end
```

---

## 🛠️ Tech Stack & Ecosystem

<table align="center">
  <tr>
    <td align="center" width="20%">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" width="45" height="45" alt="Next.js"/>
      <br/><b>Next.js 15</b>
      <br/><sub>App Router & Turbopack</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="45" height="45" alt="React 19"/>
      <br/><b>React 19</b>
      <br/><sub>Concurrent UI Engine</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/google/google-original.svg" width="45" height="45" alt="Google Gemini"/>
      <br/><b>Gemini 2.5 Flash</b>
      <br/><sub>Generative AI Model</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" width="45" height="45" alt="PostgreSQL"/>
      <br/><b>Neon Postgres</b>
      <br/><sub>Serverless Cloud DB</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/prisma/prisma-original.svg" width="45" height="45" alt="Prisma"/>
      <br/><b>Prisma 6.2</b>
      <br/><sub>Type-Safe ORM</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="20%">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="45" height="45" alt="Tailwind CSS"/>
      <br/><b>Tailwind CSS</b>
      <br/><sub>Modern Styling System</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://avatars.githubusercontent.com/u/104382595?s=200&v=4" width="45" height="45" alt="Radix UI"/>
      <br/><b>Radix UI / shadcn</b>
      <br/><sub>Accessible Primitives</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://avatars.githubusercontent.com/u/49538330?s=200&v=4" width="45" height="45" alt="Clerk"/>
      <br/><b>Clerk Auth</b>
      <br/><sub>Identity & Sessions</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://avatars.githubusercontent.com/u/84682402?s=200&v=4" width="45" height="45" alt="Inngest"/>
      <br/><b>Inngest</b>
      <br/><sub>Serverless Cron Workflows</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="45" height="45" alt="JavaScript"/>
      <br/><b>ESM JavaScript</b>
      <br/><sub>Full-Stack Logic</sub>
    </td>
  </tr>
</table>

---

## ⚡ Quick Start

Follow these steps to run CareerAI locally in under 3 minutes:

### 1. Prerequisites
- **Node.js:** v18.18.0 or v20+
- **PostgreSQL Database:** Free cluster on [Neon.tech](https://neon.tech) or local Postgres instance
- **Clerk Account:** Free keys from [Clerk Dashboard](https://dashboard.clerk.com)
- **Google AI Studio Key:** Free Gemini API key from [Google AI Studio](https://aistudio.google.com)

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/RajasiDeshpande/careerai-intelligent-career-guidance-platform.git
cd careerai-intelligent-career-guidance-platform

# Install dependencies (automatically runs prisma generate)
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# PostgreSQL Connection (Neon.tech recommended)
DATABASE_URL=postgresql://user:password@ep-your-instance.neon.tech/neondb?sslmode=require

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Push Database Schema
```bash
# Apply migrations to your database
npx prisma migrate dev
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser!

> **Optional (Inngest Cron Testing):**
> In a separate terminal, run the Inngest local dev server to trigger scheduled jobs:
> ```bash
> npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
> ```
> Visit `http://localhost:8288` to inspect and trigger background jobs.

---

## 📂 Repository File Tree

```
careerai-intelligent-career-guidance-platform/
├── actions/                  # Next.js Server Actions (Backend business logic)
│   ├── cover-letter.js       # AI Cover Letter creation, retrieval, deletion
│   ├── dashboard.js          # Industry insight retrieval & Gemini prompt generation
│   ├── interview.js          # Technical quiz generator & score evaluator
│   ├── resume.js             # Resume saving & Gemini bullet point improvement
│   └── user.js               # User onboarding verification & transaction updates
├── app/                      # App Router pages and route groups
│   ├── (auth)/               # Clerk Sign-In & Sign-Up catch-all pages
│   ├── (main)/               # Protected application portal
│   │   ├── ai-cover-letter/  # Cover letter listing, generator, and previewer
│   │   ├── dashboard/        # Industry trends & Recharts salary visualizations
│   │   ├── interview/        # Mock interview engine & historic analytics
│   │   ├── onboarding/       # Multi-step industry specialization form
│   │   └── resume/           # Dual-tab resume builder & client-side PDF export
│   ├── api/inngest/          # Inngest webhook API route handler
│   ├── globals.css           # Tailwind custom animations & theme variables
│   ├── layout.js             # Root layout with ClerkProvider & ThemeProvider
│   └── page.js               # Modern landing page with interactive 3D hero
├── components/               # Reusable UI & presentation components
│   ├── ui/                   # Radix UI primitives (Dialog, Tabs, Accordion, etc.)
│   ├── header.jsx            # Responsive navigation bar with Clerk UserButton
│   └── hero.jsx              # Hero section with interactive 3D scroll tilt
├── data/                     # Curated industries, features, FAQs, and testimonials
├── hooks/use-fetch.js        # Universal Server Action wrapper with loading states
├── lib/                      # Backend singleton instances (Prisma, Clerk, Inngest)
├── prisma/schema.prisma      # Relational schema (User, Assessment, Resume, CoverLetter)
└── public/                   # High-resolution logos, previews, and banners
```

---

## 📖 Detailed Technical Documentation

For an exhaustive, enterprise-grade deep dive into the internal implementation, API reference tables, data schemas, security audits, and lifecycle flows, refer to:

👉 **[`Data_implementation.md`](Data_implementation.md)** *(Complete Technical Architecture & Implementation Specification)*

Key topics covered inside `Data_implementation.md`:
- Comprehensive **API & Server Actions Reference Table** with request/response contracts.
- **Prisma Entity Relationship Diagram (ERD)** detailing foreign keys, cascade rules, and indexes.
- **Inngest Cron Execution Engine** and scheduled background worker lifecycles.
- **Prompt Engineering & Output Schemas** for Gemini 2.5 Flash.
- **Full Security, Reliability & Performance Audit** with actionable remediations.
- **New Developer Onboarding Walkthrough** for adding endpoints and extending data models safely.

---

## 🤝 Contributing

Contributions make the open-source community an inspiring place to learn, inspire, and create:

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with 💖 by <strong>AlgoNauts</strong></p>
  <p>
    <a href="#careerai--sensai-intelligent-career-guidance-platform">Back to Top ⬆️</a>
  </p>
</div>