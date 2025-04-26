from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
from typing import Dict, Any, List
import json
from dotenv import load_dotenv
import aiohttp

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))



# Define input schema
class RoadmapRequest(BaseModel):
    topic: str
    skill_level: str
    learning_style: str
    module_preference: str

# Define output schema 
class Quiz(BaseModel):
    description: str

class Module(BaseModel):
    subtopic: str
    time: str
    short_description: str
    quiz: Quiz

class RoadmapResponse(BaseModel):
    topic_name: str
    description: str
    modules: list[Module]

# Request Body Model
class ExpandRequest(BaseModel):
    topic: str
    subtopic: str
    time: str
    learning_style: str
    skill_level: str


# Function to generate roadmap using Gemini
async def generate_roadmap(data: RoadmapRequest) -> Dict[str, Any]:
    prompt = f"""
You are an expert learning roadmap creator.

Generate a detailed learning roadmap in JSON format for:

Topic: {data.topic}
Skill Level: {data.skill_level}
Learning Style: {data.learning_style}
Module Preference: {data.module_preference}

Roadmap JSON structure should be like:
{{
  "Topic Name": "...",
  "Description": "...",
  "Modules": [
    {{
      "Subtopic": "...",
      "Time": "...",
      "Short Description": "...",
      "Quiz": {{
        "Description": "..."
      }}
    }},
    {{
      "Subtopic": "...",
      "Time": "...",
      "Short Description": "...",
      "Quiz": {{
        "Description": "..."
      }}
    }}
  ]
}}

Make sure every subtopic has a quiz. 
Only return valid JSON, nothing else.
"""
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content(prompt)

    try:
        # Sometimes Gemini adds code formatting, so we clean it if needed
        content = response.text.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()

        # Convert string JSON to Python dict
        import json
        roadmap = json.loads(content)
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing Gemini response: {str(e)}")





async def expand_roadmap(topic: str, subtopic: str, time: str, learning_style: str, skill_level:str) -> Dict[str, Any]:
    model = genai.GenerativeModel('gemini-2.0-flash')

    detail_prompt = f"""
You are an expert educational content creator.

Expand and explain the concept in detail based on the following:
- Topic: {topic}
- Subtopic (Chapter): {subtopic}
- Expected Learning Time: {time}

Learning Style: {learning_style}

Instructions:
- Tailor the explanation to match the learning style (Visual, Auditory, Kinesthetic, or Reading/Writing).
- Adjust the depth and length of the content to fit within the expected learning time ({time}).
- Include practical examples, visuals (described textually), analogies, or code examples as appropriate to the learning style.

Return the output strictly in JSON format without any extra commentary or markdown.

Format:

{{
    "content": [
        {{
            "title": "Title of the concept",
            "explanation": "Detailed explanation adapted to the learning style",
            "codeExample": "<pre>Code example here</pre>" (optional, only if applicable)
        }},
        ...
    ],
    "quizzes": [
        {{
            "question": "Question text here...",
            "options": {{
                "A": "Option A text",
                "B": "Option B text",
                "C": "Option C text",
                "D": "Option D text"
            }},
            "correct_answer": "B",
            "explanation": "Why option B is correct."
        }},
        ...
        (Total 5 quizzes)
    ]
}}

Important:
- Quizzes must be strictly based on the generated content above. Do not include unrelated or general questions.
- Ensure the JSON is valid and parsable.
- Return the output strictly in minified JSON format (one line, no newlines inside JSON fields). Escape all backslashes properly. No markdown, no commentary.

"""

    try:
        response = await model.generate_content_async(
        detail_prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=1,
            top_p=0.95,
            top_k=40,
            max_output_tokens=8192,
        )
    )


        content = response.text.strip()
        
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
        
        details = json.loads(content)
        return {"Details": details}
    except Exception as e:
        return {"Details": {"error": str(e)}}


# Function 2: Generate YouTube Search Terms
async def generate_search_terms(topic: str, subtopic: str, time: str, learning_style: str, skill_level:str) -> List[str]:
    model = genai.GenerativeModel('gemini-2.0-flash')

    prompt = f"""
    Based on the topic "{topic}" and subtopic "{subtopic}" with a learning goal of "{time}", preferred learning style "{learning_style}", 
    and the learner's skill level "{skill_level}",
    generate ONE very specific, focused YouTube search term that would help the learner best understand the subtopic.

    The search term should be:
    - Clear and concise
    - Appropriate for the learner's skill level
    - Likely to return high-quality educational tutorials

    Return only a JSON string like:
    ["search term here"]
    """


    try:
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.9,
                top_k=40,
                max_output_tokens=1024,
            )
        )
        search_terms_raw = response.text.strip()

        if search_terms_raw.startswith("```json"):
            search_terms_raw = search_terms_raw[7:-3].strip()
        elif search_terms_raw.startswith("```"):
            search_terms_raw = search_terms_raw[3:-3].strip()

        search_terms = json.loads(search_terms_raw)
        return search_terms
    except Exception as e:
        return [f"Error generating search terms: {str(e)}"]

# Function 3: Fetch YouTube Video URL
async def fetch_youtube_video(search_query: str) -> str:
    api_key = os.getenv("YOUTUBE_API_KEY")
    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "key": api_key,
        "part": "snippet",
        "q": search_query,
        "type": "video",
        "maxResults": 1,
        "relevanceLanguage": "en",
        "videoEmbeddable": "true",
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                if data["items"]:
                    video_id = data["items"][0]["id"]["videoId"]
                    return f"https://www.youtube.com/watch?v={video_id}"
                else:
                    return "No video found"
            else:
                return f"Error fetching YouTube video: {resp.status}"

# Function 4: Master function to combine all
async def create_learning_path(topic: str, subtopic: str, time: str, learning_style: str, skill_level:str) -> Dict[str, Any]:
    content_details = await expand_roadmap(topic, subtopic, time, learning_style, skill_level)
    search_terms = await generate_search_terms(topic, subtopic, time, learning_style,skill_level)

    if isinstance(search_terms, list) and search_terms:
        # Use the first search term
        youtube_url = await fetch_youtube_video(search_terms[0])
    else:
        youtube_url = "No search terms available"

    return {
        "learning_content": content_details,
        "recommended_video": youtube_url
    }




