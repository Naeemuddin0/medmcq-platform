# MedMCQ Platform - Viva Preparation Guide

## Project Overview
MedMCQ is an intelligent web platform for medical MCQ practice and progress tracking. It helps medical students and professionals prepare for exams using data-driven insights, personalized feedback, and modern web technology.

## Main Features
- **User Authentication:** Secure login and registration using NextAuth.js.
- **Dashboard:** Shows user progress, correctness ratio, and preparation estimation for each subject using simple ML logic.
- **Practice Mode:** Users can select a subject and practice MCQs, with instant feedback and explanations.
- **Progress Tracking:** Tracks attempted and correct answers per subject, updates dashboard stats in real time.
- **Reset & Skip:** Users can reset progress for a subject or skip questions.
- **Contact & About Pages:** Modern, styled pages with a working contact form (using Resend for email delivery).
- **Modern UI:** Glassmorphism design, dark/light mode support, responsive layout.

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, MongoDB (Mongoose ODM)
- **Authentication:** NextAuth.js (JWT strategy)
- **Email:** Resend transactional email API
- **Styling:** Tailwind CSS, custom glassmorphism and gradient effects

## Team
- **Naeem Ud Din** – Data Scientist
- **Imran Nadeem** – Data Analyst
- **Hassan Raza** – Data Analyst

## Key Implementation Details
- **MCQ Storage:** All MCQs are stored in a single MongoDB collection (`mcqs`) with a `subject_name` field.
- **Progress Model:** Tracks `completedQuestions` (all attempted), `correctCount`, and `currentIndex` for each user/subject.
- **ML Stats:** Dashboard shows correctness ratio (correct/attempted) and preparation estimation (Low/Medium/High).
- **Contact Form:** Uses Resend API to send emails to the admin email.
- **Glassy UI:** All subject cards use a glassmorphism style with unique accent borders.
- **Routing:** `/dashboard` for stats, `/practice` for subject selection, `/practice/[subject]` for MCQs, `/about` and `/contact` for info.

## Possible Viva Questions & Answers

### 1. **How does user authentication work?**
- Uses NextAuth.js with JWT strategy. Credentials are checked against the MongoDB `users` collection. Sessions are managed via JWT tokens.

### 2. **How is user progress tracked?**
- Each user/subject has a `Progress` document storing all attempted question IDs, number of correct answers, and current index. This enables accurate stats and ML-based feedback.

### 3. **How are MCQs fetched and presented?**
- MCQs are fetched from the `mcqs` collection by subject, skipping already attempted questions. Each question includes options, explanation, and the correct answer.

### 4. **How does the contact form send emails?**
- The form submits to an API route that uses the Resend API to send emails to the admin address. Credentials are stored in environment variables.

### 5. **What is glassmorphism and how is it implemented?**
- Glassmorphism is a UI style using semi-transparent backgrounds, blur, and soft borders. Implemented using Tailwind CSS and custom styles for all subject cards and navigation.

### 6. **How does the dashboard update after practicing?**
- When returning from practice, the dashboard is reloaded to fetch the latest progress from the backend, ensuring real-time stats.

### 7. **How is correctness and preparation estimated?**
- Correctness = correctCount / attempted. Preparation is Low (<50%), Medium (50-79%), High (80%+).

### 8. **How is the project structured?**
- `src/app/` contains all pages and API routes. Components are in `src/components/`. Models are in `src/app/models/` and `src/models/`.

### 9. **How are environment variables managed?**
- Sensitive info (like email API keys) is stored in `.env.local` and never committed to version control.

### 10. **How would you extend this project?**
- Add analytics, more ML for recommendations, user profiles, admin panel, or more question types.

---

**Good luck with your viva! Review this file and the codebase for confidence in answering any questions.** 