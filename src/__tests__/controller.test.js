const { getEmployeeInformation } = require('../controllers/employee.controller');
const { getStaffInfo } = require('../controllers/staff.controller');
const { userAuthentication } = require('../controllers/auth.controller');
const { getAttendance } = require('../controllers/list.absen.controller');
const { getInformation } = require('../controllers/scan.controller');
const { getAdminInfo, addAdmin } = require('../controllers/admin.controller');
const { submitAbsen } = require('../controllers/submit.absen.controller');

const EmployeeService = require('../services/employee.service');
const StaffService = require('../services/staff.service');
const AuthService = require('../services/auth.service');
const ListAbsenService = require('../services/list.absen.service');
const ScanService = require('../services/scan.service');
const AdminService = require('../services/admin.service');
const SubmitAbsenService = require('../services/submit.absen.service');

let mockRequest;
let mockResponse;
let mockRequestName;
let mockRequestId;
let mockRequestScan;
let mockResponseFailed;
let mockRequestUpdate;
let mockRequestWeb;
let mockRequestScanEr;

let employeeService;
let staffService;
let authService;
let listAbsenService;
let adminService;
let scanService;
let submitAbsenService;

describe("Controller Testing", () => {
    beforeAll(() => {
        employeeService = new EmployeeService();
        staffService = new StaffService();
        adminService = new AdminService();
        authService = new AuthService();
        listAbsenService = new ListAbsenService();
        scanService = new ScanService();
        submitAbsenService = new SubmitAbsenService();

        mockRequest = () => {
            const req = { query: { id: 0 } }
            return req;
        }

        mockRequestId = () => {
            const req = { query: { id: 1 } }
            return req;
        }

        mockRequestName = () => {
            const req = { query: { name: "dummy" } }
            return req;
        }

        mockRequestWeb = () => {
            const req = { body: { userName: 'true', userPassword: 'truee' }, query: { email: null } }
            return req;
        }

        mockRequestScan = () => {
            const req = { params: { type: 'nfc' }, query: { id: '12' } }
            return req;
        }

        mockRequestScanEr = () => {
            const req = { params: { type: 'fas' }, query: { id: '12' } }
            return req;
        }

        mockRequestUpdate = () => {
            const req = { body: { "name": "Opick" }, query: { id: 1 } }
            return req;
        }

        mockResponse = () => {
            const res = {};
            res.status = jest.fn().mockReturnValue(200);
            res.json = jest.fn().mockReturnValue(res);
            return res;
        }

        mockResponseFailed = () => {
            const res = {};
            res.status = jest.fn().mockReturnValue(500);
            res.json = jest.fn().mockReturnValue(res);
            return res;
        }
    });
    describe("Employee Controller", () => {
        it('should return 500 and error message when get-service failed', async () => {
            const req = mockRequestId();
            const res = mockResponseFailed();
            employeeService.getInformationById = jest.fn(() => {
                throw new Error("Failed to get employee information");
            });
            await getEmployeeInformation(req, res, employeeService);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith('Failed to get employee information');
            expect(employeeService.getInformationById).toBeCalledTimes(1);
        });
        it('should return 200 and giving a list of employee when service getInformationByName success', async () => {
            const req = mockRequestName();
            const res = mockResponse();
            const result = [{ "id": 1, "name": "Agam" }, { "id": 2, "name": "Bagas" }];
            employeeService.getInformationByName = jest.fn(() => {
                return [{ "id": 1, "name": "Agam" }, { "id": 2, "name": "Bagas" }];
            });
            await getEmployeeInformation(req, res, employeeService);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(result);
            expect(employeeService.getInformationByName).toBeCalledTimes(1);
        });
    });
    describe("Staff Controller", () => {
        it('should return 500 and error message when get-service failed', async () => {
            const req = mockRequestId();
            const res = mockResponseFailed();
            staffService.getInfoById = jest.fn(() => {
                throw new Error("Failed to get staff information");
            });
            await getStaffInfo(req, res, staffService);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith('Failed to get staff information');
            expect(staffService.getInfoById).toBeCalledTimes(1);
        });
    });
    describe("Admin Controller", () => {
        it('should return 500 and error message when get-service failed', async () => {
            const req = mockRequest();
            const res = mockResponseFailed();
            adminService.getAllInfo = jest.fn(() => {
                throw new Error("Failed to get admin information");
            });
            await getAdminInfo(req, res, adminService);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith('Failed to get admin information');
            expect(adminService.getAllInfo).toBeCalledTimes(1);
        });
    });
    describe('Auth Controller', () => {
        it('should 401 when user is null', async () => {
            const req = mockRequestWeb();
            const res = mockResponse();
            authService.authWeb = jest.fn(() => {
                return null;
            });
            await userAuthentication(req, res, authService);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(authService.authWeb).toBeCalledTimes(1);
        });

        it('should 500 when authenticate failed', async () => {
            const req = mockRequestWeb();
            const res = mockResponse();
            authService.authWeb = jest.fn(() => {
                throw new Error('Failed to authenticate');
            });
            await userAuthentication(req, res, authService);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(authService.authWeb).toBeCalledTimes(1);
        });
    });
    describe('ListAbsen Controller', () => {

        it('should return 500 and json containing error when getListAbsensi failed', async () => {
            const req = mockRequest();
            const res = mockResponse();
            listAbsenService.getAllList = jest.fn(() => {
                throw new Error('Failed to get');
            });
            await getAttendance(req, res, listAbsenService);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith('Failed to get');
            expect(listAbsenService.getAllList).toBeCalledTimes(1);
        });
    });
    describe('Scan Controller', () => {
        it('should throw error when no scan type found', async () => {
            const req = mockRequestScanEr();
            const res = mockResponse();
            await getInformation(req, res, scanService);
            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('should throw 404 when no user found', async () => {
            const req = mockRequestScan();
            const res = mockResponse();
            scanService.getInformationByScanNFC = jest.fn(() => {
                return null;
            });
            await getInformation(req, res, scanService);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
    describe('SubmitAbsen Controller', () => {
        it('should return 500 and json containing error when submitAbsensi failed', async () => {
            const req = mockRequestUpdate();
            const res = mockResponse();
            submitAbsenService.submitAbsensiOne = jest.fn(() => {
                throw new Error('Failed to submit');
            });
            await submitAbsen(req, res, submitAbsenService);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith('Failed to submit');
            expect(submitAbsenService.submitAbsensiOne).toBeCalledTimes(1);
        });
    });
});