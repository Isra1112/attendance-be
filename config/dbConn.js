const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();
const currEnv = process.env.NODE_ENV;
let connection;
if (currEnv == 'test') {
    connection = new Sequelize('sqlite::memory');
} else {
    connection = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            dialect: process.env.DB_TYPE,
            port: process.env.DB_PORT,
            host: process.env.DB_HOST
        }
        // 'israkmmy_company',
        // 'israkmmy_isra',
        // '8Y0{]fDU$~v=',
        // {
        //     dialect: 'mysql',
        //     port:3306,
        //     host: '103.28.53.75'
        // }
    )
}

module.exports = connection;
