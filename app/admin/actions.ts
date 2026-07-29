"use server";

import { cookies } from "next/headers";

type LoginState = { error?: string; success?: boolean };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password")?.toString() ?? "";
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envPassword) {
    return { error: "ADMIN_PASSWORD non configurata sul server." };
  }

  if (password !== envPassword) {
    return { error: "Password non corretta." };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 ore
  });

  return { success: true };
}
