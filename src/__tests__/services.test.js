const bcrypt = require('bcryptjs');
const axios = require('axios');
const sequelize = require('sequelize');

const EmployeeService = require('../services/employee.service');
const StaffService = require('../services/staff.service');
const ScanService = require('../services/scan.service');
const ListAbsenService = require('../services/list.absen.service');
const SubmitAbsenService = require('../services/submit.absen.service');
const AuthService = require('../services/auth.service');
const AdminService = require('../services/admin.service');

const Employee = require('../models/employee.model');
const Attendance = require('../models/attendance.model');
const Staff = require('../models/staff.model');
const Admin = require('../models/admin.model');
const PersonalInfo = require('../models/personal.info.model');
const ContactInfo = require('../models/contact.info.model');
const WorkInfo = require('../models/work.info.model');
const Address = require('../models/address.model');

let employeeService;
let staffService;
let scanService;
let adminService;
let listAbsenService;
let submitAbsenService;
let authService;

let employee;
let attendance;
let staff;
let admin;
let personalInfo;
let contactInfo;
let workInfo;
let address;

let user;
let format;

describe('Services Testing', () => {
    beforeAll(() => {
        employee = new Employee;
        staff = new Staff;
        attendance = new Attendance;
        staff = new Staff;
        admin = new Admin;
        personalInfo = new PersonalInfo;
        contactInfo = new ContactInfo;
        workInfo = new WorkInfo;
        address = new Address;

        employeeService = new EmployeeService(employee, null, null, null, null, null);
        staffService = new StaffService(staff, null, null, null, null);
        scanService = new ScanService(employee);
        listAbsenService = new ListAbsenService(employee, attendance);
        submitAbsenService = new SubmitAbsenService(attendance);
        authService = new AuthService(staff, personalInfo, null, null, null, admin);
        adminService = new AdminService(admin, personalInfo, contactInfo, workInfo, address)
    });
    describe('Employee Service Testing', () => {
        it('should have an error message when findAll failed', async () => {
            employee.findAll = jest.fn(() => {
                throw new Error(`Something's Wrong`);
            });
            try {
                await employeeService.getAllInformation();
            } catch (e) {
                message = e.message;
            }
            expect(message).toEqual(`Error: Something's Wrong`);
            expect(employee.findAll).toBeCalledTimes(1);
        });

        it('should return result when getInformationById service success', async () => {
            employee.findByPk = jest.fn(() => {
                return true;
            });
            const result = await employeeService.getInformationById();
            expect(result).toBeTruthy();
            expect(employee.findByPk).toBeCalledTimes(1);
        });

        it('should throw error when getInformationById service failed', async () => {
            employee.findByPk = jest.fn(() => {
                throw new Error("Something is wrong");
            });

            try {
                await employeeService.getInformationById();
            } catch (e) {
                message = e.message
            }

            expect(message).toEqual("Error: Something is wrong");
            expect(employee.findByPk).toBeCalledTimes(1);
        });

        it('should return result when getInformationByName service success', async () => {
            employee.findAll = jest.fn(() => {
                return true;
            });
            const result = await employeeService.getInformationByName();
            expect(result).toBeTruthy();
            expect(employee.findAll).toBeCalledTimes(1);
        });

        it('should throw error when getInformationByName service failed', async () => {
            employee.findAll = jest.fn(() => {
                throw new Error("Failed");
            });
            try {
                await employeeService.getInformationByName();
            } catch (e) {
                message = e.message
            }
            expect(message).toEqual('Error: Failed');
            expect(employee.findAll).toBeCalledTimes(1);
        });
    });
    describe('Staff Service Testing', () => {
        it('should have an error message when findAll failed', async () => {
            staff.findAll = jest.fn(() => {
                throw new Error(`Something's Wrong`);
            });
            try {
                await staffService.getAllInfo();
            } catch (e) {
                message = e.message;
            }
            expect(message).toEqual(`Error: Something's Wrong`);
            expect(staff.findAll).toBeCalledTimes(1);
        });

        it('should return result when getInformationById service success', async () => {
            staff.findByPk = jest.fn(() => {
                return true;
            });
            const result = await staffService.getInfoById();
            expect(result).toBeTruthy();
            expect(staff.findByPk).toBeCalledTimes(1);
        });
    });
    describe('ListAbsenService Testing', () => {
        it('should return result when getListAbsensi service success', async () => {
            attendance.findAll = jest.fn(() => {
                return true;
            });
            const result = await listAbsenService.getListAbsensiByDate();
            expect(result).toBeTruthy();
            expect(attendance.findAll).toBeCalledTimes(1);
        });

        it('should return result when getAbsensiByIdAndDate service success', async () => {
            attendance.findOne = jest.fn(() => {
                return true;
            });
            const result = await listAbsenService.getAbsensiByEmployeeIdAndDate();
            expect(result).toBeTruthy();
            expect(attendance.findOne).toBeCalledTimes(1);
        });

        it('should throw error when getAbsensiByIdAndDate service failed', async () => {
            attendance.findOne = jest.fn(() => {
                throw new Error("Service Failed");
            });
            try {
                await listAbsenService.getAbsensiByEmployeeIdAndDate();
            } catch (e) {
                message = e.message
            }
            expect(message).toEqual("Error: Service Failed");
            expect(attendance.findOne).toBeCalledTimes(1);
        });
    });
    describe('SubmitAbsenService Testing', () => {
        beforeAll(() => {
            format = {
                single: {
                    "jam": "10:00:00"
                },
                list: [
                    {
                        "jam": "10:00:00"
                    },
                    {
                        "jam": "07:00:00"
                    }
                ]
            }
        });
        it('should calling attendance.update once when submitAbsenOne(attend out) success', async () => {
            attendance.findOne = jest.fn(() => {
                return { "jamMasuk": "08:00:00" };
            });
            attendance.update = jest.fn(() => {
                return true;
            })
            await submitAbsenService.submitAbsensiOne(format.single);
            expect(attendance.update).toBeCalledTimes(1);
            expect(attendance.findOne).toBeCalledTimes(1);
        });

        it('should throw error when submitAbsenOne failed', async () => {
            attendance.findOne = jest.fn(() => {
                return null
            });
            attendance.create = jest.fn(() => {
                throw new Error("There's something wrong")
            })
            try {
                await submitAbsenService.submitAbsensiOne(format.single);
            } catch (e) {
                message = e.message
            }
            expect(attendance.update).toBeCalledTimes(1);
            expect(attendance.findOne).toBeCalledTimes(1);
            expect(message).toEqual("Error: There's something wrong");
        });

        it('should call attendance.findOne equal to the length of req.body when submitAbsensiList success', async () => {
            attendance.findOne = jest.fn(() => {
                return { "jamMasuk": "08:00:00" };
            });
            attendance.update = jest.fn(() => {
                return true;
            });
            attendance.create = jest.fn(() => {
                return true;
            });
            await submitAbsenService.submitAbsensiList(format.list);
            expect(attendance.update).toBeCalledTimes(1);
            expect(attendance.findOne).toBeCalledTimes(2);
        });

        it('should throw error when submitAbsensiList failed', async () => {
            attendance.findOne = jest.fn(() => {
                return null
            });
            attendance.create = jest.fn(() => {
                throw new Error("There's something wrong with request format")
            })
            try {
                await submitAbsenService.submitAbsensiList(format.list);
            } catch (e) {
                message = e.message
            }
            expect(attendance.update).toBeCalledTimes(1);
            expect(attendance.findOne).toBeCalledTimes(1);
            expect(message).toEqual("Error: There's something wrong with request format");
        });
    });

    describe('AuthService Testing', () => {
        beforeAll(() => {
            user = {
                userName: "user01",
                userPassword: "pass01"
            }
        });

        it('should return data and token when authMobile service success', async () => {
            staff.findOne = jest.fn(() => {
                return true;
            });
            personalInfo.findByPk = jest.fn(() => {
                return {
                    photo: "ada"
                }
            })
            bcrypt.compareSync = jest.fn(() => {
                return true;
            })
            axios.post = jest.fn(() => {
                return {
                    data: {
                        result: "tokenForAccess"
                    }
                }
            })
            const data = await authService.authMobile();
            expect(staff.findOne).toBeCalledTimes(2);
            expect(data).toBeTruthy();
        });

        it('should throw error when authMobile service failed', async () => {
            staff.findOne = jest.fn(() => {
                throw new Error('Something is wrong');
            });
            try {
                await authService.authMobile();
            } catch (e) {
                message = e.message
            }
            expect(staff.findOne).toBeCalledTimes(1);
            expect(message).toEqual('Error: Something is wrong');
        });
    });

    describe('Admin Service Testing', () => {
        it('should throw error when admin.findAll failed', async () => {
            admin.findByPk = jest.fn(() => {
                throw new Error(`Something's Not Quite Right`);
            });
            try {
                await adminService.getInfoByAdminId();
            } catch (e) {
                message = e.message;
            }
            expect(message).toEqual(`Error: Something's Not Quite Right`);
            expect(admin.findByPk).toBeCalledTimes(1);
        });

        it('should return result when getAllInfo service success', async () => {
            admin.findByPk = jest.fn(() => {
                return true;
            });
            const result = await adminService.getInfoByAdminId();
            expect(result).toBeTruthy();
            expect(admin.findByPk).toBeCalledTimes(1);
        });

        it('should throw error when workInfo.create failed', async () => {
            admin.create = jest.fn(() => {
                return true;
            });
            personalInfo.create = jest.fn(() => {
                return true;
            });
            contactInfo.create = jest.fn(() => {
                return true;
            });
            workInfo.create = jest.fn(() => {
                throw new Error("Validation Problem");
            });

            try {
                await adminService.addNewAdmin({ userName: "halo", userPassword: "halooo" });
            } catch (e) {
                message = e.message;
            }
            expect(message).toEqual(`Error: Validation Problem`);
            expect(admin.create).toBeCalledTimes(1);
            expect(personalInfo.create).toBeCalledTimes(1);
            expect(contactInfo.create).toBeCalledTimes(1);
            expect(workInfo.create).toBeCalledTimes(1);
        });
    });
});
