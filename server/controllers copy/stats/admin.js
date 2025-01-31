const connection = require("../../utils/dbConnection");

const stats = async (_req, res) => {
    try {
        // Query to get total books and available books
        const booksQuery = "SELECT COUNT(*) as totalBooks FROM books";
        
        // Query to get total users
        const usersQuery = "SELECT COUNT(*) as totalUsers FROM users";
        
        // Query to get total issued books (total copies - available copies)
        const issuedBooksQuery = "SELECT SUM(totalCopies - availableCopies) as booksIssued FROM books";

        // Execute queries
        connection.query(booksQuery, (err, booksResults) => {
            if (err) {
                return res.status(500).json({ 
                    error: "Error fetching books stats", 
                    details: err.message 
                });
            }

            connection.query(usersQuery, (err, usersResults) => {
                if (err) {
                    return res.status(500).json({ 
                        error: "Error fetching users stats", 
                        details: err.message 
                    });
                }

                connection.query(issuedBooksQuery, (err, issuedResults) => {
                    if (err) {
                        return res.status(500).json({ 
                            error: "Error fetching issued books stats", 
                            details: err.message 
                        });
                    }

                    // Format response
                    const stats = {
                        totalBooks: booksResults[0].totalBooks || 0,
                        totalUsers: usersResults[0].totalUsers || 0,
                        booksIssued: issuedResults[0].booksIssued || 0,
                        overdue: 0 // You can add overdue logic later if needed
                    };

                    res.status(200).json({
                        success: true,
                        stats,
                        message: "Stats fetched successfully"
                    });
                });
            });
        });

    } catch (error) {
        console.error("Error in stats controller:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
};

module.exports = stats;