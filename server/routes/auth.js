import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import { auth, signToken } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/signup — hash the password, insert the user, return a token.
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password are required" });
    }

    // Reject duplicate email up front for a clear 400.
    const [[existing]] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash]
    );

    const user = { id: result.insertId, name, email };
    res.status(201).json({ token: signToken(user.id), user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login — check the password, then sign a JWT.
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const [[user]] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      token: signToken(user.id),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me — return the current user (protected).
router.get("/me", auth, async (req, res, next) => {
  try {
    const [[user]] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me/reviews — reviews written by the current user, with the
// apartment name joined in (protected). Used by the Profile page.
router.get("/me/reviews", auth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id,
              r.apt_id     AS aptId,
              a.name       AS aptName,
              r.rating,
              r.body,
              r.image_url  AS imageUrl,
              r.created_at AS date,
              r.author,
              r.user_email AS userEmail
         FROM reviews r
         JOIN apartments a ON a.id = r.apt_id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC, r.id DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
