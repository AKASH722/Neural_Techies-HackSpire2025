import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { getUserUUID } from "@/utils/supabase/helper";
import { expandModuleContent } from "@/section/learning-path/actions";
import LearningModuleView from "@/section/learning-path/view/learning-module-view";

export default async function ModulePage({
  params,
}: {
  params: { module_id: string };
}) {
  const { module_id } = params;
  const moduleId = parseInt(module_id, 10);
  const supabase = await createClient();
  const userUuid = await getUserUUID();

  // Fetch the module with related data
  const { data: moduleData, error: moduleError } = await supabase
    .from("user_course_modules")
    .select(
      `
      *,
      user_courses!inner(*, users!inner(user_id, user_uuid)),
      module_quizzes(
        id,
        title,
        description,
        recommended_video_url,
        quiz_questions(
          id,
          question,
          explanation,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          order_index
        )
      )
    `
    )
    .eq("id", moduleId)
    .eq("user_courses.users.user_uuid", userUuid)
    .single();

  if (moduleError || !moduleData) {
    console.error("Error fetching module data:", moduleError);
    notFound();
  }

  // Check if content needs to be generated
  if (!moduleData.content || Object.keys(moduleData.content).length === 0) {
    console.log("Module content empty, generating...");

    try {
      const { success, error } = await expandModuleContent(moduleId);

      if (!success) {
        console.error("Failed to generate module content:", error);
      } else {
        // Fetch the updated module data
        const { data: updatedModule, error: updateError } = await supabase
          .from("user_course_modules")
          .select(
            `
            *,
            user_courses!inner(*),
            module_quizzes(
              id,
              title,
              description,
              recommended_video_url,
              quiz_questions(
                id,
                question,
                explanation,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                order_index
              )
            )
          `
          )
          .eq("id", moduleId)
          .single();

        if (!updateError && updatedModule) {
          moduleData.content = updatedModule.content;
          moduleData.module_quizzes = updatedModule.module_quizzes;
        }
      }
    } catch (error) {
      console.error("Error generating module content:", error);
    }
  }

  // Get all modules from the course for navigation
  const { data: courseModules, error: modulesError } = await supabase
    .from("user_course_modules")
    .select("id, title, order_index, duration")
    .eq("course_id", moduleData.course_id)
    .order("order_index");

  if (modulesError) {
    console.error("Error fetching course modules:", modulesError);
  }

  // Process quiz data
  const quizQuestions = moduleData.module_quizzes?.[0]?.quiz_questions || [];

  // Format the data for the client component
  const processedModule = {
    id: moduleData.id,
    title: moduleData.title,
    description: moduleData.description || "",
    courseId: moduleData.course_id,
    courseName: moduleData.user_courses.title,
    moduleIndex: moduleData.order_index,
    sections: (moduleData.content?.sections || []).map((section) => ({
      title: section.title,
      content: section.content,
      codeExample: section.code_example,
      explanation: section.explanation,
    })),
    video: moduleData.content?.video || {
      title: `Introduction to ${moduleData.title}`,
      url: moduleData.module_quizzes?.[0]?.recommended_video_url || "#",
      duration: "15:00",
      thumbnail: "/api/placeholder/640/360",
    },
    quiz: quizQuestions
      .sort((a, b) => a.order_index - b.order_index)
      .map((q) => ({
        question: q.question,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correctAnswer: ["A", "B", "C", "D"].indexOf(q.correct_answer),
        explanation: q.explanation,
      })),
  };

  const modules = (courseModules || []).map((module) => ({
    id: module.id,
    subtopic: module.title,
    time: module.duration || "1 hour",
    shortDescription: "",
    isActive: module.id === moduleId,
  }));

  return <LearningModuleView module={processedModule} allModules={modules} />;
}
