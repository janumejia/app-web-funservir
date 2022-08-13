const Categories = require("../../model/categories");

const getCategories = async (req, res) => {
    
    Categories.find({}).then((elements)=>{
        if(elements){
            res.json(elements)
        }else{
            res.json({ message: "Error"})
        }
    })
}

module.exports = getCategories