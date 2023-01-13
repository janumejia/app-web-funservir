require('dotenv').config({ path: '.env' })
const User = require("../../model/user")
const bcrypt = require("bcryptjs")
const editUser = async (req, res) => {

    const { _id, ...resto } = req.body;
    const query = { _id: _id };
    let doc = await User.findOne(query);
    if (doc.password !== resto.password) {
        bcrypt.hash(resto.password, parseInt(process.env.SALT_BCRYPT), async (error, hashPassword) => { // Genera el hash de la contraseña ingresada
            if (error) res.json({ error })
            else {
                doc.name = resto.name;
                doc.lastName = resto.lastName;
                doc.email = resto.email;
                doc.password = hashPassword;
                doc.age = resto.age;
                doc.gender = resto.gender;
                doc.address = resto.address;
                doc.condition = resto.condition;
                doc.isCaregiver = resto.isCaregiver;
                doc.institution = resto.institution;
                doc.userType = resto.userType;
                await doc.save();
            }
        })
    } else {
        doc.name = resto.name;
        doc.lastName = resto.lastName;
        doc.email = resto.email;
        doc.age = resto.age;
        doc.gender = resto.gender;
        doc.address = resto.address;
        doc.condition = resto.condition;
        doc.isCaregiver = resto.isCaregiver;
        doc.institution = resto.institution;
        doc.userType = resto.userType;
        await doc.save();
    }
res.json(doc);
}

module.exports = editUser