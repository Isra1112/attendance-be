const Sequelize = require('sequelize');
const connection = require('../../config/dbConn');

const Employee = connection.define('employee',{
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull:false,
        primaryKey: true
    },
},{
    freezeTableName: true,
    tableName: 'employee',
    paranoid: true,
    timestamps: true,
    underscored: true
});

module.exports = Employee;
