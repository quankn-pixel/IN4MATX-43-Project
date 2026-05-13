const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("wildspot.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      animal_category TEXT NOT NULL,
      caption TEXT,
      media_url TEXT,
      approximate_location TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    INSERT INTO posts (
      animal_category,
      caption,
      media_url,
      approximate_location
    )
    VALUES (
      'Duck',
      'Saw a duck near Mason Park',
      '/fake-media/duck.jpg',
      'Mason Park area'
    )
  `);
});

module.exports = db;