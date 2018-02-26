const NodeBatis = require('nodebatis');
const path = require('path');

const nodebatis = new NodeBatis(path.resolve(__dirname, './yaml'), {
    debug: true,
    dialect: 'mysql',
    host: '207.226.143.224',
    port: 3306,
    database: 'chatroom',
    user: 'root',
    password: 'liuxuegang'
})
module.exports = nodebatis;
