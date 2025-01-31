const connection = require("../../utils/dbConnection");

const query = `SELECT * FROM books`;

const fetchBooks = (req, res, next) => {
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching books:", err);
            return res.status(500).json({
                error: "Error fetching books from database",
                details: err.message
            });
        }

        // Store books in request object to be used by next middleware

        req.books = results;
        next();
    });
};

module.exports = fetchBooks;