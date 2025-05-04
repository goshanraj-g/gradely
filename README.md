# GradeTracker ("TermCalc")

A full-stack web application for tracking university course grades, simulating grading scenarios, and replacing traditional spreadsheets with an interactive, goal-focused dashboard.

---

## 🧠 Overview

GradeTracker is built for students who want a clean, structured way to monitor and forecast their academic performance. Whether you're aiming for a certain GPA or just trying to avoid surprises, this app makes it simple to manage your coursework.

---

## ✅ Core Features (MVP)

### 📘 Course Creation

* Add multiple courses with term start/end dates.

### 📝 Assessment Input

* Add assignments, exams, quizzes, and labs with custom weights.
* Input current grades or leave blank for future items.

### 📊 Live Grade Breakdown

* Calculates current grade based on completed work.
* Displays visualizations like pie charts and progress bars.

### 🎯 Goal Simulation

* Set a target grade and see what's needed to reach it.

### 🔮 Scenario Testing

* Input hypothetical grades to simulate outcomes.
* View insights on max/min achievable performance.

### 💾 Data Persistence

* Data stored locally (LocalStorage) by default.
* Optional: cloud sync using AWS (S3 or DynamoDB).

---

## 🚀 Stretch Features

* Export course summaries or semester reports as PDF/CSV
* Calendar integration for assignment due dates
* GPA calculator based on completed courses
* Email/SMS reminders (via AWS SES/SNS)
* Offline/mobile support with PWA

---

## 🧠 Advanced Feature Idea: Course Outline Parser

### 📄 Problem

Entering assessment weights manually from course syllabi is tedious.

### 💡 Solution

Upload a screenshot or PDF of the syllabus, and the app:

* Uses AWS Textract/Comprehend to extract structured text
* Parses tables/lists for assessment titles, weights, and due dates
* Pre-fills the assessment form for user confirmation

---

## 🛠️ Tech Stack

* **Frontend:** React + TailwindCSS + shadcn
* **State Management:** Context API
* **Charts:** Chart.js or Recharts
* **Backend:** Python (FastAPI)
* **Storage (MVP):** PostgreSQL (local for dev, optional AWS RDS for prod)
* **Cloud (Optional):** AWS S3, DynamoDB, Lambda, Cognito, SES/SNS
* **OCR/Parsing:** AWS Textract or Python Tesseract

---

## 🗃️ Database Schema Proposal (MVP)

### Users (optional)

* `id` (UUID)
* `email` (string)
* `created_at` (timestamp)

### Courses

* `id` (UUID)
* `user_id` (UUID, foreign key)
* `course_name` (string)
* `course_code` (string)
* `term` (string)
* `target_grade` (float)

### Assessments

* `id` (UUID)
* `course_id` (UUID, foreign key)
* `title` (string)
* `type` (enum: assignment, quiz, exam, lab, etc.)
* `due_date` (date)
* `weight` (float)
* `grade_received` (float, nullable)

---

## 🚢 Deployment Plan

* Host frontend via S3 + CloudFront
* API backend with FastAPI on Lambda or EC2
* Optional: GitHub Actions for CI/CD

---

## 🎓 Why This Matters

* Provides clarity and control over academic performance
* Practical tool with real-world value
* Demonstrates full-stack skills across frontend, backend, cloud, and even document parsing/AI

---

## 🔧 Next Steps

1. Build frontend UI using `shadcn`
2. Implement grade logic and simulations in FastAPI
3. Store data with PostgreSQL (locally first)
4. Test course outline parsing with AWS Textract
5. Package and deploy to AWS

---

## 👨‍🎓 Target Audience

STEM students (and others) who want something smarter than Excel, lighter than an LMS, and fully in their control.
