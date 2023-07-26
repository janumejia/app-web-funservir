const Comment = require("../../../../../model/comments");
const InclusiveSites = require("../../../../model/site");
const User = require("../../../../model/user");
const { ObjectId } = require('mongodb');

const addComment = async (req, res) =>{

    const { ...inputs } = req.body;
    const decodedDataInToken = req.decodedDataInToken;
    
    const newComment = new Comment({
        siteId: ObjectId(decodedDataInToken._id),
        userId: ObjectId(decodedDataInToken._id)

    })
}
