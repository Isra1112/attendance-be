const express = require('express');
const router = express.Router();

const {getAttendance,postReport}  = require('../controllers/list.absen.controller');
const ListAbsenService = require('../services/list.absen.service');
const Attendance = require('../models/attendance.model');
const Employee = require('../models/employee.model');
const PersonalInfo = require('../models/personal.info.model');
const ContactInfo = require('../models/contact.info.model');
const WorkInfo = require('../models/work.info.model');
const Address = require('../models/address.model');
const tokenValidation = require('../middlewares/token.validation');

const listAbsenService = new ListAbsenService(Employee,Attendance,PersonalInfo,ContactInfo,WorkInfo,Address);

router.use(tokenValidation);
router.get('/',(req,res,next)=>getAttendance(req,res,listAbsenService));
router.post('/report',(req,res,next)=>postReport(req,res,listAbsenService));

module.exports = router;
