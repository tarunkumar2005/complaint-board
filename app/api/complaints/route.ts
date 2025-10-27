import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Complaint from "@/models/Complaint";
import { verifyUserToken, verifyAdminToken } from "@/lib/jwt";
import { sendEmailToAllAdmins } from "@/lib/emailQueue";

// POST - Create new complaint (User only)
export async function POST(request: NextRequest) {
  try {
    // Verify user token
    const userToken = request.cookies.get("user-token")?.value;
    if (!userToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = verifyUserToken(userToken);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, priority } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const complaint = await Complaint.create({
      title,
      description,
      category: category || "General",
      priority: priority || "Medium",
      userId: user.userId,
      userEmail: user.email,
    });

    // Send email notification to all admins (queued)
    try {
      const html = `
        <h2>New Complaint Submitted</h2>
        <p><b>Title:</b> ${title}</p>
        <p><b>Category:</b> ${category || "General"}</p>
        <p><b>Priority:</b> ${priority || "Medium"}</p>
        <p><b>Description:</b> ${description}</p>
        <p><b>Submitted by:</b> ${user.email}</p>
        <p><b>Date:</b> ${new Date().toLocaleString()}</p>
      `;

      // Queue emails to all admins (sent one by one with delay)
      await sendEmailToAllAdmins(`New Complaint: ${title}`, html);
    } catch (e) {
      console.error("Admin notification failed:", e);
    }

    return NextResponse.json(
      { message: "Complaint submitted successfully", complaint },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Create complaint error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Fetch all complaints (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const adminToken = request.cookies.get("admin-token")?.value;
    if (!adminToken) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    const admin = verifyAdminToken(adminToken);
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid admin token" },
        { status: 401 }
      );
    }

    await connectDB();

    const complaints = await Complaint.find().sort({ createdAt: -1 });

    return NextResponse.json({ complaints }, { status: 200 });
  } catch (err: any) {
    console.error("Fetch complaints error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}