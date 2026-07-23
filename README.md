# 🏥 ShiftBridge AI — Clinical ISBAR Handover & Risk Summarizer

> **Live Application URL:** [https://shiftbridge-ai.vercel.app](https://shiftbridge-ai.vercel.app)  
> **GitHub Repository:** [https://github.com/mudass94541-star/shiftbridge-ai](https://github.com/mudass94541-star/shiftbridge-ai)

---

## 📌 Project Overview & Problem Statement

### **The Problem:**
In high-pressure clinical environments, healthcare staff (nurses and physicians) manage rapid patient turnover and complex care plans. Verbal or unstructured handovers during shift changes are leading causes of communication breakdown, missing critical alerts (e.g., oxygen desaturations, pending lab orders, strict fluid balance tracking), and clinical errors.

### **The Solution:**
**ShiftBridge AI** is an AI-driven clinical tool that standardizes shift handover reporting. It allows healthcare workers to paste unformatted, free-text shift notes and instantly transforms them into a structured, standardized **ISBAR** framework (*Identify, Situation, Background, Assessment, Recommendation*) while highlighting urgent clinical alerts.

### **Target Audience:**
* Charge Nurses & Staff Nurses
* On-call Physicians & Resident Doctors
* Hospital Ward Administrators & Clinical Teams

---

## ⭐ Features

* 📝 **Free-Text Shift Note Parser:** Accepts raw nursing notes, vital sign logs, and clinical updates in plain text.
* 🩺 **Standardized ISBAR Handover Generation:** Instantly organizes chaotic notes into standardized **I-S-B-A-R** sections.
* ⚠️ **Critical Risk & Alert Highlighting:** Automatically detects high-risk clinical events (e.g., low $SpO_2$, abnormal blood pressure, pending electrolyte lab results, low urine output).
* 🧪 **Sample Data Generator:** Pre-loads mock clinical scenarios for quick testing and demonstration.
* ⚡ **Real-Time AI Processing:** Fast response streaming powered by Google Gemini AI.

---

## 🤖 The AI Feature & Instructions

ShiftBridge AI utilizes the **Google Gemini API** (`gemini-1.5-flash` / `gemini-2.0-flash`) to analyze unstructured clinical text.

### **System Prompt / Instructions Used:**

```text
You are ShiftBridge AI, an expert clinical communication assistant for healthcare professionals.
Your task is to convert raw clinical shift notes into a structured ISBAR (Identify, Situation, Background, Assessment, Recommendation) handover report.

Analyze the input clinical text and return the response in structured JSON format with the following keys:
1. criticalAlerts (Array of strings): Identify immediate high-risk clinical priorities, unstable vitals, pending critical lab results, or strict doctor instructions.
2. identify (String): Patient identity (Name, Age, Gender, Bed/Ward number if present).
3. situation (String): Primary reason for admission, current active diagnosis, and immediate status.
4. background (String): Brief relevant history, key interventions given during the shift.
5. assessment (String): Latest vital signs, physical findings, and fluid/lab statuses.
6. recommendation (String): Clear actionable follow-ups, pending tests, and monitoring protocols for the incoming shift team.

Maintain clinical accuracy, use concise professional medical terminology, and strictly output valid JSON.This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
