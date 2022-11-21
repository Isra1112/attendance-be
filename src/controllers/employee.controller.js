const getEmployeeInformation = async (req, res, service) => {
    try {
        const query = req.query
        let result;
        if (query.date && query.hour) {
            result = await service.syncInformation(query.date, query.hour);
        } else if (query.id) {
            result = await service.getInformationById(query.id);
        } else if (query.name) {
            result = await service.getInformationByName(query.name);
        } else {
            result = await service.getAllInformation();
        }
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

const addEmployee = async (req, res, service) => {
    let result;
    let data = req.body;
    try {
        result = await service.addNewEmployee(data);
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

const updateEmployee = async (req, res, service) => {
    let result;
    let id = req.query.id;
    let data = req.body;
    try {
        result = await service.updateEmployee(id, data);
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

const deleteEmployee = async (req, res, service) => {
    let id = req.query.id;
    let result;
    try {
        result = await service.deleteAnEmployee(id);
        res.status(200);
        res.json(result)
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}
module.exports = { getEmployeeInformation, addEmployee, updateEmployee, deleteEmployee };
