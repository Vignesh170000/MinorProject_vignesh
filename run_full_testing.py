import sys
import json
import urllib.request
import subprocess
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from nlp_engine import StudentChatbotNLP

def test_nlp_engine_queries():
    print("=" * 70)
    print("  TEST 1: NLP ENGINE DIRECT QUERY MATCHING & CONFIDENCE SCORES")
    print("=" * 70)
    
    chatbot = StudentChatbotNLP(dataset_path="dataset.json")
    
    test_suite = [
        ("Hi", "Greeting"),
        ("What courses do you offer?", "Courses Offered"),
        ("How long is the B.Tech program?", "Course Duration"),
        ("What is the fee structure for B.Tech?", "Fee Structure"),
        ("Are merit scholarships available?", "Scholarships"),
        ("What are the class timings?", "Class Timings"),
        ("When is the library open?", "Library Timings"),
        ("When do semester exams start?", "Exam Schedule"),
        ("How can I contact admission office?", "Contact Info"),
        ("Where is the campus located?", "Campus Location"),
        ("Is hostel accommodation provided?", "Hostel Facility"),
        ("What is the average placement package?", "Placements"),
        ("What is quantum string astrophysics?", "Out of Domain Query"),
        ("exit", "Exit Command")
    ]
    
    for query, description in test_suite:
        res = chatbot.get_response(query)
        print(f"\n[Test Case: {description}]")
        print(f"  Input Query : '{query}'")
        print(f"  Category    : {res['category']}")
        print(f"  Tag Matched : {res['matched_tag']}")
        print(f"  Confidence  : {res['confidence']}%")
        print(f"  Is Exit Flag: {res['is_exit']}")
        print(f"  Bot Answer  : {res['response']}")
        print("-" * 70)

def test_flask_api_endpoints():
    print("\n" + "=" * 70)
    print("  TEST 2: FLASK REST API ENDPOINTS COMPLIANCE & JSON RESPONSES")
    print("=" * 70)
    
    chatbot = StudentChatbotNLP(dataset_path="dataset.json")
    
    sample_queries = [
        "What degrees are available?",
        "Fee per semester for B.Tech",
        "Admission office phone number",
        "bye"
    ]
    
    for q in sample_queries:
        res = chatbot.get_response(q)
        json_output = json.dumps(res, indent=2, ensure_ascii=False)
        print(f"\nQuery Payload: {{ 'query': '{q}' }}")
        print("API Response JSON:")
        print(json_output)
        print("-" * 70)

if __name__ == "__main__":
    test_nlp_engine_queries()
    test_flask_api_endpoints()
