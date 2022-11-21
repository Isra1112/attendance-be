const express = require('express');
const router = express.Router();

const {getAdminInfo,addAdmin} = require('../controllers/admin.controller.js');
const AdminService = require('../services/admin.service.js');
const Admin = require('../models/admin.model')
const PersonalInfo = require('../models/personal.info.model');
const ContactInfo = require('../models/contact.info.model');
const WorkInfo = require('../models/work.info.model');
const Address = require('../models/address.model');

const tokenValidation = require('../middlewares/token.validation');

const adminService=  new AdminService(Admin,PersonalInfo,ContactInfo,WorkInfo,Address);

router.use(tokenValidation);
router.get('/',(req,res,next)=>getAdminInfo(req,res,adminService));
router.post('/',(req,res,next)=>addAdmin(req,res,adminService));
// router.put('/',(req,res,next)=>updateStaff(req,res,staffService));
// router.delete('/',(req,res,next)=>deleteStaff(req,res,staffService));

module.exports = router;
