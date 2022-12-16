const Locations = require("../../../model/locations");

const getLocations = async (req, res) => {
    
    Locations.find({}).then((elements)=>{
        if(elements){
            res.json(elements)
        }else{
            res.json({ message: "Error"})
        }
    })
}

module.exports = getLocations