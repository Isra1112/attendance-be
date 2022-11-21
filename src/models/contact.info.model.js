const Sequelize = require('sequelize');
const connection = require('../../config/dbConn');

const ContactInfo = connection.define('contactInfo',{
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull:false,
        primaryKey: true
    },
    phoneNumber:{
        type:Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull:false,
        validate: {
            isEmail: true,
        },
    },
    familyContact: {
        type:Sequelize.STRING
    }
},{
    freezeTableName: true,
    tableName: 'contact_info',
    paranoid: true,
    timestamps: true,
    underscored: true
});

module.exports = ContactInfo;
