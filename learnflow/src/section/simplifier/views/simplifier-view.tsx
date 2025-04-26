import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import AddNewCard from "@/section/simplifier/add-new-card";
import SimplifierCard from "@/section/simplifier/simplifier-card";
import { getUserUUID } from "@/utils/supabase/helper";

export async function SimplifierView() {
  const supabase = await createClient();

  const userUuid = await getUserUUID();

  const { data: summaries, error } = await supabase
    .from("summaries")
    .select("*, users!inner()")
    .eq("users.user_uuid", userUuid)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching summaries:", error);
  }

  return (
    <Suspense fallback={<div>Loading summaries...</div>}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AddNewCard />
        {summaries?.map((summary) => (
          <SimplifierCard
            key={summary.id}
            id={summary.id}
            title={summary.title!}
            content={summary.summary.substring(0, 150) + "..."}
            createdAt={new Date(summary.created_at!)}
            type={summary.type as "text" | "youtube" | "document"}
          />
        ))}
      </div>
    </Suspense>
  );
}
