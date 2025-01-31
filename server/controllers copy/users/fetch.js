const connection = require("../../utils/dbConnection");

const fetchUsers = (req, res, next) => {
  const query = "SELECT sno, name, email, username, role FROM users";
  
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users", err });
    }
      req.users = results
      next();
  });
};

module.exports = fetchUsers;
