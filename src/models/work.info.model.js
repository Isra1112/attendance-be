const Sequelize = require('sequelize');
const connection = require('../../config/dbConn');

const WorkInfo = connection.define('workInfo', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    qrId:{
        type: Sequelize.STRING,
        unique: true,
    },
    nfcId:{
        type: Sequelize.STRING,
        unique: true,
    },
    dept: {
        type: Sequelize.STRING
    },
    simperIdCard: {
        type: Sequelize.STRING,
        unique:true,
    },
    title: {
        type: Sequelize.STRING
    },
}, {
    freezeTableName: true,
    tableName: 'work_info',
    paranoid: true,
    timestamps: true,
    underscored: true
});

module.exports = WorkInfo;
