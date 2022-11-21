const submitAbsen = async (req, res, service) => {
    const data = req.body;
    let result;
    try {
        if (data[0]) {
            result = await service.submitAbsensiList(data);
        } else {
            result = await service.submitAbsensiOne(data);
        }
        res.status(200);
        res.json(result);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

module.exports = { submitAbsen }
