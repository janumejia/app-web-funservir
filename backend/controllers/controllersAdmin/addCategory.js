const Categories = require("../../model/categories");

const addCategory = async (req, res) => {

    const {name} = req.body;
    Categories.findOne({name}).then((element)=>{
        if(!element){
            if(name){
                const newCategory = new Categories({
                    name
                })
                newCategory.save().then((element) => { // Si todo sale bien...
                    res.json({ message: "Categoría creada correctamente", element})
                })
                .catch((error) => console.error(error))
            }
        }else{
            res.json({ message: "Error"})
        }
    })
}

module.exports = addCategory