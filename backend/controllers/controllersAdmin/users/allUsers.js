const Users = require("../../../model/user");

const allUsers = async (req,res) => {
    
    Users.find({}).populate('associatedSites', {name:1, _id:0}).then((users)=>{
        if(users){
            res.json(users)
        }else{
            res.json({ message: "Error"})
        }
    })
}

module.exports = allUsers