// app/actions/chat.ts
"use server";

import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure to set GEMINI_API_KEY in your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function sendChatMessage(formData: {
  user_id: string;
  user_message: string;
}) {
  const { user_id, user_message } = formData;

  if (!user_id || !user_message) {
    throw new Error("Missing user_id or user_message");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Start a chat (we can later make it store conversation history too)
    const chatSession = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `
You are a helpful, friendly, and patient virtual study buddy.
Always answer the user's questions clearly, step-by-step, and use simple language wherever possible.
If the question is complex, break it down into easy-to-understand parts.
Encourage the user to ask follow-up questions if needed.
Keep the tone supportive, motivating, and never overly formal.
Now, based on the following message, provide the best assistance:
User: ${user_message}
`;

    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return { study_buddy_reply: text };
  } catch (error) {
    console.error("Error generating study buddy reply:", error);
    throw new Error("Failed to generate response");
  }
}

// You may need to install this package

// Configure Google TTS client
const ttsClient = new TextToSpeechClient({
  keyFilename: path.join(
    process.cwd(),
    "config/trim-bot-458123-i2-5843da84273c.json"
  ),
});

export async function sendVoiceMessage(formData: { user_message: string }) {
  const { user_message } = formData;
  if (!user_message) {
    throw new Error("Missing user_message");
  }

  try {
    // Generate AI response
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const chatSession = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `
You are a helpful, friendly, and patient virtual study buddy.
Answer the user's question clearly and motivating.
User: ${user_message}
`;
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // Synthesize the response text using Google TTS
    const ttsRequest = {
      input: { text },
      voice: {
        languageCode: "en-US",
        ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
      },
      audioConfig: {
        audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
      },
    };

    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);

    // Generate a unique filename for this audio
    const fileName = `voice-response-${uuidv4()}.mp3`;
    const publicDir = path.join(process.cwd(), "public", "audio");
    const filePath = path.join(publicDir, fileName);

    // Ensure directory exists
    try {
      await fs.mkdir(publicDir, { recursive: true });
    } catch (err) {
      console.log("Directory exists or couldn't be created");
    }

    // Properly handle the audio content with correct typing
    if (ttsResponse.audioContent) {
      // Convert to Buffer if it's not already
      const audioBuffer = Buffer.from(ttsResponse.audioContent);
      // Save audio file to public directory
      await fs.writeFile(filePath, audioBuffer);
      // Return the text response and the URL to the audio file
      return {
        text: text,
        audioUrl: `/audio/${fileName}`,
      };
    } else {
      throw new Error("No audio content generated");
    }
  } catch (error) {
    console.error("Voice chat error:", error);
    throw new Error(
      `Failed to generate voice response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
