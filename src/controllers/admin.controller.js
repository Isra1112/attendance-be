const getAdminInfo = async (req, res, service) => {
    try {
        let result;
        const id = req.query.id;
        if (id) {
            result = await service.getInfoByAdminId(id);
        } else {
            result = await service.getAllInfo();
        }
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

const addAdmin = async (req, res, service) => {
    let result;
    const data = req.body;
    try {
        result = await service.addNewAdmin(data);
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

module.exports = { getAdminInfo, addAdmin };
