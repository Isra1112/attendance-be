const logEvent = require('../events/myEmitter');

class SubmitAbsenService {
    constructor(attendance) {
        this.attendance = attendance;
    }

    async submitAbsensiList(listData) {
        let allResult = [];
        try {
            for (const data of listData) {
                let result;
                let employeePresent = await this.attendance.findOne({
                    where:
                        { employeeId: data.employeeId, tanggal: data.tanggal }
                });

                if (employeePresent) {
                    if (!employeePresent.jamKeluar && employeePresent.jamMasuk < data.jam) {
                        data.jamKeluar = data.jam;
                        data.locationOut = data.location;
                        await this.attendance.update(data, { where: { id: employeePresent.id } });
                        result = { message: `${data.employeeId} success to attend out` }
                    } else {
                        result = { message: `${data.employeeId} failed to attend out` }
                    }
                } else {
                    data.jamMasuk = data.jam;
                    data.locationIn = data.location;
                    await this.attendance.create(data);
                    result = { message: `${data.employeeId} success to attend in` }
                }
                allResult.push(result);
            }
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'POST-ATTENDANCE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return allResult;
    }

    async submitAbsensiOne(data) {
        let result;
        try {
            let employeePresent = await this.attendance.findOne({
                where:
                    { employeeId: data.employeeId, tanggal: data.tanggal }
            });

            if (employeePresent) {
                if (!employeePresent.jamKeluar && employeePresent.jamMasuk < data.jam) {
                    data.jamKeluar = data.jam;
                    data.locationOut = data.location;
                    await this.attendance.update(data, { where: { id: employeePresent.id } })
                    result = { message: `${data.employeeId} success to attend out` }
                } else {
                    result = { message: `${data.employeeId} failed to attend out` }
                }
            } else {
                data.jamMasuk = data.jam;
                data.locationIn = data.location;
                await this.attendance.create(data);
                result = { message: `${data.employeeId} success to attend in` }
            }
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'POST-ATTENDANCE-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return result;
    }
}

module.exports = SubmitAbsenService;
