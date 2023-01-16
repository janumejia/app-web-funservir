const Users = require("../../../model/user");

const allUsers = async (req,res) => {
    
    Users.find({}).then((users)=>{
        if(users){
            res.json(users)
        }else{
            res.json({ message: "Error"})
        }
    })
}

module.exports = allUsers