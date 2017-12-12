const NodeBatis = require('nodebatis');
const path = require('path');

const nodebatis = new NodeBatis(path.resolve(__dirname, './yaml/'), {
    debug: true,
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'chatroom',
    user: 'root',
    password: '123456'
})
module.exports = nodebatis;
