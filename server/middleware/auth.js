import jwt from "jsonwebtoken";

// Sign a JWT carrying the user's id (used by signup and login).
export function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Middleware: verify the token and attach the user to the request.
// The author of any write comes from the token, never from the body.
export function auth(req, res, next) {
  const header = req.headers.authorization; // "Bearer <token>"
  const token = header && header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, iat, exp }
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export default auth;
