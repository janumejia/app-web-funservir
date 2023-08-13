const Comments = require("../../../model/comments.js");

const getReportedComments = async (req, res) => {
    try {
        const reportedComments = await Comments.find({ isReported: true })
            .populate('reportedBy', { name: 1, lastName: 1, _id: 1, email: 1 })
            .populate('userId', { name: 1, lastName: 1, _id: 1, email: 1 }) // Populate userId
            .populate('siteId', 'name') // Populate siteId with only the 'name' field
            .exec(); // Execute the population

        res.json(reportedComments);
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
};

module.exports = getReportedComments;
