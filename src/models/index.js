const Admin = require('./admin.model');
const Staff = require('./staff.model');
const Employee = require('./employee.model');
const Attendance = require('./attendance.model');
const Address = require('./address.model');
const PersonalInfo = require('./personal.info.model');
const ContactInfo = require('./contact.info.model');
const WorkInfo = require('./work.info.model');
const History = require('./history.model');

const dbAssociation = function dbAssociation(){
    Attendance.belongsTo(Employee);
    Employee.hasMany(Attendance);

    Employee.belongsTo(PersonalInfo);
    Employee.belongsTo(ContactInfo);
    Employee.belongsTo(WorkInfo);
    History.belongsTo(Employee);

    Admin.belongsTo(PersonalInfo);
    Admin.belongsTo(ContactInfo);
    Admin.belongsTo(WorkInfo);
    
    Staff.belongsTo(PersonalInfo);
    Staff.belongsTo(ContactInfo);
    Staff.belongsTo(WorkInfo);

    PersonalInfo.belongsTo(Address);
    Address.hasMany(PersonalInfo);

}

module.exports = dbAssociation;
