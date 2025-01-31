const connection = require("../../utils/dbConnection");

const query = `SELECT * FROM books WHERE sno = ?`;

const fetchSingleBook = (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            error: "Book ID is required"
        });
    }

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching book:", err);
            return res.status(500).json({
                error: "Error fetching book from database",
                details: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        req.book = results[0];
        next();
 
    });
};

module.exports = fetchSingleBook;