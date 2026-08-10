import unittest
import sys
import json
import os

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from nlp_engine import StudentChatbotNLP

class TestStudentChatbotNLP(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.chatbot = StudentChatbotNLP(dataset_path="dataset.json")

    def test_greeting(self):
        res = self.chatbot.get_response("Hello")
        self.assertEqual(res["matched_tag"], "greeting")
        self.assertGreaterEqual(res["confidence"], 50.0)

    def test_courses_query(self):
        res = self.chatbot.get_response("What undergraduate courses are offered?")
        self.assertEqual(res["category"], "Courses")
        self.assertIn("Undergraduate", res["response"])

    def test_fees_query(self):
        res = self.chatbot.get_response("What is the tuition fee for B.Tech?")
        self.assertEqual(res["category"], "Fees")
        self.assertIn("semester", res["response"].lower())

    def test_timings_query(self):
        res = self.chatbot.get_response("What are the library hours?")
        self.assertEqual(res["category"], "Timings")
        self.assertIn("Library", res["response"])

    def test_exit_query(self):
        res = self.chatbot.get_response("exit")
        self.assertTrue(res["is_exit"])
        self.assertEqual(res["confidence"], 100.0)

    def test_out_of_domain_query(self):
        res = self.chatbot.get_response("What is quantum string theory astrophysics?")
        self.assertLess(res["confidence"], 25.0)
        self.assertIn("couldn't find an exact match", res["response"].lower())

if __name__ == "__main__":
    unittest.main()
