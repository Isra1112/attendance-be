const getAttendance = async (req, res, service) => {
    let result;
    let tanggal = req.query.tanggal;
    let id = req.query.id;
    try {
        if (tanggal && id) {
            result = await service.getAbsensiByEmployeeIdAndDate(id, tanggal);
        } else if (tanggal) {
            result = await service.getListAbsensiByDate(tanggal);
        } else if (id) {
            result = await service.getListAbsensiByEmployeeId(id);
        } else if (req.query.name) {
            result = await service.getListAbsensiByEmployeeName(req.query.name);
        } else {
            result = await service.getAllList();
        }
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

const postReport = async (req, res, service) => {
    let result;
    try {
        result = await service.report(req.body);
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

module.exports = { getAttendance,postReport }
