import json
import os
import re
import random
import numpy as np

# Try importing NLTK and sklearn; provide safe fallback if missing
try:
    import nltk
    from nltk.stem import WordNetLemmatizer
    from nltk.corpus import stopwords

    # Ensure required NLTK resources are downloaded silently
    for resource in ['punkt', 'wordnet', 'stopwords']:
        try:
            nltk.data.find(f'tokenizers/{resource}' if resource == 'punkt' else f'corpora/{resource}')
        except LookupError:
            try:
                nltk.download(resource, quiet=True)
            except Exception:
                pass
    
    lemmatizer = WordNetLemmatizer()
    NLTK_AVAILABLE = True
except Exception:
    NLTK_AVAILABLE = False
    lemmatizer = None

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except Exception:
    SKLEARN_AVAILABLE = False


class StudentChatbotNLP:
    def __init__(self, dataset_path="dataset.json"):
        self.dataset_path = dataset_path
        self.intents = []
        self.all_patterns = []
        self.pattern_intent_map = []  # Stores (intent_dict, pattern_str)
        self.vectorizer = None
        self.tfidf_matrix = None
        self.load_dataset()

        # Default English stop words
        self.stop_words = set([
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
            "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't",
            "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
            "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having",
            "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how",
            "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself",
            "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once",
            "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
            "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the",
            "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll",
            "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
            "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
            "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
            "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
        ])

    def preprocess_text(self, text, remove_stop=False):
        """Tokenize, lowercase, clean, and lemmatize text."""
        text = text.lower()
        # Remove special characters
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)

        if NLTK_AVAILABLE and lemmatizer:
            try:
                tokens = nltk.word_tokenize(text)
                tokens = [lemmatizer.lemmatize(word) for word in tokens]
                if remove_stop:
                    tokens = [w for w in tokens if w not in self.stop_words]
                return " ".join(tokens)
            except Exception:
                pass

        # Fallback basic preprocessing
        tokens = text.split()
        if remove_stop:
            tokens = [w for w in tokens if w not in self.stop_words]
        return " ".join(tokens)

    def load_dataset(self):
        """Load intent dataset and build TF-IDF model."""
        if not os.path.exists(self.dataset_path):
            raise FileNotFoundError(f"Dataset file '{self.dataset_path}' not found.")

        with open(self.dataset_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.intents = data.get("intents", [])
        self.all_patterns = []
        self.pattern_intent_map = []

        preprocessed_patterns = []
        for intent in self.intents:
            for pattern in intent.get("patterns", []):
                cleaned_pattern = self.preprocess_text(pattern)
                preprocessed_patterns.append(cleaned_pattern)
                self.all_patterns.append(pattern)
                self.pattern_intent_map.append(intent)

        if SKLEARN_AVAILABLE and preprocessed_patterns:
            self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
            self.tfidf_matrix = self.vectorizer.fit_transform(preprocessed_patterns)

    def is_exit_query(self, user_input):
        """Check if user query is an exit command."""
        exit_words = {"exit", "quit", "bye", "goodbye", "stop", "close", "end"}
        cleaned = user_input.strip().lower()
        return cleaned in exit_words or any(word in cleaned.split() for word in ["exit", "quit", "bye"])

    def keyword_fallback_match(self, user_input):
        """Rule-based keyword match fallback excluding stop words."""
        cleaned_user = self.preprocess_text(user_input, remove_stop=True)
        user_words = set(cleaned_user.split())

        if not user_words:
            return None, 0.0

        best_intent = None
        max_matches = 0
        best_score = 0.0

        for intent in self.intents:
            for pattern in intent.get("patterns", []):
                pattern_words = set(self.preprocess_text(pattern, remove_stop=True).split())
                common = user_words.intersection(pattern_words)
                if len(common) > max_matches:
                    max_matches = len(common)
                    best_intent = intent
                    best_score = float(len(common)) / max(len(pattern_words), 1)

        if best_intent and max_matches > 0:
            return best_intent, min(best_score * 100.0, 75.0)

        return None, 0.0

    def get_suggestions(self, count=3):
        """Return random sample of suggested questions from dataset."""
        suggested = []
        for intent in self.intents:
            if intent["tag"] not in ["greeting", "goodbye", "thanks"]:
                if intent.get("patterns"):
                    suggested.append(random.choice(intent["patterns"]))
        random.shuffle(suggested)
        return suggested[:count]

    def get_response(self, user_input):
        """Process user question and return matched intent, response, confidence, and metadata."""
        if not user_input or not user_input.strip():
            return {
                "response": "Please ask a question so I can assist you!",
                "confidence": 0.0,
                "matched_tag": "empty",
                "category": "General",
                "is_exit": False,
                "suggestions": self.get_suggestions()
            }

        # Check for explicit exit command
        if self.is_exit_query(user_input):
            return {
                "response": "Thank you for visiting the Student Query Portal. Good luck with your studies!",
                "confidence": 100.0,
                "matched_tag": "goodbye",
                "category": "General",
                "is_exit": True,
                "suggestions": []
            }

        processed_input = self.preprocess_text(user_input)
        confidence = 0.0
        matched_intent = None

        # Method 1: TF-IDF & Cosine Similarity
        if SKLEARN_AVAILABLE and self.vectorizer and self.tfidf_matrix is not None:
            user_vector = self.vectorizer.transform([processed_input])
            similarities = cosine_similarity(user_vector, self.tfidf_matrix)[0]

            max_idx = np.argmax(similarities)
            max_sim = similarities[max_idx]
            confidence = float(max_sim) * 100.0

            if confidence >= 25.0:  # Match threshold
                matched_intent = self.pattern_intent_map[max_idx]

        # Method 2: Keyword overlap fallback if TF-IDF yields low confidence
        if not matched_intent or confidence < 25.0:
            fallback_intent, fallback_conf = self.keyword_fallback_match(user_input)
            if fallback_intent and fallback_conf > confidence:
                matched_intent = fallback_intent
                confidence = fallback_conf

        # Construct final response
        if matched_intent and confidence >= 20.0:
            response = random.choice(matched_intent["responses"])
            tag = matched_intent["tag"]
            category = matched_intent.get("category", "General")
            is_exit = (tag == "goodbye")
            return {
                "response": response,
                "confidence": round(confidence, 1),
                "matched_tag": tag,
                "category": category,
                "is_exit": is_exit,
                "suggestions": self.get_suggestions()
            }
        else:
            # Low confidence response
            return {
                "response": "I'm sorry, I couldn't find an exact match for your question. You can ask about course details, fee structures, class timings, eligibility, or contact info.",
                "confidence": round(confidence, 1),
                "matched_tag": "unknown",
                "category": "General",
                "is_exit": False,
                "suggestions": self.get_suggestions()
            }


if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    # Test script locally
    engine = StudentChatbotNLP()
    test_queries = [
        "Hi",
        "What courses are available?",
        "How much are the fees for B.Tech?",
        "What are the library opening hours?",
        "Where is the admission office?",
        "exit"
    ]
    print("--- NLP Engine Test Run ---")
    for q in test_queries:
        res = engine.get_response(q)
        print(f"\nQ: {q}")
        print(f"A: {res['response']} (Confidence: {res['confidence']}%, Category: {res['category']})")

