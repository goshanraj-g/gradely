# 🎯 Gradely

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/React-%5E18.0-61DAFB.svg)](https://reactjs.org/)
[![FastAPI Version](https://img.shields.io/badge/FastAPI-%5E0.110-009688.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC.svg)](https://tailwindcss.com/)

<p align="center">
  <img src="frontend/public/logo.png" alt="Gradely Logo" width="120"/>
</p>

---

## About the Project

**Gradely** is a full-stack web application that replaces spreadsheets with an interactive, student-friendly dashboard for tracking grades, forecasting final outcomes, and testing academic scenarios.

Built by a student, for students, it's a smarter way to stay in control of your academic goals.

---

## Key Features

### Core Features (MVP)
- 📘 **Course Creation**: Add multiple courses with term info
- 📝 **Assessment Input**: Log assignments, quizzes, exams, and labs with custom weights
- 📊 **Live Grade Breakdown**: Dynamic grade calculation based on completed work
- 🎯 **Goal Simulation**: Set a target grade and get insight into what you need to reach it
- 🔮 **Scenario Testing**: Simulate what-if grades for individual assessments

### Stretch Goals
- 📆 **Calendar Integration** for assignment due dates

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (v18+)
- **TailwindCSS**
- **ShadCN**

### Backend
- **Python** with **FastAPI**
- **PostgreSQL** 
- **Auth**: JWT-based, with OAuth2 support planned

### Parsing / AI (Planned)
- **OCR**: AWS Textract / Python Tesseract
- **Parsing**: Regex + ML for syllabus extraction

---

## 🧪 Feature Flow Example: Scenario Calculator

Let’s say you’ve completed 70% of your course with an average of 85%, and you're aiming for a 90% final grade.
Gradely shows you exactly what mark you need on your remaining evaluations to reach your goal,
no spreadsheets, no guesswork, just clean visuals and accurate math.

---

## 🏠 Home Screen Preview

<p align="center">
  <img src="frontend/public/homescreen.png" alt="Home Screen Preview" width="600"/>
</p>

---

## 🧮 Calculator Demo

<p align="center">
  <img src="frontend/public/calculator-demo.png" alt="Calculator Demo" width="600"/>
</p>

---

## 🚀 How to Run (Dev)

### Prerequisites
- Node.js + npm
- Python 3.11+
- PostgreSQL

### Setup

```bash
git clone https://github.com/your-username/gradetracker.git
cd gradetracker

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd ../frontend
npm install
npm run dev
