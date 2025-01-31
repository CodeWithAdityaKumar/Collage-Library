const connection = require("../../utils/dbConnection");

const query = `DELETE FROM books WHERE sno = ?`;

const deleteBook = (req, res) => {
    const { id } = req.params;

    // Validate book ID
    if (!id) {
        return res.status(400).json({
            error: "Book ID is required"
        });
    }

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error deleting book:", err);
            return res.status(500).json({
                error: "Error deleting book from database",
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
            message: "Book deleted successfully"
        });
    });
};

module.exports = deleteBook;