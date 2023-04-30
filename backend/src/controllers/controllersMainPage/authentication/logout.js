const logout = async (req, res) => {
    res.clearCookie("AWFS-token");
    res.json({ message: "Has cerrado sesión correctamente." });
}

module.exports = logout