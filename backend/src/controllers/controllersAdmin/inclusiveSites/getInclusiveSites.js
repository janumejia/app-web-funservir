const InclusiveSites = require("../../../model/site")

const getInclusiveSites = async (req, res) => {
    
    InclusiveSites.find({}).populate('owner', {name:1, lastName:1, _id:1}).populate('inclusiveElements').then((elements)=>{
        if(elements){
            res.status(200).json(elements)
        }else{
            res.status(500).json({ message: "Error"})
        }
    })
}

module.exports = getInclusiveSites