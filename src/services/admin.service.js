const logEvent = require('../events/myEmitter');
const sequelize = require('../../config/dbConn');
const bcrypt = require('bcryptjs');
const adminInclude = () => {
    return [
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
}

class AdminService {
    constructor(admin, personalInfo, contactInfo, workInfo, address) {
        this.admin = admin;
        this.personalInfo = personalInfo;
        this.contactInfo = contactInfo;
        this.workInfo = workInfo;
        this.address = address;
    }

    async getAllInfo() {
        let result;
        try {
            result = await this.admin.findAll({
                attributes: { exclude: ['userPassword', 'createdAt', 'updatedAt', 'deletedAt'] },
                include: adminInclude()
            });
            console.log("lewat")
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-ADMIN-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async getInfoByAdminId(id) {
        let result;
        try {
            result = await this.admin.findByPk(id, {
                attributes: { exclude: ['userPassword', 'createdAt', 'updatedAt', 'deletedAt'] },
                include: adminInclude()
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-ADMIN-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async addNewAdmin(data) {
        const trx = await sequelize.transaction();
        let newAdmin;
        try {
            const passwordHash = bcrypt.hashSync(data.userPassword, 8)
            newAdmin = await this.admin.create({ userName: data.userName, userPassword: passwordHash }, { transaction: trx });
            let personalInfo = await this.personalInfo.create(data.personalInfo, { transaction: trx });
            let contactInfo = await this.contactInfo.create(data.contactInfo, { transaction: trx });
            let workInfo = await this.workInfo.create(data.workInfo, { transaction: trx });
            let address = await this.address.create(data.personalInfo.address, { transaction: trx });

            newAdmin.setPersonalInfo(personalInfo);
            newAdmin.setContactInfo(contactInfo);
            newAdmin.setWorkInfo(workInfo);
            personalInfo.setAddress(address);
            trx.commit();
        } catch (e) {
            await trx.rollback();
            logEvent.emit('APP-ERROR', {
                logTitle: 'POST-ADMIN-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return newAdmin;
    }
}

module.exports = AdminService;
