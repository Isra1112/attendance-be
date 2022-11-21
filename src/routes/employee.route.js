const express = require('express');
const router = express.Router();

const {getEmployeeInformation,addEmployee,updateEmployee,deleteEmployee} = require('../controllers/employee.controller.js');
const EmployeeService = require('../services/employee.service.js');
const Employee = require('../models/employee.model')
const PersonalInfo = require('../models/personal.info.model');
const ContactInfo = require('../models/contact.info.model');
const WorkInfo = require('../models/work.info.model');
const Address = require('../models/address.model');
const History = require('../models/history.model');

const tokenValidation = require('../middlewares/token.validation');

const employeeService=  new EmployeeService(Employee,PersonalInfo,ContactInfo,WorkInfo,Address,History);

router.use(tokenValidation);
router.get('/',(req,res,next)=>getEmployeeInformation(req,res,employeeService));
router.post('/',(req,res,next)=>addEmployee(req,res,employeeService));
router.put('/',(req,res,next)=>updateEmployee(req,res,employeeService));
router.delete('/',(req,res,next)=>deleteEmployee(req,res,employeeService));

module.exports = router;
