import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function tokenFor(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must contain at least 8 characters." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ message: "Email is already registered." });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });

  res.status(201).json({
    token: tokenFor(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase().trim() });

  if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({
    token: tokenFor(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  });
}

export function me(req, res) {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
}
