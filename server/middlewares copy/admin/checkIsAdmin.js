const jwt = require("jsonwebtoken");
const connection = require("../../utils/dbConnection");
// const query = `SELECT * FROM users WHERE username = ? AND role = 'admin'`;

const query = `SELECT * FROM users WHERE username = $1 AND role = 'admin'`;

const isAdmin = (req, res, next) => {
  let token = req.cookies.accesstoken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    

      if (decoded.username) {
        
          connection.query(query, [decoded.username], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Error finding user", err });
                }
        
                if (results.length === 0) {
                    return res.status(404).json({ error: "User not found" });
                }
        
                const user = results[0];
                if (user.username === decoded.username) {
                    next();
                } else {
                    return res.status(401).json({ error: "Unauthorized" });
                }
            });
        
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  });
};

module.exports = isAdmin;
