from youtube_transcript_api import YouTubeTranscriptApi
import google.generativeai as genai
import fitz  # for PDFs
import docx
import pytesseract
from PIL import Image
import os
from dotenv import load_dotenv
import json

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
    # Extract video ID
    video_id = video_url.split("v=")[-1].split("&")[0]
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    text = " ".join([item['text'] for item in transcript])
    return text

# --- NLP Functions ---


def simplify_and_generate_quiz(content: str) -> dict:
    prompt = f"""
You are an expert tutor specializing in simplifying complex topics and creating educational quizzes.

Your task:
1. Write a **full, detailed, long explanation** of the content in simple, easy-to-understand language — so that even a beginner can understand it.
    - Expand deeply on every concept mentioned.
    - Include examples, analogies, and real-world explanations where possible.
    - Cover every point thoroughly, like a complete set of lecture notes — not a short summary.
    - Match the depth and size of the original content: if the content is long, the explanation must also be long.
2. After simplifying, create a quiz based on the content:
    - The number of questions should depend on the length and complexity of the content.
    - Ensure good coverage of important concepts from the content.
3. For each quiz question:
    - Write a clear and meaningful question.
    - Provide exactly 4 options (A, B, C, D).
    - Specify the correct option.
    - Write a **detailed explanation** (2-3 sentences) for:
        - Why the correct answer is right.

Formatting rules:
- Return the entire response as a **valid JSON object** in the following format:

{{
    "summary": "Simplified explanation here...",
    "quiz": [
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
                "correct": "Long explanation why Option B is correct."
            }}
        }},
        ...
    ]
}}

Important instructions:
- Do not add any extra commentary, markdown (like *, -, #), or additional text outside the JSON.
- Make sure there are no extra spaces, line breaks, or formatting issues.
- Ensure the JSON is properly structured and parsable.

Here is the content to simplify and generate the quiz for:
\"\"\"{content}\"\"\"
"""

    model = genai.GenerativeModel('gemini-2.0-flash')  # or 'gemini-2.0-flash' for faster but lighter output
    response = model.generate_content(prompt)

    # Load safely
    import json
    import re
    try:
        output = json.loads(response.text)
    except json.JSONDecodeError:
        match = re.search(r'({.*})', response.text, re.DOTALL)
        if match:
            output = json.loads(match.group(1))
        else:
            raise ValueError("Invalid JSON returned by model.")

    return output


