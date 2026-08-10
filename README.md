# 🎓 Student Query AI Chatbot

An intelligent, NLP-driven student query chatbot built with **Python**, **NLTK**, **Scikit-Learn (TF-IDF & Cosine Similarity)**, **Flask**, and a modern **Dark Glassmorphism Web Interface**.

---

## 🌟 Features

- 🧠 **Dual Matching Engine**: Combines **TF-IDF Vectorization & Cosine Similarity** with rule-based keyword pattern matching.
- 🏷️ **Confidence Scoring & Badges**: Calculates match confidence percentage for every query and displays colored confidence tags.
- 🎓 **Predefined Academic Knowledge Base**: Pre-loaded with Q&As covering:
  - **Courses & Eligibility** (B.Tech, B.Sc, BCA, MCA, MBA)
  - **Tuition Fees & Scholarships**
  - **Class & Library Timings**
  - **Exams & Placement Statistics**
  - **Hostel Facilities & Administration Contact**
- 💻 **Two Interactive Modes**:
  1. **Console CLI Chatbot (`cli_chatbot.py`)**: Terminal interface with simulated typing.
  2. **Web Application (`app.py` + Web UI)**: Web dashboard featuring voice input, text-to-speech read aloud, topic pills, quick query shortcuts, and a visual knowledge base drawer.
- 🚪 **Explicit Exit Option**: Handles commands like `exit`, `quit`, `bye`, or close buttons gracefully.

---

## 📁 Project Structure

```
MinorProject_vignesh/
├── dataset.json            # Knowledge base with Q&A intents and categories
├── nlp_engine.py           # Core NLP matching engine (TF-IDF, Cosine Similarity, NLTK)
├── cli_chatbot.py          # Interactive command-line terminal chatbot
├── app.py                  # Flask web server backend REST API
├── test_chatbot.py         # Unit testing suite
├── requirements.txt        # Python package dependencies
├── templates/
│   └── index.html          # Modern HTML5 web dashboard template
└── static/
    ├── style.css           # Glassmorphism dark-mode UI stylesheet
    └── script.js            # Dynamic chat interactions, speech recognition & TTS
```

---

## 🚀 Quick Setup & Installation

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Automated Unit Tests
```bash
python test_chatbot.py
```

---

## 🎮 Running the Chatbot

### Option A: Command Line Interface (CLI)
Run the terminal-based interactive chatbot:
```bash
python cli_chatbot.py
```
- Type any question (e.g., *"What is the fee structure for B.Tech?"*)
- Type `help` to list sample questions
- Type `exit` or `quit` to end the session

---

### Option B: Web Application (Browser Interface)
Launch the Flask web server:
```bash
python app.py
```
Open your browser and navigate to:
👉 **`http://localhost:5000`**

#### Web Features:
- 🎙️ **Voice Input**: Click the microphone icon to speak your query.
- 🔊 **Read Aloud**: Click the volume icon or "Listen" chip for text-to-speech.
- 💡 **Topic Pills & Quick Queries**: Click category filters or shortcut buttons for quick answers.
- 📚 **Browse Knowledge Base**: Click *"Browse Knowledge Base"* to search all pre-configured Q&As.

---

## 📊 NLP Logic Overview

1. **Preprocessing**: Lowercasing, punctuation stripping, tokenization (`nltk.word_tokenize`), and lemmatization (`WordNetLemmatizer`).
2. **Feature Extraction**: TF-IDF Matrix calculation (`TfidfVectorizer`) across all dataset question patterns with English stop words filtering.
3. **Similarity Scoring**: Cosine similarity ($\cos(\theta)$) calculated between user query vector and knowledge base patterns.
4. **Fallback & Recommendations**: If similarity is under threshold, keyword overlap fallback is evaluated, or top suggested queries are provided.

---

## 📝 License
Created as a Minor Project for Student Academic Helpdesk Queries.
