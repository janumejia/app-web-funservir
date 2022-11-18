const Elements = require("../../model/inclusiveElements.js");

const getInclusiveElements = async (req,res) => {
    
    Elements.find({}).then((elements)=>{
        if(elements){
            res.json({imagesPage: elements });
            console.log(elements);
        }else{
            res.json({ message: "Error"});
        }
    })
}

module.exports = getInclusiveElements