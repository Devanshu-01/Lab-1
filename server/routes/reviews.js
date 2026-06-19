import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = Router();

const COMMENT_COLUMNS = `
  c.id,
  c.review_id  AS reviewId,
  c.author,
  c.body,
  c.created_at AS createdAt
`;

// DELETE /api/reviews/:id — delete a review (protected; author only).
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const [[review]] = await pool.query(
      "SELECT id, user_id FROM reviews WHERE id = ?",
      [req.params.id]
    );
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own reviews" });
    }

    await pool.query("DELETE FROM reviews WHERE id = ?", [req.params.id]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// GET /api/reviews/:id/comments — list comments on a review (newest first).
router.get("/:id/comments", async (req, res, next) => {
  try {
    const [[review]] = await pool.query(
      "SELECT id FROM reviews WHERE id = ?",
      [req.params.id]
    );
    if (!review) return res.status(404).json({ error: "Review not found" });

    const [comments] = await pool.query(
      `SELECT ${COMMENT_COLUMNS}
         FROM comments c
        WHERE c.review_id = ?
        ORDER BY c.created_at DESC, c.id DESC`,
      [req.params.id]
    );
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews/:id/comments — add a comment to a review (protected).
router.post("/:id/comments", auth, async (req, res, next) => {
  try {
    const reviewId = Number(req.params.id);
    const { body } = req.body;
    if (!body) return res.status(400).json({ error: "body is required" });

    const [[review]] = await pool.query(
      "SELECT id FROM reviews WHERE id = ?",
      [reviewId]
    );
    if (!review) return res.status(404).json({ error: "Review not found" });

    const [[user]] = await pool.query(
      "SELECT id, name FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!user) return res.status(401).json({ error: "Invalid token" });

    const [result] = await pool.query(
      `INSERT INTO comments (review_id, user_id, author, body)
       VALUES (?, ?, ?, ?)`,
      [reviewId, user.id, user.name, body]
    );

    const [[comment]] = await pool.query(
      `SELECT ${COMMENT_COLUMNS} FROM comments c WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

export default router;
