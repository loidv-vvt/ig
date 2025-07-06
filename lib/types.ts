import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface UserResponse {
  _id?: string;
  email: string;
  username: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}
