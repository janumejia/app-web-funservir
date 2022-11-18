const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const pathStorage = `${__dirname}/../storage`;
        cb(null, pathStorage);
    },
    filename: function(req, file, cb){
        const ext = file.originalname.split(".").pop();
        const filename = `file-${Date.now()}.${ext}`; //Mirar como se puede guardar el archivo dependiendo del nombre del elemento que se esté editando
        cb(null, filename);
    },
});

const uploadMiddleware = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            req.fileValidationError = "Forbidden extension";
            return callback(null, false, req.fileValidationError);
        }
        callback(null, true);
    },
    limits:{
        fileSize: 1024 * 1024 //Validar si permitiremos cualquier dimensión y aplicamos css o restringimos.
    }
})

module.exports = uploadMiddleware;