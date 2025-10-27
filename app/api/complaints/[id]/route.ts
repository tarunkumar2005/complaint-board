import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Complaint from "@/models/Complaint";
import { verifyAdminToken } from "@/lib/jwt";
import { sendEmailToUser, sendEmailToAllAdmins } from "@/lib/emailQueue";

// PATCH - Update complaint (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+ requirement)
    const { id } = await params;

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

    const body = await request.json();
    const allowed = ["title", "description", "category", "priority", "status"];
    const update: Record<string, any> = {};

    for (const key of Object.keys(body)) {
      if (allowed.includes(key)) {
        update[key] = body[key];
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    await connectDB();

    const complaint = await Complaint.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    // Send email notifications if status was updated (queued)
    if (update.status) {
      try {
        // Email to user (queued first - highest priority)
        if (complaint.userEmail) {
          const userHtml = `
            <h2>Complaint Status Updated</h2>
            <p><b>Title:</b> ${complaint.title}</p>
            <p><b>New Status:</b> ${update.status}</p>
            <p><b>Updated At:</b> ${new Date().toLocaleString()}</p>
            <p>Thank you for your patience. We will keep you updated on any further progress.</p>
          `;

          await sendEmailToUser(
            complaint.userEmail,
            `Complaint Status Updated: ${complaint.title}`,
            userHtml
          );
        }

        // Email to all admins (queued after user email)
        const adminHtml = `
          <h2>Complaint Status Updated</h2>
          <p><b>Title:</b> ${complaint.title}</p>
          <p><b>New Status:</b> ${update.status}</p>
          <p><b>Updated At:</b> ${new Date().toLocaleString()}</p>
          <p><b>User:</b> ${complaint.userEmail}</p>
        `;

        await sendEmailToAllAdmins(
          `Complaint Status Updated: ${complaint.title}`,
          adminHtml
        );
      } catch (e) {
        console.error("Status update email failed:", e);
      }
    }

    return NextResponse.json(
      { message: "Complaint updated successfully", complaint },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Update complaint error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete complaint (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+ requirement)
    const { id } = await params;

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

    const deleted = await Complaint.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Complaint deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Delete complaint error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get single complaint (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+ requirement)
    const { id } = await params;

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

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ complaint }, { status: 200 });
  } catch (err: any) {
    console.error("Get complaint error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}