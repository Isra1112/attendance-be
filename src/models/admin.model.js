const Sequelize = require('sequelize');
const connection = require('../../config/dbConn');

const Admin = connection.define('admin',{
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    userName:{
        type:Sequelize.STRING,
        unique:true
    },
    userPassword:{
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true,
    tableName: 'admin',
    timestamps: true,
    paranoid: true,
    underscored: true,
});

module.exports = Admin;