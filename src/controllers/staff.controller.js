const getStaffInfo = async (req, res, service) => {
    try {
        let result;
        const id = req.query.id;
        if (id) {
            result = await service.getInfoById(id);
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

const addStaff = async (req, res, service) => {
    let result;
    const data = req.body;
    try {
        result = await service.addNewStaff(data);
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

const updateStaff = async (req, res, service) => {
    let result;
    const id = req.query.id;
    const data = req.body;
    try {
        result = await service.updateStaff(id, data);
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

const deleteStaff = async (req, res, service) => {
    const id = req.query.id;
    try {
        let result = await service.deleteAStaff(id);
        res.status(200);
        res.json(result)
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}
module.exports = { getStaffInfo, addStaff, updateStaff, deleteStaff };
