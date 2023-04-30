const Elements = require("../../../model/inclusiveElements.js");

const getInclusiveElements = async (req,res) => {
    
    Elements.find({}).then((elements)=>{
        if(elements){
            res.json(elements);
        }else{
            res.json({ message: "Error"});
        }
    })
}

module.exports = getInclusiveElements