import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// mysql2 returns AVG() as a DECIMAL string and COUNT() can be a string too.
// Coerce them to numbers (or null) so the JSON matches the old frontend shape.
function normalizeApartment(row) {
  return {
    ...row,
    rating: row.rating === null ? null : Number(row.rating),
    reviewCount: Number(row.reviewCount),
  };
}

// Column aliases keep the JSON shape identical to the old frontend data files
// (camelCase), so the React app is a drop-in switch from mockData to the API.
const APT_COLUMNS = `
  a.id,
  a.name,
  a.address,
  a.neighbourhood,
  a.tags,
  a.no_summary  AS noSummary,
  a.ai_summary  AS aiSummary,
  a.image_url   AS imageUrl
`;

const REVIEW_COLUMNS = `
  r.id,
  r.apt_id      AS aptId,
  r.rating,
  r.body,
  r.image_url   AS imageUrl,
  r.created_at  AS date,
  r.author,
  r.user_email  AS userEmail
`;

// GET /api/apartments — list every apartment with its rating and review count.
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT ${APT_COLUMNS},
             ROUND(AVG(r.rating), 1) AS rating,
             COUNT(r.id)             AS reviewCount
        FROM apartments a
        LEFT JOIN reviews r ON r.apt_id = a.id
        GROUP BY a.id
        ORDER BY a.id
    `);
    res.json(rows.map(normalizeApartment));
  } catch (err) {
    next(err);
  }
});

// GET /api/apartments/:id — one apartment plus its reviews (newest first).
router.get("/:id", async (req, res, next) => {
  try {
    const [[apt]] = await pool.query(
      `SELECT ${APT_COLUMNS},
              ROUND(AVG(r.rating), 1) AS rating,
              COUNT(r.id)             AS reviewCount
         FROM apartments a
         LEFT JOIN reviews r ON r.apt_id = a.id
        WHERE a.id = ?
        GROUP BY a.id`,
      [req.params.id]
    );

    if (!apt) return res.status(404).json({ error: "Apartment not found" });

    const [reviews] = await pool.query(
      `SELECT ${REVIEW_COLUMNS}
         FROM reviews r
        WHERE r.apt_id = ?
        ORDER BY r.created_at DESC, r.id DESC`,
      [req.params.id]
    );

    res.json({ ...normalizeApartment(apt), reviews });
  } catch (err) {
    next(err);
  }
});

// GET /api/apartments/:id/reviews — just the reviews for an apartment.
router.get("/:id/reviews", async (req, res, next) => {
  try {
    const [reviews] = await pool.query(
      `SELECT ${REVIEW_COLUMNS}
         FROM reviews r
        WHERE r.apt_id = ?
        ORDER BY r.created_at DESC, r.id DESC`,
      [req.params.id]
    );
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// POST /api/apartments/:id/reviews — add a review (protected).
// The author is resolved from the token, never trusted from the body.
router.post("/:id/reviews", auth, async (req, res, next) => {
  try {
    const aptId = Number(req.params.id);
    const { rating, body, imageUrl } = req.body;

    if (!rating || !body) {
      return res.status(400).json({ error: "rating and body are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "rating must be between 1 and 5" });
    }

    // Make sure the apartment exists -> 404 otherwise.
    const [[apt]] = await pool.query(
      "SELECT id FROM apartments WHERE id = ?",
      [aptId]
    );
    if (!apt) return res.status(404).json({ error: "Apartment not found" });

    // Author comes from the authenticated user.
    const [[user]] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!user) return res.status(401).json({ error: "Invalid token" });

    const [result] = await pool.query(
      `INSERT INTO reviews (apt_id, user_id, author, user_email, rating, body, image_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [aptId, user.id, user.name, user.email, rating, body, imageUrl || null]
    );

    const [[review]] = await pool.query(
      `SELECT ${REVIEW_COLUMNS} FROM reviews r WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

export default router;
