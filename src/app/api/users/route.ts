import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes("MongoDB connection")) {
        return NextResponse.json(
          {
            success: false,
            message: "Database connection failed. Please check your internet connection and try again.",
            error: "Database connection error",
          },
          { status: 503 }
        );
      }
      
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          {
            success: false,
            message: "An account with this email already exists.",
            error: "Duplicate email",
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create account. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
