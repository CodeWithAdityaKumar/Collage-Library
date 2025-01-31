const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const connection = require("../../utils/dbConnection");

const query = `SELECT * FROM users WHERE username = ? AND role = 'faculty'`;

const loginUserFaculty = (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  connection.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error finding user", err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    console.log(user.username, username);

    if (user.username === username) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error comparing passwords", err });
        }
        if (!result) {
          return res.status(401).json({ error: "Invalid Password" });
        }

        if (result) {
          const token = jwt.sign(
            {
              username,
              role: user.role,
            },
            process.env.JWT_SECRET
          );
          res.cookie("accesstoken", token, { httpOnly: true });
          return res.status(200).json({ message: "Login successful" });
        }
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
};

module.exports = loginUserFaculty;
