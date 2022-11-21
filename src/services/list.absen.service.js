const logEvent = require('../events/myEmitter');
const { Op } = require('sequelize');

const Employee = require('../models/employee.model')
const PersonalInfo = require('../models/personal.info.model');
const ContactInfo = require('../models/contact.info.model');
const WorkInfo = require('../models/work.info.model');
const Address = require('../models/address.model');
const axios = require('axios');

const employeeInclude = function () {
    return [
        {
            model: Employee,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: [
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
        },
    ]
}

class ListAbsenService {
    constructor(employee, attendance, personalInfo, contactInfo, workInfo, address) {
        this.employee = employee;
        this.attendance = attendance;
        this.personalInfo = personalInfo;
        this.contactInfo = contactInfo;
        this.workInfo = workInfo;
        this.address = address;
    }

    async getAllList() {
        let result;
        try {
            result = await this.attendance.findAll({
                attributes: { exclude: ['employeeId'] },
                order: [['tanggal', 'ASC']],
                include: employeeInclude()
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-ATTENDANCE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async getListAbsensiByEmployeeId(id) {
        let result;
        try {
            result = await this.attendance.findAll({
                order: [['tanggal', 'ASC']],
                where:
                {
                    employeeId: id
                },
            })
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-ATTENDANCE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async getListAbsensiByDate(tanggal) {
        let result;
        try {
            result = await this.attendance.findAll({
                where:
                {
                    tanggal: tanggal
                },
                attributes: { exclude: ['employeeId'] },
                include: employeeInclude()
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-ATTENDANCE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async getAbsensiByEmployeeIdAndDate(id, tanggal) {
        let result;
        try {
            result = await this.attendance.findOne({
                where:
                {
                    tanggal: tanggal,
                    employeeId: id
                },
                attributes: { exclude: ['employeeId'] },
                include: employeeInclude()
            });
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-ATTENDANCE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async getListAbsensiByEmployeeName(name) {
        let result;
        try {
            result = await this.employee.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: this.personalInfo,
                        attributes: ['name', 'photo'],
                        where: { name: { [Op.substring]: `${name}` } }
                    },
                    {
                        model: this.workInfo,
                        attributes: ['qrId', 'nfcId']
                    },
                    {
                        model: this.attendance
                    }
                ]
            })
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-ATTENDANCE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }

    async report(body){
        let result;
        console.log(body)
        try {
            const tess = await axios.post('http://localhost:5170/api/GeneratePDF',body);
            
            result = tess.data
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-EMPLOYEE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }
}

module.exports = ListAbsenService;
