import sys
import os
import time

# Ensure UTF-8 output on Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from nlp_engine import StudentChatbotNLP

def print_banner():
    print("=" * 65)
    print("        🎓 STUDENT QUERY AI CHATBOT (Console Version) 🎓        ")
    print("=" * 65)
    print("Ask me anything about:")
    print("  • Courses Offered & Duration       • Tuition Fees & Scholarships")
    print("  • Class & Library Timings          • Admission Criteria & Contact")
    print("  • Hostel Facilities & Placements   • Exam Schedules")
    print("-" * 65)
    print("Type 'help' to see sample questions, or 'exit' / 'quit' to stop.")
    print("=" * 65 + "\n")

def simulate_typing(text, speed=0.01):
    """Simulate realistic typing effect in console."""
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(speed)
    print()

def main():
    print_banner()
    chatbot = StudentChatbotNLP()

    print("🤖 Chatbot: Hello! I am your AI Student Assistant. How can I help you today?\n")

    while True:
        try:
            user_input = input("👤 You: ").strip()

            if not user_input:
                continue

            if user_input.lower() == "help":
                print("\n💡 Sample Questions You Can Ask:")
                suggestions = chatbot.get_suggestions(count=5)
                for i, s in enumerate(suggestions, 1):
                    print(f"   {i}. {s}")
                print()
                continue

            # Process query through NLP engine
            result = chatbot.get_response(user_input)

            # Display response metadata and answer
            category = result.get("category", "General")
            confidence = result.get("confidence", 0.0)
            response = result.get("response", "")
            is_exit = result.get("is_exit", False)

            print(f"\n🏷️  [Category: {category} | Confidence: {confidence}%]")
            sys.stdout.write("🤖 Chatbot: ")
            simulate_typing(response)

            # Display suggested related queries if available
            suggestions = result.get("suggestions", [])
            if suggestions and not is_exit and confidence < 50.0:
                print("\n👉 Did you mean one of these?")
                for sug in suggestions[:2]:
                    print(f"   - {sug}")

            print("-" * 65 + "\n")

            if is_exit:
                print("👋 Session ended. Goodbye!")
                break

        except (KeyboardInterrupt, EOFError):
            print("\n\n👋 Session interrupted. Goodbye!")
            break

if __name__ == "__main__":
    main()
