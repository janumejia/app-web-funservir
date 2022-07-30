const User = require("../../model/user")

const editUser = async (req, res) => { //En la primera versión se mandará el usuario a editar, cuando esté el front, esto puede que cambie.

    const {_id, ...resto} = req.body;
    const query = {_id : _id};
    const update = {
        name: resto.name,
        email: resto.email,
        password: resto.password,
        edad: resto.edad,
        sexo: resto.sexo,
        direccion: resto.direccion,
        tutor: resto.tutor,
        fundacion: resto.fundacion,
        userType: resto.userType
    }
    await User.findOneAndUpdate(query, update);
    let ans = await User.findOne(query);
    res.json(ans);
}

module.exports = editUser