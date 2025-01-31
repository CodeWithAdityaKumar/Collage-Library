const connection = require("../../utils/dbConnection");

const deleteUser = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE sno = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting user", err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};

module.exports = deleteUser;
