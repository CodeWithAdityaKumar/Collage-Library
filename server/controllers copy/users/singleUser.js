const connection = require("../../utils/dbConnection");

const getSingleUser = (req, res, next) => {
  const { id } = req.params;
  const query = "SELECT sno, name, email, username, role FROM users WHERE sno = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user", err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
      }
      
      req.user = results[0];
      next();
  });
};

module.exports = getSingleUser;
