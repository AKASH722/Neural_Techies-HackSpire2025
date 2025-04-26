import { createClient } from "@/utils/supabase/server";

export const getUser = async () => {
  const userId = await getUserUUID();

  const supabaseAdmin = await createClient();

  const { data: userRecord, error: userFetchError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("user_uuid", userId)
    .single();

  if (userFetchError || !userRecord) {
    console.error("Error fetching user_id:", userFetchError);
    throw new Error("Failed to fetch user_id from users table");
  }

  return userRecord;
};

export const getUserUUID = async () => {
  const supabase = await createClient(false);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not found:", userError);
    throw new Error("Failed to fetch user details");
  }

  return user.id;
};
