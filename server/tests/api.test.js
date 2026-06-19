// Automated API tests with supertest. The db pool is mocked so the tests run
// without a live MySQL server and stay deterministic.
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mock the database module before app.js (and its routers) import it.
vi.mock("../db.js", () => ({
  pool: { query: vi.fn() },
  default: { query: vi.fn() },
}));

import { pool } from "../db.js";
import app from "../app.js";

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
