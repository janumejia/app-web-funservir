const InclusiveSites = require("../../../model/site")

const getInclusiveSites = async (req, res) => {
    
    InclusiveSites.find({}).then((elements)=>{
        if(elements){
            res.status(200).json(elements)
        }else{
            res.status(500).json({ message: "Error"})
        }
    })
}

module.exports = getInclusiveSites