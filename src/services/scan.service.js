const logEvent = require('../events/myEmitter');

class ScanService {
    constructor(employee, personalInfo, contactInfo, workInfo, address) {
        this.employee = employee;
        this.personalInfo = personalInfo;
        this.contactInfo = contactInfo;
        this.workInfo = workInfo;
        this.address = address;
    }

    async getInformationByScanNFC(id) {
        let result;
        try {
            result = await this.employee.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: this.personalInfo,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                        include: [
                            {
                                model: this.address,
                                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                            }
                        ]
                    },
                    {
                        model: this.contactInfo,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                    },
                    {
                        model: this.workInfo,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                        where: { nfcId: id }
                    },
                ]
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-EMPLOYEE-SCAN-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async getInformationByScanQR(id) {
        let result;
        try {
            result = await this.employee.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: this.personalInfo,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                        include: [
                            {
                                model: this.address,
                                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                            }
                        ]
                    },
                    {
                        model: this.contactInfo,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                    },
                    {
                        model: this.workInfo,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                        where: { qrId: id }
                    },
                ]
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-EMPLOYEE-SCAN-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }
}

module.exports = ScanService;
