const Neighborhoods = require("../../../model/neighborhoods");

const getNeighborhoods = async (req, res) => {
    
    Neighborhoods.find({}).then((elements)=>{
        if(elements){
            res.json(elements)
        }else{
            res.json({ message: "Error"})
        }
    })
}

module.exports = getNeighborhoods