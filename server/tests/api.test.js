// Automated API tests with supertest. The db pool is mocked so the tests run
// without a live MySQL server and stay deterministic.
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// A signing secret for the test JWTs (used before app.js is imported).
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

// Mock the database module before app.js (and its routers) import it.
vi.mock("../db.js", () => ({
  pool: { query: vi.fn() },
  default: { query: vi.fn() },
}));

import { pool } from "../db.js";
import { signToken } from "../middleware/auth.js";
import app from "../app.js";

// A logged-in user (id = 7) and the Bearer token the middleware accepts.
const USER_ID = 7;
const token = signToken(USER_ID);
const authHeader = `Bearer ${token}`;

describe("apartments API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists apartments", async () => {
    // GET /api/apartments runs one query; return a fake row set.
    pool.query.mockResolvedValueOnce([
      [{ id: 1, name: "The Marlstone", rating: 5, reviewCount: 1 }],
    ]);

    const res = await request(app).get("/api/apartments");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe("The Marlstone");
  });

  it("blocks an unauthenticated review", async () => {
    // No Authorization header -> the auth middleware returns 401 before any DB call.
    const res = await request(app)
      .post("/api/apartments/1/reviews")
      .send({ rating: 5, body: "Nice" });

    expect(res.status).toBe(401);
    expect(pool.query).not.toHaveBeenCalled();
  });
});

describe("edit review (PUT /api/reviews/:id)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an unauthenticated edit with 401", async () => {
    // No token -> the auth middleware answers before touching the DB.
    const res = await request(app)
      .put("/api/reviews/1")
      .send({ rating: 4, body: "Updated" });

    expect(res.status).toBe(401);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it("updates the review and returns it (200) when you are the owner", async () => {
    pool.query
      // 1) look up the review's owner -> it's this user
      .mockResolvedValueOnce([[{ id: 1, user_id: USER_ID }]])
      // 2) the UPDATE statement
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      // 3) re-select the updated row (camelCase aliases)
      .mockResolvedValueOnce([
        [
          {
            id: 1,
            aptId: 1,
            rating: 4,
            body: "Updated",
            imageUrl: null,
            date: "2026-04-12",
            author: "Alex",
            userEmail: "alex@dal.ca",
          },
        ],
      ]);

    const res = await request(app)
      .put("/api/reviews/1")
      .set("Authorization", authHeader)
      .send({ rating: 4, body: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, rating: 4, body: "Updated" });
  });

  it("returns 403 when the review is not yours", async () => {
    // Owner is a different user id -> authorization fails (403, not 401).
    pool.query.mockResolvedValueOnce([[{ id: 2, user_id: 999 }]]);

    const res = await request(app)
      .put("/api/reviews/2")
      .set("Authorization", authHeader)
      .send({ rating: 1, body: "Not mine" });

    expect(res.status).toBe(403);
    // Only the owner lookup ran; no UPDATE happened.
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("returns 404 when the review does not exist", async () => {
    // Empty result set -> the destructured review is undefined.
    pool.query.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .put("/api/reviews/9999")
      .set("Authorization", authHeader)
      .send({ rating: 4, body: "Updated" });

    expect(res.status).toBe(404);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("validates the rating range (400)", async () => {
    const res = await request(app)
      .put("/api/reviews/1")
      .set("Authorization", authHeader)
      .send({ rating: 9, body: "Out of range" });

    expect(res.status).toBe(400);
    // Validation happens before any DB lookup.
    expect(pool.query).not.toHaveBeenCalled();
  });
});
