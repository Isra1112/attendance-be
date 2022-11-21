const Sequelize = require('sequelize');
const connection = require('../../config/dbConn');

const Attendance = connection.define('attendance', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    tanggal: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    jamMasuk: {
        type: Sequelize.TIME,
        allowNull: false
    },
    jamKeluar: {
        type: Sequelize.TIME,
    },
    locationIn: {
        type: Sequelize.STRING
    },
    locationOut: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true,
    tableName: 'attendance',
    paranoid: false,
    timestamps: false,
    underscored: true
});

module.exports = Attendance;
