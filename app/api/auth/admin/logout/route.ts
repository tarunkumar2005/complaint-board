import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Admin logout successful" },
    { status: 200 }
  );

  response.cookies.set("admin-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}