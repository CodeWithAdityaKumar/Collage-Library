const connection = require("../../utils/dbConnection");

const facultyStats = async (req, res) => {
    try {
        const facultyId = req.decoded.id;

        // Query to get total borrowed books
        const borrowedQuery = "SELECT COUNT(*) as totalBorrowed FROM issued_books WHERE faculty_id = ? AND returned = 0";
        
        // Query to get books due soon (within 7 days)
        const dueSoonQuery = `
            SELECT COUNT(*) as dueSoon 
            FROM issued_books 
            WHERE faculty_id = ? 
            AND returned = 0 
            AND due_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
        `;
        
        // Query to get current books
        const currentBooksQuery = `
            SELECT b.title, b.author, i.issue_date, i.due_date 
            FROM issued_books i 
            JOIN books b ON i.book_id = b.sno 
            WHERE i.faculty_id = ? AND i.returned = 0
            ORDER BY i.due_date ASC
        `;

        // Execute queries
        connection.query(borrowedQuery, [facultyId], (err, borrowedResults) => {
            if (err) {
                return res.status(500).json({ 
                    error: "Error fetching borrowed books stats", 
                    details: err.message 
                });
            }

            connection.query(dueSoonQuery, [facultyId], (err, dueSoonResults) => {
                if (err) {
                    return res.status(500).json({ 
                        error: "Error fetching due soon stats", 
                        details: err.message 
                    });
                }

                connection.query(currentBooksQuery, [facultyId], (err, currentBooks) => {
                    if (err) {
                        return res.status(500).json({ 
                            error: "Error fetching current books", 
                            details: err.message 
                        });
                    }

                    // Get recommended books (random selection of available books)
                    const recommendedQuery = `
                        SELECT sno, title, author, availableCopies 
                        FROM books 
                        WHERE availableCopies > 0 
                        ORDER BY RAND() 
                        LIMIT 4
                    `;

                    connection.query(recommendedQuery, (err, recommendedBooks) => {
                        if (err) {
                            return res.status(500).json({ 
                                error: "Error fetching recommended books", 
                                details: err.message 
                            });
                        }

                        // Format response
                        const stats = {
                            totalBorrowed: borrowedResults[0].totalBorrowed || 0,
                            dueSoon: dueSoonResults[0].dueSoon || 0,
                            currentBooks: currentBooks || [],
                            recommendedBooks: recommendedBooks || []
                        };

                        res.status(200).json({
                            success: true,
                            stats,
                            message: "Faculty stats fetched successfully"
                        });
                    });
                });
            });
        });

    } catch (error) {
        console.error("Error in faculty stats controller:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
};

module.exports = facultyStats;
