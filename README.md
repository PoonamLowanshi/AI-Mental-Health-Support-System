# 🧠 AI Mental Health Support System

An AI-powered mental wellness web application designed to help users track their mood, communicate with an AI wellness companion, practice relaxation activities, and maintain a simple personal wellness record.

## ✨ Features

- 🔐 User Registration & Login
- 📊 Personal Dashboard
- 😊 Mood Tracker
- 📈 Mood History & Analytics
- 🤖 AI Mental Health Assistant
- 🚨 Emergency / Crisis Support
- 🎙️ Voice Assistant
- 🌿 Wellness Corner
- 🧩 Mind Games
  - Memory Match
  - Number Puzzle
  - Word Scramble
  - 2048
  - Focus Tap
- 🌬️ Breathing Exercise
- 🎵 Mood Music
- 👤 User Profile
- ⏳ AI Loading & Error States
- 💾 Local Database Storage

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- CSS
- Recharts

### Backend
- Python
- FastAPI
- SQLite
- Uvicorn

### AI
- Ollama
- Qwen 2.5 1.5B
- Local AI Processing

### Voice
- Web Speech API
- Browser Speech Recognition
- Browser Speech Synthesis

## 📁 Project Structure

```text
AI-MENTAL-HEALTH-SUPPORT/
│
├── backend/
│   ├── main.py
│   ├── db.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

## ⚙️ Requirements

Before running the project, make sure you have:

- Node.js
- Python 3.x
- Ollama
- Qwen 2.5 1.5B model

## 🚀 How to Run

### Backend

Open a terminal inside the `backend` folder:

```bash
cd backend
py -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn requests
py -m uvicorn main:app --reload