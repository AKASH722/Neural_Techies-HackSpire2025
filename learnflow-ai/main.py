from fastapi import FastAPI, UploadFile, File, Form
from explanationGenerator import *
import tempfile

app = FastAPI()

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
