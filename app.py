import os
import sys
from flask import Flask, render_template, request, jsonify
from nlp_engine import StudentChatbotNLP

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__)
chatbot = StudentChatbotNLP(dataset_path="dataset.json")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat_api():
    data = request.get_json(force=True) or {}
    user_query = data.get("query", "").strip()
    
    if not user_query:
        return jsonify({
            "response": "Please type a question!",
            "confidence": 0.0,
            "matched_tag": "empty",
            "category": "General",
            "is_exit": False,
            "suggestions": chatbot.get_suggestions()
        })
        
    result = chatbot.get_response(user_query)
    return jsonify(result)

@app.route("/api/dataset", methods=["GET"])
def dataset_api():
    return jsonify({
        "intents": chatbot.intents,
        "categories": list(set(intent.get("category", "General") for intent in chatbot.intents))
    })

@app.route("/api/categories", methods=["GET"])
def categories_api():
    categories_data = {}
    for intent in chatbot.intents:
        cat = intent.get("category", "General")
        if cat not in categories_data:
            categories_data[cat] = []
        if intent.get("patterns"):
            categories_data[cat].append({
                "tag": intent.get("tag"),
                "question": intent["patterns"][0],
                "response": intent["responses"][0]
            })
    return jsonify(categories_data)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Starting Student Query AI Chatbot Web Server on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
