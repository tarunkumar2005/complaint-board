import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    const userToken = request.cookies.get("user-token")?.value;

    if (!userToken) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const user = verifyUserToken(userToken);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          userId: user.userId,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
