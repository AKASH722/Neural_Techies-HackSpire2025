import { createClient } from "@/utils/supabase/server";
import { getUserUUID } from "@/utils/supabase/helper";
import AllLearningPathView from "@/section/learning-path/view/all-learning-path-view";

export default async function Page() {
  const supabase = await createClient();
  const userUuid = await getUserUUID();

  const { data: userCourses, error } = await supabase
    .from("user_courses")
    .select("*, users!inner(), user_course_modules(id)")
    .eq("users.user_uuid", userUuid);

  const processedCourses =
    userCourses?.map((course) => ({
      id: course.id,
      title: course.title,
      type: course.category || "Custom",
      difficulty: course.difficulty || "Beginner",
      chapters: course.user_course_modules.length || 0,
      imageUrl: course.image_url,
      description: course.description,
    })) || [];

  if (error) {
    console.error("Error fetching courses:", error);
  }

  return <AllLearningPathView userCourses={processedCourses} />;
}
