const InclusiveElement = require("../../model/inclusiveElements");
const fs = require('fs');
const path = require('path');
const addInclusiveElement = async (req, res, next) => {
    const {body, file} = req
    if (req.fileValidationError) {
       return res.json({message: "Inserte una imagen valida"}); 
    }
    InclusiveElement.findOne({body}).then((element)=>{
        if(!element){
            const obj = {
                name: body.name,
                img: {
                    data: fs.readFileSync(path.join(__dirname,'..','..','storage', file.filename)),
                    contentType: 'image/png'
                }
            }
            InclusiveElement.create(obj, (err, item) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.json({ message: "Elemento creado correctamente", item})
                }
            });
        }else{
            res.json({ message: "Error"})
        }
    })
}

module.exports = addInclusiveElement