const logout = async (req, res) => {
    res.clearCookie("AWFS-token");
    res.json({ success: "true" });

}

module.exports = logout