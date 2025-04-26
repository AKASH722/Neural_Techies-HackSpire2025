from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from explanationGenerator import *
import tempfile
from typing import Dict, Any
from adaptiveLearning import *


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get('FRONTEND_URL')],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process_text/")
async def process_text(text: str = Form(...)):
    if not text.strip():
        return {"error": "No text provided."}

    return simplify_and_generate_quiz(text)


@app.post("/process_file/")
async def process_file(file: UploadFile = File(...)):
    extracted_text = ""

    filename = file.filename.lower()
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    temp_file.write(await file.read())
    temp_file.close()

    if filename.endswith('.pdf'):
        extracted_text = extract_text_from_pdf(temp_file.name)
        if len(extracted_text.strip()) < 100:
            extracted_text = extract_text_with_ocr(temp_file.name)
    elif filename.endswith('.docx'):
        extracted_text = extract_text_from_docx(temp_file.name)
    elif filename.endswith('.txt'):
        extracted_text = extract_text_from_txt(temp_file.name)
    else:
        return {"error": "Unsupported file type"}

    if not extracted_text.strip():
        return {"error": "No meaningful content extracted."}

    return simplify_and_generate_quiz(extracted_text)


@app.post("/process_video/")
async def process_video(video_link: str = Form(...)):
    if not video_link.strip():
        return {"error": "No video link provided."}

    extracted_text = extract_text_from_youtube(video_link)

    if not extracted_text.strip():
        return {"error": "No meaningful content extracted."}

    return simplify_and_generate_quiz(extracted_text)

# Create the POST API
@app.post("/generate-roadmap", response_model=Dict[str, Any])
async def create_roadmap(request: RoadmapRequest):
    roadmap = await generate_roadmap(request)
    return roadmap

@app.post("/expand-roadmap")
async def expand_roadmap_api(request: ExpandRequest):
    result = await create_learning_path(
        topic=request.topic,
        subtopic=request.subtopic,
        time=request.time,
        learning_style=request.learning_style,
        skill_level=request.skill_level
    )
    return result

# @app.post("/expand_roadmap")
# async def expand_given_roadmap(roadmap: Dict[str, Any]):
#     topic = roadmap.get("Topic Name", "Unknown Topic")  # Default if missing
#     expanded_roadmap = await expand_roadmap(roadmap, topic)
#     return expanded_roadmap

# @app.post("/generate_quiz")
# async def api_generate_quiz(roadmap: Dict[str, Any]):
#     topic = roadmap.get("Topic Name", "Unknown Topic")
#     expanded_with_quizzes = await generate_quizzes(roadmap, topic)
#     return expanded_with_quizzes