const connection = require("../../utils/dbConnection");

const query = `INSERT INTO books (title, totalCopies, availableCopies) 
               VALUES (?, ?, ?)`;

const addBook = (req, res, next) => {
    let {
        title,
        totalCopies,
    } = req.body;

    totalCopies = parseInt(totalCopies);

    // Initial validation
    if (!title || !totalCopies) {
        return res.status(400).json({
            error: "Title and totalCopies are required fields"
        });
    }

    // Set available copies equal to total copies when first adding book
    const availableCopies = totalCopies;

    connection.query(
        query,
        [
            title,
            totalCopies,
            availableCopies
        ],
        (err, results) => {
            if (err) {
                console.error("Error adding book:", err);
                return res.status(500).json({
                    error: "Error adding book to database",
                    details: err.message
                });
            }

            req.bookId = results.insertId;
            next();
        }
    );
};

module.exports = addBook;