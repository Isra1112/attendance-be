const express = require('express');
const router = express.Router();

const Attendance = require('../models/attendance.model');
const SubmitAbsenService = require('../services/submit.absen.service');
const {submitAbsen} = require('../controllers/submit.absen.controller');
const tokenValidation = require('../middlewares/token.validation');

const submitAbsenService = new SubmitAbsenService(Attendance);

router.use(tokenValidation);
router.post('/',(req,res,next)=>submitAbsen(req,res,submitAbsenService));

module.exports = router;
