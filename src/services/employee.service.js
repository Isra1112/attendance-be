const logEvent = require('../events/myEmitter');
const sequelize = require('../../config/dbConn');
const { Op } = require('sequelize');
const dateFormat = require('dateformat');

const PersonalInfo = require('../models/personal.info.model');
const ContactInfo = require('../models/contact.info.model');
const WorkInfo = require('../models/work.info.model');
const Address = require('../models/address.model');



const employeeInclude = () => {
    return [
        {
            model: PersonalInfo,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: [
                {
                    model: Address,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                }
            ]
        },
        {
            model: ContactInfo,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        },
        {
            model: WorkInfo,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        }
    ]
}

class EmployeeService {
    constructor(employee, personalInfo, contactInfo, workInfo, address, history) {
        this.employee = employee;
        this.personalInfo = personalInfo;
        this.contactInfo = contactInfo;
        this.workInfo = workInfo;
        this.address = address;
        this.history = history;
    }

    async getAllInformation() {
        
        
        let result;
        try {
            result = await this.employee.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: employeeInclude()
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-EMPLOYEE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async getInformationById(id) {
        let result;
        try {
            result = await this.employee.findByPk(id, {
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: employeeInclude()
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-EMPLOYEE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async getInformationByName(name) {
        let result;
        try {
            result = await this.employee.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: this.personalInfo,
                        where: {
                            name: { [Op.substring]: `${name}` }
                        },
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
                logTitle: 'GET-EMPLOYEE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async syncInformation(date, hour) {
        let result;
        try {
            result = await this.history.findAll({
                where: {
                    [Op.or]: [
                        {
                            date: { [Op.gt]: date },
                        },
                        {
                            [Op.and]: [
                                {
                                    date: date,
                                    hour: {
                                        [Op.gt]: hour
                                    }
                                }
                            ]
                        }
                    ]
                },
                include: [
                    {
                        model: this.employee,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                        include: employeeInclude()
                    }
                ]
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-EMPLOYEE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async addNewEmployee(data) {
        const trx = await sequelize.transaction();
        let newEmployee;
        try {
            newEmployee = await this.employee.create({}, { transaction: trx });
            let personalInfo = await this.personalInfo.create(data.personalInfo, { transaction: trx });
            let contactInfo = await this.contactInfo.create(data.contactInfo, { transaction: trx });
            let workInfo = await this.workInfo.create(data.workInfo, { transaction: trx });
            let address = await this.address.create(data.personalInfo.address, { transaction: trx });

            newEmployee.setPersonalInfo(personalInfo);
            newEmployee.setContactInfo(contactInfo);
            newEmployee.setWorkInfo(workInfo);
            personalInfo.setAddress(address);

            let history = await this.history.create({ status: "Post", date: dateFormat(new Date(), 'yyyy-mm-dd'), hour: dateFormat(new Date(), 'HH:MM:ss') }, { transaction: trx });

            history.setEmployee(newEmployee);
            trx.commit();
        } catch (e) {
            await trx.rollback();
            logEvent.emit('APP-ERROR', {
                logTitle: 'POST-EMPLOYEE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return newEmployee;
    }

    async updateEmployee(id, data) {
        let result;
        let personalId;
        let contactId;
        let workId;
        let addressId;

        const employee = await this.employee.findByPk(id, { include: [{ model: this.personalInfo, attributes: ['addressId'] }] });
        if (employee) {
            personalId = employee.personalInfoId;
            contactId = employee.contactInfoId;
            workId = employee.workInfoId;
            if (personalId) {
                addressId = employee.personalInfo.addressId;
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
                await this.employee.update(notify, { where: { id: id }, transaction: trx });

                let history = await this.history.create({ status: "Update", date: dateFormat(new Date(), 'yyyy-mm-dd'), hour: dateFormat(new Date(), 'hh:MM:ss') }, { transaction: trx });

                history.setEmployee(employee);
                result = { message: "Update Employee Success" }
                await trx.commit();
            } catch (e) {
                await trx.rollback();
                logEvent.emit('APP-ERROR', {
                    logTitle: 'UPDATE-EMPLOYEE-SERVICE-FAILED',
                    logMessage: e
                });
                throw new Error(e);
            }
        } else {
            result = { message: "No Employee Found" };
        }
        return result;
    }

    async deleteAnEmployee(id) {
        let result;
        const employee = await this.employee.findByPk(id, {
            include: [
                {
                    model: this.personalInfo,
                    attributes: ['addressId']
                }
            ]
        });
        if (employee) {
            const trx = await sequelize.transaction();
            try {
                await this.address.destroy({ where: { id: employee.personalInfo.addressId }, transaction: trx });
                await this.workInfo.destroy({ where: { id: employee.workInfoId }, transaction: trx });
                await this.contactInfo.destroy({ where: { id: employee.contactInfoId }, transaction: trx });
                await this.personalInfo.destroy({ where: { id: employee.personalInfoId }, transaction: trx });
                await this.employee.destroy({ where: { id: id }, transaction: trx });
                result = { message: "Employee Has Been Removed" }
                await trx.commit();
            } catch (e) {
                trx.rollback();
                logEvent.emit('APP-ERROR', {
                    logTitle: 'DELETE-EMPLOYEE-SERVICE-FAILED',
                    logMessage: e
                });
                throw new Error(e);
            }
        } else {
            result = { message: "No Employee Found" }
        }
        return result;
    }
}

module.exports = EmployeeService;
