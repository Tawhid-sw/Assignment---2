import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db";
import type { signupProps, loginProps } from "./auth.interface";
import config from "../../config";

const signupUser = async (payload: signupProps) => {
  const { name, email, password, role } = payload;

  const allowedRoles = ["contributor", "maintainer"];
  const userRole = role || "contributor";

  if (!allowedRoles.includes(userRole)) {
    throw new Error("Role must be contributor or maintainer.");
  }

  // if email already used
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rows.length > 0) {
    throw new Error("user already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, userRole],
  );

  return result.rows[0];
};

const loginUser = async (payload: loginProps) => {
  const { email, password } = payload;

  const result = await pool.query(
    "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = $1",
    [email],
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password.");
  }

  const user = result.rows[0];

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const tokenPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(tokenPayload, config.jwt.secret as string, {
    expiresIn: "1d",
  });

  // password not sending
  const { password: _pw, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

export const authService = {
  signupUser,
  loginUser,
};
