"use server";

import mlServiceApi from "@/lib/axios";
import { revalidatePath } from "next/cache";
import { saveSummaryAndQuestions } from "@/section/simplifier/db-helper";

export async function processText(title: string, text: string) {
  try {
    const formData = new URLSearchParams();
    formData.append("text", text);

    const { data } = await mlServiceApi.post(
      "/process_text/",
      formData.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const savedData = await saveSummaryAndQuestions(
      data,
      title || "Untitled Text Summary",
      `${text.length} characters of text`,
      "text",
      undefined,
      text
    );

    revalidatePath("/simplifier");
    return savedData;
  } catch (error) {
    console.error("Error processing text:", error);
    throw new Error("Failed to process and save text");
  }
}

export async function processDocument(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const { data } = await mlServiceApi.post("/process_file/", uploadFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const savedData = await saveSummaryAndQuestions(
      data,
      file.name,
      `Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      "document"
    );

    revalidatePath("/simplifier");
    return savedData;
  } catch (error) {
    console.error("Error processing document:", error);
    throw new Error("Failed to process and save document");
  }
}

export async function processYouTubeVideo(url: string) {
  try {
    const formData = new URLSearchParams();
    formData.append("video_link", url);

    const { data } = await mlServiceApi.post(
      "/process_video/",
      formData.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const savedData = await saveSummaryAndQuestions(
      data,
      data.title || "YouTube Video Summary",
      `YouTube: ${url}`,
      "youtube",
      url
    );

    revalidatePath("/simplifier");
    return savedData;
  } catch (error) {
    console.error("Error processing YouTube video:", error);
    throw new Error("Failed to process and save YouTube video");
  }
}
