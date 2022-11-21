const Sequelize = require('sequelize');
const connection = require('../../config/dbConn');

const Staff = connection.define('staff', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
}, {
    freezeTableName: true,
    tableName: 'staff',
    timestamps: true,
    paranoid: true,
    underscored: true,
});

module.exports = Staff;