import { createClient } from "@/utils/supabase/server";
import { getUserUUID } from "@/utils/supabase/helper";
import { notFound } from "next/navigation";
import CourseRoadmapView from "@/section/learning-path/view/course-roadmap-view";

export default async function CourseRoadmapPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = await createClient();
  const userUuid = await getUserUUID();

  // Use a single query with joins to get all the data we need
  const { data: courseData, error: courseError } = await supabase
    .from("user_courses")
    .select(
      `
      *,
      users!inner(user_id, user_uuid),
      user_course_modules(
        id,
        title,
        subtitle,
        description,
        order_index,
        duration,
        content,
        created_at,
        updated_at,
        module_quizzes(
          id,
          title,
          description,
          recommended_video_url
        )
      )
    `
    )
    .eq("id", parseInt(id, 10))
    .eq("users.user_uuid", userUuid)
    .order("order_index", {
      referencedTable: "user_course_modules",
      ascending: true,
    })
    .single();

  if (courseError || !courseData) {
    console.error("Error fetching course data:", courseError);
    notFound();
  }

  // Process the data for the client component
  const processedCourse = {
    id: courseData.id,
    topicName: courseData.title,
    description: courseData.description!,
    difficulty: courseData.difficulty!,
    category: courseData.category!,
    imageUrl: courseData.image_url!,
    modules: courseData.user_course_modules.map((module) => ({
      id: module.id,
      subtopic: module.title,
      time: module.duration || "1 hour",
      shortDescription: module.description || module.subtitle || "",
      order: module.order_index,
      content: module.content,
    })),
  };

  return <CourseRoadmapView roadmapData={processedCourse} />;
}
