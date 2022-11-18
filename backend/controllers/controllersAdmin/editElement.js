require('dotenv').config({ path: '.env' })
const Elements = require("../../model/inclusiveElements.js");
const editElement = async (req, res) => {

    const { _id, ...resto } = req.body;
    const query = { _id: _id };
    const update = {
        name: resto.name,
        desc: resto.desc,
    }
    await Elements.findByIdAndUpdate(query, update);
    let ans = await Elements.findOne(query);
    res.json(ans);
}

module.exports = editElement