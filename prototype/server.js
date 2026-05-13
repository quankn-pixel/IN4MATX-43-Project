const multer = require("multer");
const path = require("path");

const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
// Test route
app.get("/", (req, res) => {
  res.send("Wildspot prototype server is running!");
});

// Get all animal posts
app.get("/api/posts", (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to load posts"
      });
    }

    res.json({
      posts: rows
    });
  });
});

// Create a new animal post
app.post("/api/posts", upload.single("media"), (req, res) => {
  const {
    animal_category,
    caption,
    approximate_location
  } = req.body;

  const media_url = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.media_url;

  if (!animal_category) {
    return res.status(400).json({
      error: "animal_category is required"
    });
  }

  db.run(
    `
    INSERT INTO posts (
      animal_category,
      caption,
      media_url,
      approximate_location
    )
    VALUES (?, ?, ?, ?)
    `,
    [animal_category, caption, media_url, approximate_location],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Failed to save post"
        });
      }

      res.json({
        success: true,
        postId: this.lastID,
        media_url: media_url
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Wildspot prototype server running at http://localhost:${PORT}`);
});