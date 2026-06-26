# TenantTrails API

REST API for the TenantTrails app — CSCI 4177/5709 Lab 6 (Integration, Auth &
the full flow). Built with Express, MySQL (mysql2), JWT auth (httpOnly cookies),
bcrypt, and Cloudinary. It replaces the React app's in-memory `src/data` mock
files with a real, persisted backend, and the React app now talks to it end to
end.

## Requirements

- Node 18+
- MySQL 8 running locally (the Week 4 `tenanttrails` database)
- A free Cloudinary account (for image upload)

## Setup

```bash
cd server
npm install

# create the database and seed apartments + reviews
mysql -u root -p < sql/schema.sql

# copy the env template and fill in real values
cp .env.example .env        # Windows: copy .env.example .env

# (recommended) hash the seed users' password correctly so they can log in
npm run seed
```

Fill in `.env` with your MySQL credentials, a long random `JWT_SECRET`, your
three Cloudinary keys (Console → Settings → API Keys), and `CLIENT_ORIGIN` set
to the exact Vite origin (default `http://localhost:5173`).

## Run

```bash
npm run dev     # nodemon, restarts on save
# → API on http://localhost:3000
```

`npm start` runs it once without nodemon.

## Authentication — httpOnly cookie

On signup and login the server sets an **httpOnly** cookie named `token`
(`res.cookie`). JavaScript on the page cannot read it, so a cross-site script
cannot steal it. The browser attaches it automatically to every request, as long
as the client opts in with `credentials: "include"` and the server's CORS allows
credentials for the **exact** frontend origin (a `*` wildcard is not allowed with
credentials). `POST /api/auth/logout` clears the cookie.

The `auth` middleware reads the token from the cookie first, and also accepts an
`Authorization: Bearer <token>` header as a fallback — handy for Postman / API
clients. `signup` and `login` still return `{ token, user }` in the body for that
reason.

**Authentication vs authorization:** `401 Unauthorized` means no valid token
(you are not logged in). `403 Forbidden` means you are logged in but the row is
not yours — edit/delete compare `reviews.user_id` to `req.user.id`.

## Endpoints

| Method | Path                              | Auth | Description                                  |
| ------ | --------------------------------- | ---- | -------------------------------------------- |
| GET    | `/api/health`                     | —    | Health check                                 |
| POST   | `/api/auth/signup`                | —    | Create a user; sets cookie, returns `{ token, user }` |
| POST   | `/api/auth/login`                 | —    | Log in; sets cookie, returns `{ token, user }` |
| POST   | `/api/auth/logout`                | —    | Clear the auth cookie                        |
| GET    | `/api/auth/me`                    | ✓    | Current user, returns `{ user }`             |
| GET    | `/api/auth/me/reviews`            | ✓    | Reviews written by the current user          |
| GET    | `/api/apartments`                 | —    | List apartments with `rating` + `reviewCount`|
| GET    | `/api/apartments/:id`             | —    | One apartment plus its reviews               |
| GET    | `/api/apartments/:id/reviews`     | —    | Reviews for an apartment                     |
| POST   | `/api/apartments/:id/reviews`     | ✓    | Add a review (author taken from the token)   |
| PUT    | `/api/reviews/:id`                | ✓    | Edit a review (author only → 403 otherwise)  |
| DELETE | `/api/reviews/:id`                | ✓    | Delete a review (author only → 403 otherwise)|
| GET    | `/api/reviews/:id/comments`       | —    | Comments on a review                         |
| POST   | `/api/reviews/:id/comments`       | ✓    | Add a comment to a review                    |
| POST   | `/api/uploads`                    | ✓    | Upload an image to Cloudinary, returns `url` |

Status codes: 200 OK, 201 Created, 204 No content (delete), 400 Bad request,
401 Unauthorized, 403 Forbidden, 404 Not found.

**The contract (field names):** the database stores `snake_case`; the React app
expects `camelCase`. The queries rename columns with `AS` (e.g.
`r.apt_id AS aptId`, `r.created_at AS date`) so the JSON shape is a contract the
frontend depends on.

**Review attachments:** `POST /api/uploads` sends an image (multipart field
`image`) to Cloudinary and returns `{ url }`. The client then includes that URL
as `imageUrl` in the `POST /api/apartments/:id/reviews` body; it is stored in the
`reviews.image_url` column and returned with the review.

### Seed login

After `npm run seed`, every seed account logs in with password **`password123`**,
e.g. `alex@dal.ca` / `password123`.

## Testing

Automated tests (Vitest + supertest, the database is mocked so no live MySQL is
needed):

```bash
npm test
```

Manual testing: import `postman/TenantTrails.postman_collection.json` into
Postman. Run **Auth - Login** first — it stores the JWT in the `{{token}}`
collection variable (used by the Bearer fallback) and Postman also keeps the
`token` cookie for the same jar. The collection includes the failure cases
(no-token review → 401, missing apartment → 404, editing someone else's review →
403) and saves an example response for each request.

## Project structure

```
server/
├── server.js          entry point, starts Express
├── app.js             the Express app (cors+credentials, cookie-parser)
├── db.js              the mysql2 connection pool
├── cloudinary.js      Cloudinary SDK config
├── middleware/
│   └── auth.js        JWT signing, cookie helpers, verify middleware
├── routes/
│   ├── auth.js        signup, login, logout, me, me/reviews
│   ├── apartments.js  list, get one, add review
│   ├── reviews.js     edit, delete, comments
│   └── uploads.js     Cloudinary image upload
├── sql/
│   ├── schema.sql     tables + apartment/review seed
│   └── seed.js        correct bcrypt hashing of seed users
├── tests/
│   └── api.test.js    supertest tests
├── postman/
│   └── TenantTrails.postman_collection.json
├── .env.example       config keys (no real secrets)
└── package.json
```

## Security notes

- Passwords are bcrypt-hashed; the raw password is never stored.
- The JWT lives in an httpOnly cookie, so page scripts can't read it.
- All SQL uses `?` parameterized queries to prevent SQL injection.
- The author of a write comes from the verified JWT, never the request body.
- Edit/delete enforce ownership (403) by comparing `user_id` to `req.user.id`.
- `.env` and the Cloudinary API secret are kept out of git.
