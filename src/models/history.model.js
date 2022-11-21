const Sequelize = require('sequelize');
const connection = require('../../config/dbConn');

const History = connection.define('history', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: Sequelize.STRING,
    },
    date: {
        type: Sequelize.DATEONLY
    },
    hour:{
        type: Sequelize.TIME
    }
}, {
    freezeTableName: true,
    tableName: 'history',
    paranoid: true,
    timestamps: true,
    underscored: true
});

module.exports = History;
