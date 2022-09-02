const Categories = require("../../model/user");

const allUsers = async (req,res) => {
    
    Categories.find({}).then((users)=>{
        if(users){
            res.json(users)
        }else{
            res.json({ message: "Error"})
        }
    })
}

module.exports = allUsers