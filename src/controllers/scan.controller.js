const getInformation = async (req, res, service) => {
    let result;
    let type = req.params.type;
    let id = req.query.id;
    try {
        switch(type){
            case 'nfc':
                result = await service.getInformationByScanNFC(id);
                break;
            case 'qrcode':
                result = await service.getInformationByScanQR(id);
                break;
            default:
                throw new Error('Invalid ScanType');
        }
        
        if (result) {
            res.status(200);
            res.json(result);
        } else {
            res.status(404);
            res.json('ID Tidak Ditemukan')
        }
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

module.exports = { getInformation }
