import os
import sys
from flask import Flask, render_template, request, jsonify, send_from_directory, send_file
from nlp_engine import StudentChatbotNLP

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__, static_folder="static", template_folder="templates")
chatbot = StudentChatbotNLP(dataset_path="dataset.json")

@app.route("/")
def index():
    # Serve index.html from root if exists, or from templates
    if os.path.exists("index.html"):
        return send_file("index.html")
    return render_template("index.html")

@app.route("/presentation")
def presentation():
    if os.path.exists("presentation.html"):
        return send_file("presentation.html")
    return "Presentation file not found", 404

@app.route("/dataset.json")
def dataset_json():
    if os.path.exists("dataset.json"):
        return send_file("dataset.json")
    return jsonify({"error": "dataset.json not found"}), 404

@app.route("/report")
def project_report():
    if os.path.exists("PROJECT_REPORT.md"):
        with open("PROJECT_REPORT.md", "r", encoding="utf-8") as f:
            content = f.read()
        return f"<html><body style='font-family:sans-serif; padding:40px; background:#0b0f19; color:#f8fafc;'><pre style='white-space:pre-wrap;'>{content}</pre></body></html>"
    return "Report not found", 404

@app.route("/viva")
def viva_guide():
    if os.path.exists("VIVA_AND_PRESENTATION_GUIDE.md"):
        with open("VIVA_AND_PRESENTATION_GUIDE.md", "r", encoding="utf-8") as f:
            content = f.read()
        return f"<html><body style='font-family:sans-serif; padding:40px; background:#0b0f19; color:#f8fafc;'><pre style='white-space:pre-wrap;'>{content}</pre></body></html>"
    return "Viva guide not found", 404

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

@app.route("/<path:filename>")
def serve_static_fallback(filename):
    if os.path.exists(filename):
        return send_file(filename)
    return "File not found", 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Starting Student Query AI Chatbot Web Server on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)
