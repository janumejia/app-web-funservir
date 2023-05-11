const InclusiveSites = require("../../../model/site")

const siteNotification = (req, res) => {

    InclusiveSites.count(
        {
            status: {
                $eq: "Pendiente",
            },
        },
        function (err, count) {
            if (!err) {
                res.status(200).json(count);
            }else{
                throw Error("Something bad happened");
            }
          }
        );
}

module.exports = siteNotification