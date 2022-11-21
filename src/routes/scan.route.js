const express = require('express');
const router = express.Router();

const { getInformation } = require('../controllers/scan.controller');
const ScanService = require('../services/scan.service');
const Employee = require('../models/employee.model');
const PersonalInfo = require('../models/personal.info.model');
const ContactInfo = require('../models/contact.info.model');
const WorkInfo = require('../models/work.info.model');
const Address = require('../models/address.model');
const Attendance = require('../models/attendance.model');
const tokenValidation = require('../middlewares/token.validation');

const scanService = new ScanService(Employee,PersonalInfo,ContactInfo,WorkInfo,Address,Attendance);

router.use(tokenValidation);
router.get('/:type', (req, res, next) => getInformation(req, res, scanService));

module.exports = router;
