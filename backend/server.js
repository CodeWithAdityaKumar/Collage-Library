const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "aditya";

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "slietlibrary",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

const isAdmin = async (req, res, next) => {
    let token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }
        req.user = decoded;
        // console.log(decoded);
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
  
};

// Route for admin login page
app.get("/admin-login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "admin-login.html"));
});

// Update the admin login API to return proper token
app.post("/api/admin-login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  try {
    const query =
      'SELECT username, email, role FROM admin WHERE username = ? AND password = ? AND role = "admin"';

    db.query(query, [username, password], (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({
          message: "Internal server error",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid credentials or not an admin account",
        });
      }

      const user = results[0];

      // Create JWT token with proper payload
      const token = jwt.sign(
        {
          username: user.username,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        token: token,
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// Update admin dashboard route to check auth header
app.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "adminDashboard.html"));
});

app.get("/admin-verify", isAdmin, (req, res) => {

    console.log(req.user);

    if (!req.user) {
        res.redirect("/admin-login");
    }
    
    res.json({
        code: 400,
        status: "success"
  })
});



// Error handling middleware for server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
