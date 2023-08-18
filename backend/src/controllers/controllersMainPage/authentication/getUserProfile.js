const UserInfo = require("../../../model/user");

const getUserProfileInfo = async (req, res) => {
  const userId = req.params.userId;
  const query = { _id: userId };
  try {
    let doc = await UserInfo.findOne(query).populate({ path: 'associatedSites', populate: { path: 'inclusiveElements', model: 'InclusiveElements' } }).select('-password -email -gender -isCaregiver -userType -__v -dateOfBirth -condition -address -institution');

    if (!doc) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: "Error" })
  }
}

module.exports = getUserProfileInfo
