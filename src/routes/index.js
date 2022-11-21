const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const adminRoutes = require('./admin.route');
const staffRoutes = require('./staff.route');
const employeeRoutes = require('./employee.route');
const scanRoutes = require('./scan.route');
const listAbsensiRoutes = require('./list.absensi.route');
const absensiSubmitRoutes = require('./absensi.submit.route');

const logRoute = require('./log.route');
const noRoute = require('./no.route');
const axios = require('axios');

router.use(logRoute);
router.use('/auth',authRoutes);
router.use('/admin',adminRoutes);
router.use('/staff',staffRoutes);
router.use('/employee',employeeRoutes);
router.use('/scan',scanRoutes);
router.use('/listAbsensi',listAbsensiRoutes);
router.use('/absensiSubmit',absensiSubmitRoutes);
router.get('/test',(req,res,next)=>{
    async function tes(){
        const tess = await axios.get('https://localhost:7029/WeatherForecast');
        res.send(tess.data)
    }
    tes()
})
router.use(noRoute);

module.exports = router;
