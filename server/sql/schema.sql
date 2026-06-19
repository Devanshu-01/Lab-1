-- TenantTrails database schema + seed (CSCI 4177/5709 Lab 5)
-- Reproduces the data the React app previously held in src/data.
-- Run:  mysql -u root -p < sql/schema.sql

CREATE DATABASE IF NOT EXISTS tenanttrails
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tenanttrails;

-- Drop in dependency order so the script is re-runnable.
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS apartments;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(190) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,           -- bcrypt hash, never the raw password
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- apartments
-- ---------------------------------------------------------------------------
CREATE TABLE apartments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(160) NOT NULL,
  address       VARCHAR(200) NOT NULL,
  neighbourhood VARCHAR(120) NOT NULL,
  tags          JSON NULL,
  no_summary    BOOLEAN NOT NULL DEFAULT FALSE,
  ai_summary    TEXT NULL,
  image_url     VARCHAR(500) NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
CREATE TABLE reviews (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  apt_id     INT NOT NULL,
  user_id    INT NULL,                        -- author resolved from JWT when available
  author     VARCHAR(120) NOT NULL,
  user_email VARCHAR(190) NOT NULL,
  rating     TINYINT NOT NULL,                -- 1..5
  body       TEXT NOT NULL,
  image_url  VARCHAR(500) NULL,               -- Cloudinary CDN URL of an optional attachment
  created_at DATE NOT NULL,
  CONSTRAINT fk_reviews_apt
    FOREIGN KEY (apt_id) REFERENCES apartments(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- comments (a reply on a review)
-- ---------------------------------------------------------------------------
CREATE TABLE comments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  review_id  INT NOT NULL,
  user_id    INT NULL,
  author     VARCHAR(120) NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_review
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- Seed: apartments (from src/data/apartments.js)
-- ---------------------------------------------------------------------------
INSERT INTO apartments (id, name, address, neighbourhood, tags, no_summary, ai_summary, image_url) VALUES
(1, 'The Marlstone', '5540 Spring Garden Rd', 'Spring Garden',
 JSON_ARRAY('Spotless', 'Responsive landlord', 'Well furnished'), FALSE,
 'Tenants describe The Marlstone as spotless and well furnished, with a landlord who responds within a day. Reviews are overwhelmingly positive with no recurring complaints.',
 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80'),
(2, 'Park Victoria', '1496 Carlton St', 'South End',
 JSON_ARRAY('Well maintained', 'Quiet', 'Expensive'), FALSE,
 'Tenants consistently praise how well maintained and quiet Park Victoria is, with responsive management. The main drawback raised is the high rent.',
 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80'),
(3, 'Le Marchant Towers', '1585 Le Marchant St', 'West End',
 JSON_ARRAY('Good location', 'Parking limited', 'Aging building'), FALSE,
 'Reviewers love the location of Le Marchant Towers, especially its proximity to campus. Common complaints centre on limited parking, an aging building, and thin walls.',
 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80'),
(4, 'Fenwick Tower', '5599 Fenwick St', 'Downtown',
 JSON_ARRAY('Elevator issues', 'Great views', 'Security concerns'), FALSE,
 'Fenwick Tower is known for great views from the upper floors, but tenants repeatedly flag unreliable elevators and security concerns at the entrance.',
 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=600&q=80'),
(5, 'Southpoint Apartments', '1050 South Park St', 'South End',
 JSON_ARRAY('Affordable', 'Central', 'Slow maintenance', 'Thin walls'), FALSE,
 'Southpoint is valued for being affordable and central, but tenants repeatedly report slow maintenance, winter heating problems, and noise from thin walls.',
 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&q=80');

-- ---------------------------------------------------------------------------
-- Seed: users (from src/data/users.js).
-- The hash below is the well-known bcrypt test vector for the password
-- "password" (cost 10). To make every seed user log in with the original
-- frontend password "password123" instead, run `npm run seed` after this
-- script — it re-hashes the correct password with bcrypt and links reviews.
-- ---------------------------------------------------------------------------
INSERT INTO users (name, email, password) VALUES
('Alex',   'alex@dal.ca',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Jordan', 'jordan@dal.ca', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Sam',    'sam@dal.ca',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Riley',  'riley@dal.ca',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Casey',  'casey@dal.ca',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Morgan', 'morgan@dal.ca', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Taylor', 'taylor@dal.ca', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Jamie',  'jamie@dal.ca',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Drew',   'drew@dal.ca',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Pat',    'pat@dal.ca',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Lee',    'lee@dal.ca',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- ---------------------------------------------------------------------------
-- Seed: reviews (from src/data/reviews.js)
-- ---------------------------------------------------------------------------
INSERT INTO reviews (id, apt_id, user_id, author, user_email, rating, body, created_at) VALUES
(1, 1, (SELECT id FROM users WHERE email='alex@dal.ca'),   'Alex',   'alex@dal.ca',   5, 'Spotless building and the landlord actually responds within a day. Highly recommend.', '2026-04-12'),
(2, 2, (SELECT id FROM users WHERE email='jordan@dal.ca'), 'Jordan', 'jordan@dal.ca', 5, 'Quiet, very well maintained, and the staff are professional. Worth the price.', '2026-03-28'),
(3, 2, (SELECT id FROM users WHERE email='alex@dal.ca'),   'Alex',   'alex@dal.ca',   4, 'Great spot but rent is steep. Management is solid and repairs are quick.', '2026-02-15'),
(4, 3, (SELECT id FROM users WHERE email='sam@dal.ca'),    'Sam',    'sam@dal.ca',    4, 'Good location right by campus. Parking is a constant pain though.', '2026-03-05'),
(5, 3, (SELECT id FROM users WHERE email='riley@dal.ca'),  'Riley',  'riley@dal.ca',  4, 'Building is aging but the front-desk staff are friendly and helpful.', '2026-01-22'),
(6, 3, (SELECT id FROM users WHERE email='alex@dal.ca'),   'Alex',   'alex@dal.ca',   3, 'Walls are thin, but the commute is unbeatable. A fair trade for students.', '2025-12-10'),
(7, 4, (SELECT id FROM users WHERE email='casey@dal.ca'),  'Casey',  'casey@dal.ca',  4, 'Incredible views from the upper floors. Sunsets make up for a lot.', '2026-04-01'),
(8, 4, (SELECT id FROM users WHERE email='morgan@dal.ca'), 'Morgan', 'morgan@dal.ca', 3, 'Elevators break down often, which is frustrating during exam season.', '2026-02-20'),
(9, 4, (SELECT id FROM users WHERE email='taylor@dal.ca'), 'Taylor', 'taylor@dal.ca', 3, 'Security at the front entrance could be better. Otherwise fine.', '2026-01-08'),
(10, 5, (SELECT id FROM users WHERE email='jamie@dal.ca'), 'Jamie',  'jamie@dal.ca',  3, 'Affordable and central, but maintenance requests take ages to resolve.', '2026-03-18'),
(11, 5, (SELECT id FROM users WHERE email='drew@dal.ca'),  'Drew',   'drew@dal.ca',   2, 'Heating issues all winter. Took weeks to get someone to look at it.', '2026-02-02'),
(12, 5, (SELECT id FROM users WHERE email='pat@dal.ca'),   'Pat',    'pat@dal.ca',    3, 'Decent for the price if you keep your expectations low.', '2026-01-15'),
(13, 5, (SELECT id FROM users WHERE email='lee@dal.ca'),   'Lee',    'lee@dal.ca',    2, 'Noisy neighbours and thin walls. Not ideal if you need to study.', '2025-12-28');
