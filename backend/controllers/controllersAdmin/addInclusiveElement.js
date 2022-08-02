const InclusiveElement = require("../../model/inclusiveElements");

const addInclusiveElement = async (req, res) => {

    const {name, desc} = req.body;
    InclusiveElement.findOne({name}).then((element)=>{
        if(!element){
            if(name && desc){
                const newElement = new InclusiveElement({
                    name,
                    desc
                })
                newElement.save().then((element) => { // Si todo sale bien...
                    res.json({ message: "Elemento creado correctamente", element})
                })
                .catch((error) => console.error(error))
            }
        }else{
            res.json({ message: "Error"})
        }
    })
}

module.exports = addInclusiveElement