import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_ADMIN_SECRET =
  process.env.JWT_ADMIN_SECRET || "fallback-admin-secret-key";

export interface UserPayload {
  userId: string;
  email: string;
  role: "user";
}

export interface AdminPayload {
  adminId: string;
  email: string;
  role: "admin";
}

// User JWT functions
export function signUserToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyUserToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Admin JWT functions
export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_ADMIN_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET) as AdminPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}