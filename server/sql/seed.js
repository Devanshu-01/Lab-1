// Seeds (or refreshes) the seed users with a correct bcrypt hash of the
// original frontend password, then links existing reviews to those users.
//
// Run AFTER schema.sql has created the tables:
//   npm run seed
//
// This guarantees the seed accounts can log in with "password123", since the
// hash is generated here by bcrypt rather than hardcoded in SQL.

import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";

const SEED_PASSWORD = "password123";

const SEED_USERS = [
  { name: "Alex", email: "alex@dal.ca" },
  { name: "Jordan", email: "jordan@dal.ca" },
  { name: "Sam", email: "sam@dal.ca" },
  { name: "Riley", email: "riley@dal.ca" },
  { name: "Casey", email: "casey@dal.ca" },
  { name: "Morgan", email: "morgan@dal.ca" },
  { name: "Taylor", email: "taylor@dal.ca" },
  { name: "Jamie", email: "jamie@dal.ca" },
  { name: "Drew", email: "drew@dal.ca" },
  { name: "Pat", email: "pat@dal.ca" },
  { name: "Lee", email: "lee@dal.ca" },
];

async function main() {
  const hash = await bcrypt.hash(SEED_PASSWORD, 10);

  for (const u of SEED_USERS) {
    // Insert if new, otherwise update the password hash so login works.
    await pool.query(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password)`,
      [u.name, u.email, hash]
    );
  }

  // Link any reviews to their author by matching email.
  await pool.query(
    `UPDATE reviews r
       JOIN users u ON u.email = r.user_email
        SET r.user_id = u.id`
  );

  console.log(
    `Seeded ${SEED_USERS.length} users (password "${SEED_PASSWORD}") and linked reviews.`
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
