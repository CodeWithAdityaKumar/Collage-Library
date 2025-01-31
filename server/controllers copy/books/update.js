const connection = require("../../utils/dbConnection");

const query = `UPDATE books SET title = ?, totalCopies = ?, availableCopies = ? WHERE sno = ?`;

const updateBook = (req, res) => {
    const { id } = req.params;
    const { title, totalCopies } = req.body;

    // Initial validation
    if (!id || !title || !totalCopies) {
        return res.status(400).json({
            error: "Book ID, title and totalCopies are required fields"
        });
    }

    // Convert totalCopies to integer
    const totalCopiesInt = parseInt(totalCopies);

    // Get current book data to calculate new availableCopies
    connection.query('SELECT * FROM books WHERE sno = ?', [id], (err, results) => {
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

        const currentBook = results[0];
        
        // Calculate new available copies
        // Maintain the same ratio of available to total copies
        const availableCopies = Math.floor((currentBook.availableCopies / currentBook.totalCopies) * totalCopiesInt);

        // Update the book
        connection.query(
            query,
            [title, totalCopiesInt, availableCopies, id],
            (err, results) => {
                if (err) {
                    console.error("Error updating book:", err);
                    return res.status(500).json({
                        error: "Error updating book in database",
                        details: err.message
                    });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({
                        error: "Book not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Book updated successfully"
                });
            }
        );
    });
};

module.exports = updateBook;