const userAuthentication = async (req, res, service) => {
    const email = req.query.email;
    const body = req.body;
    let user;
    try {
        if (email) {
            user = await service.authMobile(email, body.img);
        } else {
            user = await service.authWeb(body);
        }

        if (user) {
            res.status(200);
            res.json(user);
        } else {
            res.status(401);
            res.json({
                message: "Unauthorized"
            })
        }
    } catch (e) {
        res.status(500);
        res.json(e.message)
    }
};

module.exports = { userAuthentication };
