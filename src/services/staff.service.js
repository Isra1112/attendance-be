const logEvent = require('../events/myEmitter');
const sequelize = require('../../config/dbConn');

class StaffService {
    constructor(staff, personalInfo, contactInfo, workInfo, address) {
        this.staff = staff;
        this.personalInfo = personalInfo;
        this.contactInfo = contactInfo;
        this.workInfo = workInfo;
        this.address = address;
    }

    async getAllInfo() {
        let result;
        try {
            result = await this.staff.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: this.personalInfo,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                        include: [
                            {
                                model: this.address,
                                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                            }
                        ]
                    },
                    {
                        model: this.contactInfo,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },

                    },
                    {
                        model: this.workInfo,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    }
                ]
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-STAFF-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async getInfoById(id) {
        let result;
        try {
            result = await this.staff.findByPk(id, {
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
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: this.workInfo,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    }
                ]
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-STAFF-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async addNewStaff(data) {
        const trx = await sequelize.transaction();
        let newStaff;
        try {
            newStaff = await this.staff.create({}, { transaction: trx });
            let personalInfo = await this.personalInfo.create(data.personalInfo, { transaction: trx });
            let contactInfo = await this.contactInfo.create(data.contactInfo, { transaction: trx });
            let workInfo = await this.workInfo.create(data.workInfo, { transaction: trx });
            let address = await this.address.create(data.personalInfo.address, { transaction: trx });

            newStaff.setPersonalInfo(personalInfo);
            newStaff.setContactInfo(contactInfo);
            newStaff.setWorkInfo(workInfo);
            personalInfo.setAddress(address);

            trx.commit();
        } catch (e) {
            await trx.rollback();
            logEvent.emit('APP-ERROR', {
                logTitle: 'POST-STAFF-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return newStaff;
    }

    async updateStaff(id, data) {
        let result;
        let personalId;
        let contactId;
        let workId;
        let addressId;

        const staff = await this.staff.findByPk(id, { include: [{ model: this.personalInfo, attributes: ['addressId'] }] });
        if (staff) {
            personalId = staff.personalInfoId;
            contactId = staff.contactInfoId;
            workId = staff.workInfoId;
            if (personalId) {
                addressId = staff.personalInfo.addressId;
            }

            const trx = await sequelize.transaction();
            try {
                if (data.personalInfo) {
                    await this.personalInfo.update(data.personalInfo, { where: { id: personalId }, transaction: trx });

                    if (data.personalInfo.address) {
                        await this.address.update(data.personalInfo.address, { where: { id: addressId }, transaction: trx });
                    }
                }

                if (data.contactInfo) {
                    await this.contactInfo.update(data.contactInfo, { where: { id: contactId }, transaction: trx, });
                }

                if (data.workInfo) {
                    await this.workInfo.update(data.workInfo, { where: { id: workId }, transaction: trx });
                }

                let notify = { id: id }
                await this.staff.update(notify, { where: { id: id } });

                result = { message: "Update Staff Success" }
                await trx.commit();
            } catch (e) {
                await trx.rollback();
                logEvent.emit('APP-ERROR', {
                    logTitle: 'UPDATE-STAFF-SERVICE-FAILED',
                    logMessage: e
                });
                throw new Error(e);
            }
        } else {
            result = { message: "No Staff Found" }
        }
        return result;
    }

    async deleteAStaff(id) {
        let result;
        const staff = await this.staff.findByPk(id, {
            include: [
                {
                    model: this.personalInfo,
                    attributes: ['addressId']
                }
            ]
        });
        if (staff) {
            const trx = await sequelize.transaction();
            try {
                await this.address.destroy({ where: { id: staff.personalInfo.addressId }, transaction: trx });
                await this.workInfo.destroy({ where: { id: staff.workInfoId }, transaction: trx });
                await this.contactInfo.destroy({ where: { id: staff.contactInfoId }, transaction: trx });
                await this.personalInfo.destroy({ where: { id: staff.personalInfoId }, transaction: trx });
                await this.staff.destroy({ where: { id: id }, transaction: trx });
                result = { message: "Staff Has Been Removed" }
                await trx.commit();
            } catch (e) {
                trx.rollback();
                logEvent.emit('APP-ERROR', {
                    logTitle: 'DELETE-STAFF-SERVICE-FAILED',
                    logMessage: e
                });
                throw new Error(e);
            }
        } else {
            result = { message: "No Staff Found" }
        }
        return result;
    }
}

module.exports = StaffService;
