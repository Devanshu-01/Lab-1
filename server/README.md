# TenantTrails API

REST API for the TenantTrails app — CSCI 4177/5709 Lab 5 (REST + CDN + Testing).
Built with Express, MySQL (mysql2), JWT auth, bcrypt, and Cloudinary. It replaces
the React app's in-memory `src/data` mock files with a real, persisted backend.

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

Fill in `.env` with your MySQL credentials, a long random `JWT_SECRET`, and your
three Cloudinary keys (Console → Settings → API Keys).

## Run

```bash
npm run dev     # nodemon, restarts on save
# → API on http://localhost:3000
```

`npm start` runs it once without nodemon.

## Endpoints

| Method | Path                              | Auth | Description                                  |
| ------ | --------------------------------- | ---- | -------------------------------------------- |
| GET    | `/api/health`                     | —    | Health check                                 |
| POST   | `/api/auth/signup`                | —    | Create a user, returns `{ token, user }`     |
| POST   | `/api/auth/login`                 | —    | Log in, returns `{ token, user }`            |
| GET    | `/api/auth/me`                    | ✓    | Current user from the token                  |
| GET    | `/api/auth/me/reviews`            | ✓    | Reviews written by the current user          |
| GET    | `/api/apartments`                 | —    | List apartments with `rating` + `reviewCount`|
| GET    | `/api/apartments/:id`             | —    | One apartment plus its reviews               |
| GET    | `/api/apartments/:id/reviews`     | —    | Reviews for an apartment                     |
| POST   | `/api/apartments/:id/reviews`     | ✓    | Add a review (author taken from the token)   |
| DELETE | `/api/reviews/:id`                | ✓    | Delete a review (author only)                |
| GET    | `/api/reviews/:id/comments`       | —    | Comments on a review                         |
| POST   | `/api/reviews/:id/comments`       | ✓    | Add a comment to a review                    |
| POST   | `/api/uploads`                    | ✓    | Upload an image to Cloudinary, returns `url` |

Protected routes expect an `Authorization: Bearer <token>` header. Status codes:
200 OK, 201 Created, 400 Bad request, 401 Unauthorized, 404 Not found.

**Review attachments:** `POST /api/uploads` sends an image (multipart field `image`)
to Cloudinary and returns `{ url }`. The client then includes that URL as
`imageUrl` in the `POST /api/apartments/:id/reviews` body, and it is stored in the
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

Manual testing: import `postman/TenantTrails.postman_collection.json` into Postman.
Run **Auth - Login** first — it stores the JWT in the `{{token}}` collection
variable, which the protected requests reuse. The collection also includes the
two failure cases (no-token review → 401, missing apartment → 404).

## Project structure

```
server/
├── server.js          entry point, starts Express
├── app.js             the Express app (exported for tests)
├── db.js              the mysql2 connection pool
├── cloudinary.js      Cloudinary SDK config
├── middleware/
│   └── auth.js        JWT signing + verification middleware
├── routes/
│   ├── auth.js        signup, login, me
│   ├── apartments.js  list, get one, add review
│   ├── reviews.js     comments on reviews
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
- All SQL uses `?` parameterized queries to prevent SQL injection.
- The author of a write comes from the verified JWT, never the request body.
- `.env` and the Cloudinary API secret are kept out of git.
