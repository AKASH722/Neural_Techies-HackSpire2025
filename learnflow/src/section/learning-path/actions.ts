"use server";

import mlServiceApi from "@/lib/axios";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { getUser } from "@/utils/supabase/helper";

type RoadmapRequest = {
  topic: string;
  skill_level: string;
  learning_style: string;
  module_preference: string;
};

type RoadmapModule = {
  Subtopic: string;
  Time: string;
  "Short Description": string;
  Quiz: {
    Description: string;
  };
};

type RoadmapResponse = {
  "Topic Name": string;
  Description: string;
  Modules: RoadmapModule[];
};

export async function createCourseFromRoadmap(data: RoadmapRequest) {
  try {
    const supabase = await createClient();

    // 1. Call the ML API to generate a roadmap using axios
    const response = await mlServiceApi.post("/generate-roadmap", {
      topic: data.topic,
      skill_level: data.skill_level,
      learning_style: data.learning_style,
      module_preference: data.module_preference,
    });

    const roadmapData: RoadmapResponse = response.data;

    const user_id = (await getUser()).user_id;

    // 2. Insert course into Supabase
    const { data: courseData, error: courseError } = await supabase
      .from("user_courses")
      .insert({
        user_id: user_id,
        title: roadmapData["Topic Name"],
        description: roadmapData.Description,
        preferred_learning_style: data.learning_style,
        preferred_module_size: data.module_preference,
        difficulty: data.skill_level,
        category: data.topic,
        is_published: false,
      })
      .select()
      .single();

    if (courseError) {
      throw new Error(`Failed to create course: ${courseError.message}`);
    }

    // 3. Insert modules for the course
    const courseId = courseData.id;
    const modulePromises = roadmapData.Modules.map((module, index) => {
      return supabase
        .from("user_course_modules")
        .insert({
          course_id: courseId,
          title: module.Subtopic,
          description: module["Short Description"],
          order_index: index,
          duration: module.Time,
          content: {}, // Empty content initially, will be populated later
        })
        .select();
    });

    const moduleResults = await Promise.all(modulePromises);

    // Check for any errors in module creation
    moduleResults.forEach((result, index) => {
      if (result.error) {
        console.error(`Error creating module ${index}:`, result.error);
      }
    });

    // 4. Create empty quizzes for each module
    const moduleIds = moduleResults
      .map((result) => result.data?.[0]?.id)
      .filter(Boolean);
    const quizPromises = moduleIds.map((moduleId, index) => {
      return supabase.from("module_quizzes").insert({
        module_id: moduleId,
        title: `Quiz: ${roadmapData.Modules[index].Subtopic}`,
        description: roadmapData.Modules[index].Quiz.Description,
      });
    });

    await Promise.all(quizPromises);

    return { success: true, courseId, moduleIds };
  } catch (error) {
    console.error("Error in createCourseFromRoadmap:", error);
    // Handle axios specific errors
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
    return { success: false, error: (error as Error).message };
  }
}

type ContentItem = {
  title: string;
  explanation: string;
  codeExample: string | null;
};

type QuizQuestion = {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  explanation: string;
};

type ExpandResponse = {
  learning_content: {
    Details: {
      content: ContentItem[];
      quizzes: QuizQuestion[];
    };
  };
  recommended_video: string;
};

export async function expandModuleContent(moduleId: number) {
  try {
    const supabase = await createClient();

    // 1. Get module data from Supabase
    const { data: moduleData, error: moduleError } = await supabase
      .from("user_course_modules")
      .select("*, user_courses!inner(*)")
      .eq("id", moduleId)
      .single();

    if (moduleError || !moduleData) {
      throw new Error(
        `Failed to fetch module: ${moduleError?.message || "Module not found"}`
      );
    }

    const course = moduleData.user_courses;

    // 2. Call the ML API to expand the module using axios
    const response = await mlServiceApi.post("/expand-roadmap", {
      topic: course.category || "",
      subtopic: moduleData.title,
      time: moduleData.duration || "",
      learning_style: course.preferred_learning_style || "",
      skill_level: course.difficulty || "",
    });
    const expandedData: ExpandResponse = response.data;

    // 3. Update module content in Supabase
    const { error: updateError } = await supabase
      .from("user_course_modules")
      .update({
        content: expandedData.learning_content.Details,
        updated_at: new Date().toISOString(),
      })
      .eq("id", moduleId);

    if (updateError) {
      throw new Error(
        `Failed to update module content: ${updateError.message}`
      );
    }

    // 4. Get the quiz ID for this module
    const { data: quizData, error: quizError } = await supabase
      .from("module_quizzes")
      .select("id")
      .eq("module_id", moduleId)
      .single();

    if (quizError || !quizData) {
      throw new Error(
        `Failed to fetch quiz: ${quizError?.message || "Quiz not found"}`
      );
    }

    const quizId = quizData.id;

    // 5. Update quiz with recommended video
    await supabase
      .from("module_quizzes")
      .update({
        recommended_video_url: expandedData.recommended_video,
        updated_at: new Date().toISOString(),
      })
      .eq("id", quizId);

    // 6. Create quiz questions
    const questionPromises = expandedData.learning_content.Details.quizzes.map(
      (question, index) => {
        return supabase.from("quiz_questions").insert({
          quiz_id: quizId,
          question: question.question,
          explanation: question.explanation,
          option_a: question.options.A,
          option_b: question.options.B,
          option_c: question.options.C,
          option_d: question.options.D,
          correct_answer: question.correct_answer,
          order_index: index,
        });
      }
    );

    await Promise.all(questionPromises);

    return { success: true, moduleId };
  } catch (error) {
    console.error("Error in expandModuleContent:", error);
    // Handle axios specific errors
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
    return { success: false, error: (error as Error).message };
  }
}
