# 🎓 ACADEMIC PROJECT REPORT
## TITLE: STUDENT QUERY AI CHATBOT USING NATURAL LANGUAGE PROCESSING

---

### **TABLE OF CONTENTS**
1. [Abstract](#1-abstract)
2. [Introduction & Background](#2-introduction--background)
3. [Problem Statement & Objectives](#3-problem-statement--objectives)
4. [Tools, Technologies & Dependencies](#4-tools-technologies--dependencies)
5. [System Architecture & Dataflow](#5-system-architecture--dataflow)
6. [Knowledge Base & Dataset Design](#6-knowledge-base--dataset-design)
7. [Mathematical & Algorithmic Foundations](#7-mathematical--algorithmic-foundations)
8. [Module Implementation & Code Overview](#8-module-implementation--code-overview)
9. [Experimental Results & Testing](#9-experimental-results--testing)
10. [Conclusion & Future Enhancements](#10-conclusion--future-enhancements)

---

### **1. ABSTRACT**
In academic institutions, administrative helpdesks are routinely overwhelmed by repetitive queries regarding course offerings, fee structures, class schedules, admission criteria, and contact information. This project presents a lightweight, highly accurate **Student Query AI Chatbot** developed using **Python**, **Natural Language Processing (NLP)** techniques, and **Rule-Based Logic**.

The system utilizes an intent-based architecture. Input queries undergo tokenization, lowercasing, stop-words removal, and lemmatization via NLTK, followed by **Term Frequency-Inverse Document Frequency (TF-IDF)** vectorization. Sentence similarity is evaluated using **Cosine Similarity** ($\cos \theta$), with a keyword-overlap rule engine acting as a fallback for low-confidence inputs. The project provides both a **Console Command-Line Interface (CLI)** and a modern **Dark Glassmorphism Web Dashboard** (Flask REST API backend with client-side fallback), featuring real-time confidence badges, speech recognition, read-aloud audio, transcript exports, and explicit exit options.

---

### **2. INTRODUCTION & BACKGROUND**
Artificial Intelligence and Natural Language Processing have revolutionized how users interact with digital systems. In an educational setting, providing timely and accurate responses to prospective and current students improves operational efficiency and user satisfaction. Traditional human-staffed helpdesks often suffer from delays during peak admission hours. An AI chatbot offers 24/7 instant query resolution without manual intervention.

---

### **3. PROBLEM STATEMENT & OBJECTIVES**

#### **Problem Statement**
Students and parents frequently inquire about administrative details through emails or calls, causing delays and redundant workload for staff. Existing large language model (LLM) APIs can be expensive, resource-intensive, and prone to hallucinations when answering domain-specific college queries.

#### **Objectives**
1. Develop a deterministic, offline-capable NLP model tailored for student queries.
2. Structure a comprehensive JSON knowledge base covering Courses, Fees, Timings, Contact Info, Admissions, Facilities, and Placements.
3. Compute quantitative confidence matching scores using TF-IDF and Cosine Similarity.
4. Build dual operational modes: an interactive terminal CLI (`cli_chatbot.py`) and a web interface (`app.py` / `index.html`).
5. Include explicit session termination (`exit`, `quit`, `bye`).

---

### **4. TOOLS, TECHNOLOGIES & DEPENDENCIES**

| Component | Technology / Library | Version / Detail |
| :--- | :--- | :--- |
| **Language** | Python | 3.10+ |
| **NLP Processing** | NLTK (Natural Language Toolkit) | WordNetLemmatizer, StopWords |
| **Machine Learning** | Scikit-Learn | TfidfVectorizer, Cosine Similarity |
| **Numeric Computations**| NumPy | Array & Indexing Operations |
| **Web Server** | Flask | Lightweight REST API Engine |
| **Frontend UI** | HTML5, Vanilla CSS3, JavaScript (ES6) | Responsive Glassmorphism Design |
| **Icons & Fonts** | FontAwesome 6.4, Google Fonts | Outfit & Inter Typography |

---

### **5. SYSTEM ARCHITECTURE & DATAFLOW**

```
                   +------------------------+
                   |   User Input Query     |
                   +-----------+------------+
                               |
                               v
                   +------------------------+
                   | Text Preprocessing     |
                   | (Clean, Lower, Lemmatize|
                   +-----------+------------+
                               |
                               v
                   +------------------------+
                   |  TF-IDF Vectorization  |
                   |  (N-Gram Feature Matrix)|
                   +-----------+------------+
                               |
                               v
                   +------------------------+
                   |  Cosine Similarity     |
                   |  Calculation vs Patterns|
                   +-----------+------------+
                               |
                   +-----------+-----------+
                   |                       |
        (Similarity >= 25%)      (Similarity < 25%)
                   |                       |
                   v                       v
      +------------------------+ +------------------------+
      | High-Confidence Intent | | Rule Keyword Fallback  |
      | Return Matched Response| | & Suggested Questions  |
      +------------+-----------+ +-----------+------------+
                   |                       |
                   +-----------+-----------+
                               |
                               v
                   +------------------------+
                   | Output Display + Badges|
                   | (CLI / Web Dashboard)  |
                   +------------------------+
```

---

### **6. KNOWLEDGE BASE & DATASET DESIGN**
The dataset is structured as a JSON file (`dataset.json`) containing intent tags, categories, query patterns, and responses:

```json
{
  "tag": "fee_structure",
  "category": "Fees",
  "patterns": [
    "What is the fee structure?",
    "How much are the tuition fees?",
    "Fee per semester for B.Tech",
    "What is the cost of studying MCA?"
  ],
  "responses": [
    "Tuition fees are approximately ₹45,000 per semester for B.Tech, ₹35,000 per semester for BCA/B.Sc, and ₹50,000 per semester for MCA/MBA. Installment options are available."
  ]
}
```

---

### **7. MATHEMATICAL & ALGORITHMIC FOUNDATIONS**

#### **A. Term Frequency (TF)**
$$\text{TF}(t, d) = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}$$
where $f_{t,d}$ is the frequency of term $t$ in query $d$.

#### **B. Inverse Document Frequency (IDF)**
$$\text{IDF}(t, D) = \log\left(\frac{|D|}{|\{d \in D : t \in d\}|}\right)$$
where $|D|$ is the total number of pattern documents in the knowledge base.

#### **C. Cosine Similarity**
$$\cos(\theta) = \frac{\vec{U} \cdot \vec{V}_i}{\|\vec{U}\| \|\vec{V}_i\|} = \frac{\sum_{k=1}^n U_k V_{i,k}}{\sqrt{\sum_{k=1}^n U_k^2} \sqrt{\sum_{k=1}^n V_{i,k}^2}}$$

---

### **8. MODULE IMPLEMENTATION & CODE OVERVIEW**

1. **`nlp_engine.py`**: Loads dataset, initializes `TfidfVectorizer(stop_words='english')`, cleans query input, and performs similarity matrix multiplication using `cosine_similarity`.
2. **`cli_chatbot.py`**: Executes an interactive terminal loop with colored category badges, typing simulation (`time.sleep`), and explicit exit triggers.
3. **`app.py`**: Serves REST API endpoints (`/api/chat`, `/api/dataset`, `/api/categories`).
4. **`static/script.js`**: Handles user interactions, speech-to-text, text-to-speech, theme switching, and standalone offline JS matching fallback.

---

### **9. EXPERIMENTAL RESULTS & TESTING**
Automated unit tests (`test_chatbot.py`) validated 100% execution accuracy across 6 core query classes.

- **Greeting Intent Match**: `100.0%` Confidence
- **Fees Query Match**: `89.9%` Confidence
- **Class Timings Match**: `100.0%` Confidence
- **Out of Domain Detection**: `0.0%` Confidence (Triggers fallback suggestion)
- **Exit Detection**: `100.0%` Confidence (`is_exit = True`)

---

### **10. CONCLUSION & FUTURE ENHANCEMENTS**
The Student Query AI Chatbot successfully satisfies all project requirements by providing reliable, instant responses to common academic inquiries through both terminal CLI and web interfaces.

#### **Future Enhancements**:
1. Integration with SQL / University Database for personalized student grade/attendance lookups.
2. Multilingual translation support (Hindi, Spanish, French).
3. Integration with WhatsApp Business API / Telegram bot API.
