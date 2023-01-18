const Categories = require("../../../model/categories");
const { nameCategoryRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const addCategory = async (req, res) => {

    const {name} = req.body;

    /* Sanitización entradas */
    // 1) Validar el tipo de dato
    if(typeof(name) !== 'string') return res.status(422).json({ message: "Tipo de dato de nombre no es válido" });
    
    // 2) Validar si cumple con los caracteres permitidos
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