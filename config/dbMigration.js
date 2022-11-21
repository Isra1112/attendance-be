const connection = require('./dbConn');
const dateFormat = require('dateformat');

const Staff = require('../src/models/staff.model');
const Employee = require('../src/models/employee.model');
const Address = require('../src/models/address.model');
const PersonalInfo = require('../src/models/personal.info.model');
const ContactInfo = require('../src/models/contact.info.model');
const WorkInfo = require('../src/models/work.info.model');
const Admin = require('../src/models/admin.model');
const bcrypt = require('bcryptjs');

const dbAssociation = require('../src/models/index');

async function migration() {
    dbAssociation();
    await connection.sync({ force: true });
    await dataDummy();
}

async function dataDummy() {

    let address02 = await Address.create({
        village: "Lebak Bulus",
        street: "Majapahit",
        district: "Cilandak",
        province: "Jakarta"
    });

    let address03 = await Address.create({
        village: "Sukadarma",
        street: "Rambutan",
        district: "Pinangranti",
        province: "Jakarta"
    });

    let address04 = await Address.create({
        village: "Gempura",
        street: "Setu",
        district: "Cipayung",
        province: "Jakarta"
    });

    let address05 = await Address.create({
        village: "Puri Gading",
        street: "Puri Gading Raya",
        district: "Jatimelati",
        province: "Jawa Barat"
    });

    let address06 = await Address.create({
        village: "Tambakrejo",
        street: "WR Supratman",
        district: "Purworejo",
        province: "Jawa Tengah"
    });

    let address07 = await Address.create({
        village: "Sukamaju",
        street: "Rambutan",
        district: "Lembang",
        province: "Jawa Barat"
    });

    let address08 = await Address.create({
        village: "Tapos",
        street: "Cimpaeun Tapos",
        district: "Cimpaeun",
        province: "Jawa Barat"
    });

    let personalInfo02 = await PersonalInfo.create({
        name: "Bagus Hendrawan",
        photo: "http://ec2-18-136-210-143.ap-southeast-1.compute.amazonaws.com:3003/images/em2.jpg",
        gender: "Laki-Laki",
        birthDate: "2000-06-21",
        birthPlace: "Bekasi",
        bloodType: "O"
    });

    let contactInfo02 = await ContactInfo.create({
        phoneNumber: "081281718585",
        email: "employee02@gmail.com",
        familyContact: "089712340897"
    });

    let workInfo02 = await WorkInfo.create({
        qrId: '97E03400E200001965170239',
        nfcId: '97E03400E200001965170239',
        dept: "Batubara",
        simperIdCard: 'BC-302',
        title: "Karyawan"
    });

    const employee02 = await Employee.create();
    employee02.setPersonalInfo(personalInfo02);
    employee02.setContactInfo(contactInfo02);
    employee02.setWorkInfo(workInfo02);
    personalInfo02.setAddress(address02);

    let personalInfo03 = await PersonalInfo.create({
        name: "Lydia",
        photo: "http://ec2-18-136-210-143.ap-southeast-1.compute.amazonaws.com:3003/images/lydia.jpg",
        gender: "Perempuan",
        birthDate: "1999-11-21",
        birthPlace: "Jakarta",
        bloodType: "A"
    });

    let contactInfo03 = await ContactInfo.create({
        phoneNumber: "089876765454",
        email: "employee03@gmail.com",
        familyContact: "087817176464"
    });

    let workInfo03 = await WorkInfo.create({
        qrId: 'B06C3000E200001965170151',
        nfcId: 'B06C3000E200001965170151',
        dept: "Batuan",
        simperIdCard: 'BC-303',
        title: "Karyawan"
    });

    const employee03 = await Employee.create();
    employee03.setPersonalInfo(personalInfo03);
    employee03.setContactInfo(contactInfo03);
    employee03.setWorkInfo(workInfo03);
    personalInfo03.setAddress(address03);

    let personalInfo04 = await PersonalInfo.create({
        name: "Kevin Gunawan",
        photo: "http://ec2-18-136-210-143.ap-southeast-1.compute.amazonaws.com:3003/images/kev.jpg",
        gender: "Laki-Laki",
        birthDate: "1997-10-15",
        birthPlace: "Sumatra Barat",
        bloodType: "AB"
    });

    let contactInfo04 = await ContactInfo.create({
        phoneNumber: "087913134141",
        email: "employee04@gmail.com",
        familyContact: "081287875252"
    });

    let workInfo04 = await WorkInfo.create({
        qrId: 'A4543400E200001965170147',
        nfcId: 'A4543400E200001965170147',
        dept: "Batubara",
        simperIdCard: 'BC-304',
        title: "Karyawan"
    });

    const employee04 = await Employee.create();
    employee04.setPersonalInfo(personalInfo04);
    employee04.setContactInfo(contactInfo04);
    employee04.setWorkInfo(workInfo04);
    personalInfo04.setAddress(address04);

    let personalInfo05 = await PersonalInfo.create({
        name: "Jodi Ferniawan",
        photo: "http://ec2-18-136-210-143.ap-southeast-1.compute.amazonaws.com:3003/images/em5.jpg",
        gender: "Laki-Laki",
        birthDate: "2001-12-12",
        birthPlace: "Kalimantan Timur",
        bloodType: "O"
    });

    let contactInfo05 = await ContactInfo.create({
        phoneNumber: "081375754774",
        email: "employee05@gmail.com",
        familyContact: "089752517372"
    });

    let workInfo05 = await WorkInfo.create({
        qrId: '218A3000E200001965170273',
        nfcId: '218A3000E200001965170273',
        dept: "Mineral Logam",
        simperIdCard: 'BC-305',
        title: "Karyawan"
    });

    const employee05 = await Employee.create();
    employee05.setPersonalInfo(personalInfo05);
    employee05.setContactInfo(contactInfo05);
    employee05.setWorkInfo(workInfo05);
    personalInfo05.setAddress(address05);

    let personalInfo06 = await PersonalInfo.create({
        name: "Alfarell Muchamad Yuwanto",
        photo: "https://sfi.mechatronics.no/wp-content/uploads/2018/09/Foto-3x4-CV-small.jpg",
        gender: "Laki-Laki",
        birthDate: "2000-03-15",
        birthPlace: "Purworejo",
        bloodType: "B"
    });

    let contactInfo06 = await ContactInfo.create({
        phoneNumber: "081286411234",
        email: "malfarell@gmail.com",
        familyContact: "087976549876"
    });

    let workInfo06 = await WorkInfo.create({
        qrId: null,
        nfcId: null,
        dept: "Batubara",
        simperIdCard: 'BC-101',
        title: "Staff"
    });

    const staff01 = await Staff.create({});
    staff01.setPersonalInfo(personalInfo06);
    staff01.setContactInfo(contactInfo06);
    staff01.setWorkInfo(workInfo06);
    personalInfo06.setAddress(address06);

    let personalInfo07 = await PersonalInfo.create({
        name: "Robby Mahendra",
        gender: "Laki-Laki",
        photo: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Valeriy_Konovalyuk_3x4.jpg",
        birthDate: "2000-01-01",
        birthPlace: "Jakarta",
        bloodType: "O"
    });

    let contactInfo07 = await ContactInfo.create({
        phoneNumber: "081287871212",
        email: "robbymahendra777@gmail.com",
        familyContact: "081287875252"
    });

    let workInfo07 = await WorkInfo.create({
        qrId: null,
        nfcId: null,
        dept: "Batuan",
        simperIdCard: 'BC-102',
        title: "Staff"
    });

    const staff02 = await Staff.create({});
    staff02.setPersonalInfo(personalInfo07);
    staff02.setContactInfo(contactInfo07);
    staff02.setWorkInfo(workInfo07);
    personalInfo07.setAddress(address07);

    let personalInfo08 = await PersonalInfo.create({
        name: "Isra Khairul Mutaqim",
        photo: "http://guiaavare.com/public/Noticias/3778/2012121702445042adaeaa5d7b8127bfc2c11f3e50b536.jpg",
        gender: "Laki-Laki",
        birthDate: "2001-10-13",
        birthPlace: "Depok",
        bloodType: "O"
    });

    let contactInfo08 = await ContactInfo.create({
        phoneNumber: "0827188819",
        email: "Isra19khairul@gmail.com",
        familyContact: "087888221199"
    });

    let workInfo08 = await WorkInfo.create({
        qrId: null,
        nfcId: null,
        dept: "Batu Bara",
        simperIdCard: 'BC-201',
        title: "Admin"
    });

    const passwordHash = bcrypt.hashSync('password321', 8);

    const admin01 = await Admin.create({
        userName: "israa123", userPassword: passwordHash
    });
    admin01.setPersonalInfo(personalInfo08);
    admin01.setContactInfo(contactInfo08);
    admin01.setWorkInfo(workInfo08);
    personalInfo08.setAddress(address08);


}

migration();