const express = require('express');
const router = express.Router();

const {userAuthentication} = require('../controllers/auth.controller');
const AuthService = require('../services/auth.service');
const Staff = require('../models/staff.model');
const PersonalInfo = require('../models/personal.info.model');
const ContactInfo = require('../models/contact.info.model');
const WorkInfo = require('../models/work.info.model');
const Address = require('../models/address.model');
const Admin = require('../models/admin.model');

const authService = new AuthService(Staff,PersonalInfo,ContactInfo,WorkInfo,Address,Admin);

router.post('/',(req,res,next)=>userAuthentication(req,res,authService));

module.exports = router;
