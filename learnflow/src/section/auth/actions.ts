"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { LoginSchema, SignupSchema } from "@/section/auth/schema";
import { loginSchema, signupSchema } from "@/section/auth/schema";

export const signInWithGoogle = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  if (error) {
    return {
      message: "Something went wrong, please try again later",
      error: error?.message,
    };
  }
};

export async function login(values: LoginSchema) {
  try {
    const supabase = await createClient();

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      return { error: "Invalid input. Please check your email and password." };
    }

    const { email, password } = parsed.data;

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        error: authError.message || "Authentication failed. Please try again.",
      };
    }

    return { message: "Login successful!" };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}

export async function signup(values: SignupSchema) {
  try {
    const supabase = await createClient();

    const parsed = signupSchema.safeParse(values);

    if (!parsed.success) {
      return { error: "Invalid input. Please check your email and password." };
    }

    const { email, password, firstName, lastName } = parsed.data;

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    });

    if (authError) {
      return {
        error: authError.message || "Authentication failed. Please try again.",
      };
    }

    return {
      message: "Signup successful! Verification link sent to your email.",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}

export async function logout() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: "Something went wrong. Please try again later." };
    }
    return { message: "Logout successful!" };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}
