const request = require('supertest');
const server = require('../server');
const connection = require('../../config/dbConn');
const dbAssociation = require('../models/index');
const Staff = require('../models/staff.model');
const Employee = require('../models/employee.model');
const PersonalInfo = require('../models/personal.info.model');
const ContactInfo = require('../models/contact.info.model');
const WorkInfo = require('../models/work.info.model');
const Address = require('../models/address.model');
const Attendance = require('../models/attendance.model');
const Admin = require('../models/admin.model');
const bcrypt = require('bcryptjs');
const axios = require('axios');

let token;

async function loginEmail() {
    axios.post = jest.fn(() => {
        return {
            data: {
                result: "tokenForAccess"
            }
        }
    })
    const res = await request(server)
        .post('/auth?email=staff@gmail.com')
        .send({
            photo: "http://img.com"
        })
    return res.body;
}

async function initDb() {
    dbAssociation();
    await connection.sync({ force: true })

    const admin = await Admin.create(
        {
            id: "adminIdTest"
        }
    );
    let personalInfo03 = await PersonalInfo.create({
        name: "admin dummy",
        gender: "Laki-Laki",
        birthDate: "1999-12-31",
        birthPlace: "dummyLocation",
        bloodType: "O"
    });
    let contactInfo03 = await ContactInfo.create({
        email: "admin@gmail.com"
    });
    admin.setPersonalInfo(personalInfo03);
    admin.setContactInfo(contactInfo03);

    const staff = await Staff.create(
        {
            id: "staffIdTest"
        }
    );
    let personalInfo01 = await PersonalInfo.create({
        name: "staff dummy",
        gender: "Laki-Laki",
        birthDate: "1999-12-31",
        birthPlace: "dummyLocation",
        bloodType: "O"
    });
    let contactInfo01 = await ContactInfo.create({
        email: "staff@gmail.com"
    });
    staff.setPersonalInfo(personalInfo01);
    staff.setContactInfo(contactInfo01);

    const employee = await Employee.create({
        id: "employeeId"
    });
    let personalInfo02 = await PersonalInfo.create({
        name: "employee dummy",
        gender: "Laki-Laki",
        birthDate: "2000-01-01",
        birthPlace: "dummyLocation",
    });
    let contactInfo02 = await ContactInfo.create({
        email: "employee@dummy.com"
    })
    let workInfo02 = await WorkInfo.create({
        qrId: "1",
        nfcId: "1"
    });
    let address02 = await Address.create({});
    employee.setPersonalInfo(personalInfo02);
    employee.setContactInfo(contactInfo02);
    employee.setWorkInfo(workInfo02);
    personalInfo02.setAddress(address02);

    await Attendance.create({ tanggal: "2020-04-12", jamMasuk: "07:15:20", jamKeluar: "18:02:33", employeeId: "employeeId" });
    await Attendance.create({ tanggal: "2020-04-13", jamMasuk: "07:00:41", jamKeluar: "17:55:24", employeeId: "employeeId" });
}

