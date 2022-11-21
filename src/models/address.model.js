const Sequelize = require('sequelize');
const connection = require('../../config/dbConn');

const Address = connection.define('address', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    village:{
        type: Sequelize.STRING
    },
    street:{
        type: Sequelize.STRING,
    },
    district:{
        type:Sequelize.STRING,
    },
    province:{
        type:Sequelize.STRING,
    }
}, {
    freezeTableName: true,
    tableName: 'address',
    paranoid: true,
    timestamps:true,
    underscored: true
});

module.exports = Address;
