const Categories = require("../../../model/categories");
const { nameCategoryRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const addCategory = async (req, res) => {

    const {name} = req.body;

    /* Sanitización entradas */
    const isValidName = nameCategoryRegex.test(name);

    if(isValidName === false) return res.json({ message: "Formato de nombre no es válido" }); // Caso malo
    /* Fin sanitización entradas */

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