describe('Route Testing', () => {
    beforeEach(async (done) => {
        await initDb();
        const dataLogin = await loginEmail();
        token = dataLogin.token

        done();
    });

    describe('Employee Route Testing', () => {
        it('should not get all employee data when no token', async () => {
            const res = await request(server)
                .get('/employee')
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual({});
        });

        it('should get all employee data when have token', async () => {
            axios.get = jest.fn(() => {
                return {
                    data: {
                        status: "Token Valid"
                    }
                }
            });
            const res = await request(server)
                .get('/employee')
                .set('Authorization', 'Bearer ' + token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0)
        });

        it('should post a new employee data when have token', async () => {
            const res = await request(server)
                .post('/employee')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "personalInfo": {
                        "photo": null,
                        "name": "Dummy Employee",
                        "gender": "Laki-Laki",
                        "birthPlace": "Dummy Birthplace",
                        "birthDate": "2000-04-30",
                        "bloodType": "AB",
                        "address": {
                            "village": "Dummy Village",
                            "street": "Dummy Street",
                            "district": "Dummy District",
                            "province": "Dummy Province"
                        }
                    },
                    "contactInfo": {
                        "phoneNumber": "089877778888",
                        "email": "dummy@gmail.com",
                        "familyContact": "087812123333"
                    },
                    "workInfo": {
                        "qrId": "10",
                        "nfcId": "100",
                        "dept": "Dummy Dept",
                        "simperIdCard": "Dummy Simper",
                        "title": "Dummy Title"
                    }
                })
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeTruthy();
        });

        it('should update an employee data when have token', async () => {
            const res = await request(server)
                .put('/employee?id=employeeId')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "personalInfo": {
                        "photo": null,
                        "name": "Dummy Employee",
                        "birthPlace": "Dummy Birthplace",
                        "birthDate": "2000-04-30",
                        "bloodType": "AB",
                        "address": {
                            "village": "Dummy Village",
                            "street": "Dummy Street",
                            "district": "Dummy District",
                            "province": "Dummy Province"
                        }
                    },
                    "contactInfo": {
                        "phoneNumber": "089877778888",
                        "email": "dummy@gmail.com",
                        "familyContact": "087812123333"
                    },
                    "workInfo": {
                        "qrId": "1",
                        "nfcId": "10",
                        "dept": "Dummy Dept",
                        "simperIdCard": "Dummy Simper",
                        "title": "Dummy Title"
                    }
                })
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeTruthy();
        });

        it('should delete an employee data when have token', async () => {
            const res = await request(server)
                .delete('/employee?id=employeeId')
                .set('Authorization', 'Bearer ' + token)
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toContain('Has Been Removed');
        });
    });

    describe('Staff Route Testing', () => {
        it('should post a new admin data when have token', async () => {
            const res = await request(server)
                .post('/admin')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "userName": "dummyUsername",
                    userPassword: "dummyJuga",
                    "personalInfo": {
                        "photo": null,
                        "name": "Dummy Admin",
                        "gender": "Laki-Laki",
                        "birthPlace": "Dummy Birthplace",
                        "birthDate": "2000-04-30",
                        "bloodType": "AB",
                        "address": {
                            "village": "Dummy Village",
                            "street": "Dummy Street",
                            "district": "Dummy District",
                            "province": "Dummy Province"
                        }
                    },
                    "contactInfo": {
                        "phoneNumber": "0898777788",
                        "email": "dummy22@gmail.com",
                        "familyContact": "0878123333"
                    },
                    "workInfo": {
                        "qrId": null,
                        "nfcId": null,
                        "dept": "Dummy Dept",
                        "simperIdCard": "Dummy Simper 2",
                        "title": "Dummy Title"
                    }
                })
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeTruthy();
        });
    });

    describe('Staff Route Testing', () => {
        it('should get all staff data when have token', async () => {
            const res = await request(server)
                .get('/staff')
                .set('Authorization', 'Bearer ' + token)
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0)
        });

        it('should post a new staff data when have token', async () => {
            const res = await request(server)
                .post('/staff')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "id": "dummmyId",
                    "personalInfo": {
                        "photo": null,
                        "name": "Dummy Staff",
                        "gender": "Laki-Laki",
                        "birthPlace": "Dummy Birthplace",
                        "birthDate": "2000-04-30",
                        "bloodType": "AB",
                        "address": {
                            "village": "Dummy Village",
                            "street": "Dummy Street",
                            "district": "Dummy District",
                            "province": "Dummy Province"
                        }
                    },
                    "contactInfo": {
                        "phoneNumber": "089877778888",
                        "email": "dummy@gmail.com",
                        "familyContact": "087812123333"
                    },
                    "workInfo": {
                        "qrId": null,
                        "nfcId": null,
                        "dept": "Dummy Dept",
                        "simperIdCard": "Dummy Simper",
                        "title": "Dummy Title"
                    }
                })
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeTruthy();
        });

        it('should update a staff data when have token', async () => {
            const res = await request(server)
                .put('/staff?id=staffIdTest')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "personalInfo": {
                        "photo": "http://image.com",
                    }
                })
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeTruthy();
        });

        it('should delete a staff data when have token', async () => {
            const res = await request(server)
                .delete('/staff?id=staffIdTest')
                .set('Authorization', 'Bearer ' + token)
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toContain('Has Been Removed');
        });
    });

    describe('Scan Route Testing', () => {
        it('should get an employee data when have token', async () => {
            const res = await request(server)
                .get('/scan/qrcode?id=1')
                .set('Authorization', 'Bearer ' + token)
            expect(res.status).toEqual(200);
            expect(res.body).toBeTruthy();
        })
    });

    describe('List Absensi Route Testing', () => {
        it('should get a list of attendance data when have token', async () => {
            const res = await request(server)
                .get('/listAbsensi?id=employeeId')
                .set('Authorization', 'Bearer ' + token)
            expect(res.status).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        })
    });

    describe('Absensi Submit Route Testing', () => {
        it('should submit attendance data when have token', async () => {
            const res = await request(server)
                .post('/absensiSubmit')
                .set('Authorization', 'Bearer ' + token)
                .send(
                    {
                        employeeId: "employeeId",
                        tanggal: "2020-04-14",
                        jam: "10:00:00"
                    }
                )
            expect(res.status).toEqual(200);
            expect(res.body.message).toEqual("employeeId success to attend in");
        })
    });

    describe('No Route Testing', () => {
        it('should go to no route when connecting to an unavailable api', async () => {
            const res = await request(server)
                .get('/noRoute')
            expect(res.status).toEqual(404);
            expect(res.body).toEqual('Page Not Found');
        });
    });
});
