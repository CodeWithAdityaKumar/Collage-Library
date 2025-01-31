const connection = require("../../utils/dbConnection");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, username, password, role } = req.body;
  

  if (password) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing password", err });
      }
      const query = "UPDATE users SET name=?, email=?, username=?, password=?, role=? WHERE sno=?";
      connection.query(query, [name, email, username, hash, role, id], (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Error updating user", err });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully" });
      });
    });
  }
  
  if(!password){
    const query = "UPDATE users SET name=?, email=?, username=?, role=? WHERE sno=?";
    connection.query(query, [name, email, username, role, id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error updating user", err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully" });
    });
  }
};

module.exports = updateUser;
