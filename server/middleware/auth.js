import jwt from "jsonwebtoken";

// Name of the httpOnly cookie the auth token lives in.
export const TOKEN_COOKIE = "token";

// Sign a JWT carrying the user's id (used by signup and login).
export function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Options for the auth cookie. httpOnly means JavaScript cannot read it, so a
// cross-site script cannot steal a token it cannot see. sameSite "lax" is a
// sensible default for a same-site dev setup.
export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

// Set the auth cookie on a response (used by signup and login).
export function setAuthCookie(res, id) {
  res.cookie(TOKEN_COOKIE, signToken(id), cookieOptions());
}

// Middleware: verify the token and attach the user to the request.
// The token is read from the httpOnly cookie first; an Authorization: Bearer
// header is also accepted as a fallback (handy for Postman / API clients).
// The author of any write comes from the token, never from the body.
export function auth(req, res, next) {
  const cookieToken = req.cookies && req.cookies[TOKEN_COOKIE];
  const header = req.headers.authorization; // "Bearer <token>"
  const bearerToken = header && header.split(" ")[1];
  const token = cookieToken || bearerToken;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, iat, exp }
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export default auth;
