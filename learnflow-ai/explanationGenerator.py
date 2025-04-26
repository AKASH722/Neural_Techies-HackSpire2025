from youtube_transcript_api import YouTubeTranscriptApi
import google.generativeai as genai
import fitz  # for PDFs
import docx
import pytesseract
from PIL import Image
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# --- Text Extraction Functions ---

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text_from_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_text_with_ocr(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        pix = page.get_pixmap()
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        text += pytesseract.image_to_string(img)
    return text

def extract_text_from_youtube(video_url):
    video_id = video_url.split("v=")[-1].split("&")[0]
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    text = " ".join([item['text'] for item in transcript])
    return text

# --- NLP Functions ---

def simplify_content(content: str) -> str:
    prompt = f"""
You are an expert tutor specializing in simplifying complex topics.

Task:
- Write a **full, detailed, long explanation** of the following content in simple, easy-to-understand language — so that even a beginner can understand it.
- Expand deeply on every concept, add examples, analogies, and real-world explanations where possible.
- Cover all points thoroughly, like a complete set of lecture notes.

Here is the content to simplify:
\"\"\"{content}\"\"\"
"""
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(prompt)

    simplified_text = response.text.strip()
    return simplified_text

def generate_quiz(content: str) -> list:
    prompt = f"""
You are a professional quiz creator.

Task:
- Create a quiz based on the following content.
- Maximum 10 questions, even if the content is very large.
- Cover important concepts from the content.
- Each question must have exactly 4 options (A, B, C, D).
- Specify the correct option.
- Provide a detailed explanation (4-6 sentences) for:
    - Why the correct answer is correct.
    - Why each wrong answer is incorrect.

Formatting:
Return the entire response as a **valid JSON** in this structure:

[
    {{
        "question": "Question text here...",
        "options": {{
            "A": "Option A text",
            "B": "Option B text",
            "C": "Option C text",
            "D": "Option D text"
        }},
        "correct_answer": "B",
        "explanation": {{
            "correct": "Why option B is correct.",
            "wrong": {{
                "A": "Why option A is wrong.",
                "C": "Why option C is wrong.",
                "D": "Why option D is wrong."
            }}
        }}
    }},
    ...
]

Content:
\"\"\"{content}\"\"\"
"""
    model = genai.GenerativeModel('gemini-2.0-flash')  # Faster model for quiz
    response = model.generate_content(prompt)

    try:
        quiz_data = json.loads(response.text)
    except json.JSONDecodeError:
        match = re.search(r'(\[.*\])', response.text, re.DOTALL)
        if match:
            quiz_data = json.loads(match.group(1))
        else:
            raise ValueError("Invalid JSON returned for quiz.")

    # Limit to 10 questions maximum
    quiz_data = quiz_data[:10]

    return quiz_data

def simplify_and_generate_quiz(content: str) -> dict:
    simplified_content = simplify_content(content)
    quiz = generate_quiz(simplified_content)

    return {
        "summary": simplified_content,
        "quiz": quiz
    }
