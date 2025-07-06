import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

interface SignupData {
  email: string;
  username: string;
  password: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export async function POST(request: NextRequest) {
  try {
    console.log(request);
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

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, "users.json");

    // Read existing users or create empty array
    let users: SignupData[] = [];
    try {
      if (existsSync(filePath)) {
        const fileContent = await readFile(filePath, "utf-8");
        users = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error("Error reading users file:", error);
      users = [];
    }

    // Check if email or username already exists
    const existingEmail = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
    const existingUsername = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );

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
    const newUser: SignupData = {
      email,
      username,
      password, // In production, you should hash this password
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    // Add to users array
    users.push(newUser);

    // Save to file
    await writeFile(filePath, JSON.stringify(users, null, 2));

    // Return success response (don't include password in response)
    const { password: _, ...userResponse } = newUser;

    return NextResponse.json({
      message: "Đăng ký thành công",
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi server" },
      { status: 500 }
    );
  }
}
