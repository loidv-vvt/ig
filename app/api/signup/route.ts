import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { User } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    // Username validation
    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username không hợp lệ" },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("user-management"); // Tên database
    const collection = db.collection("users");

    // Check if email or username already exists
    const existingEmail = await collection.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    const existingUsername = await collection.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username đã được sử dụng" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser: User = {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password, // In production, you should hash this password
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    // Insert user into database
    const result = await collection.insertOne(newUser);

    // Return success response (don't include password in response)
    const { password: _, ...userResponse } = newUser;
    const responseUser = {
      ...userResponse,
      _id: result.insertedId.toString(),
    };

    return NextResponse.json({
      message: "Đăng ký thành công",
      user: responseUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi server" },
      { status: 500 }
    );
  }
}
