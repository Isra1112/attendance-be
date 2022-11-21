const express = require('express');
const router = express.Router();

const {getStaffInfo,addStaff,updateStaff,deleteStaff} = require('../controllers/staff.controller.js');
const StaffService = require('../services/staff.service.js');
const Staff = require('../models/staff.model')
const PersonalInfo = require('../models/personal.info.model');
const ContactInfo = require('../models/contact.info.model');
const WorkInfo = require('../models/work.info.model');
const Address = require('../models/address.model');

const tokenValidation = require('../middlewares/token.validation');

const staffService=  new StaffService(Staff,PersonalInfo,ContactInfo,WorkInfo,Address);

router.use(tokenValidation);
router.get('/',(req,res,next)=>getStaffInfo(req,res,staffService));
router.post('/',(req,res,next)=>addStaff(req,res,staffService));
router.put('/',(req,res,next)=>updateStaff(req,res,staffService));
router.delete('/',(req,res,next)=>deleteStaff(req,res,staffService));

module.exports = router;
