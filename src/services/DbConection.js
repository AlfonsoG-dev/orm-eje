const mysql = require('mysql2')
const DbConfig = require('../utils/DbConfig')

const config = new DbConfig();

const db_conection = {
    normal_conection: function(db_name = '') {
        return mysql.createConnection(config.normal_config(db_name))
    },
    pool_conection: function(db_name = '') {
        return mysql.createPool(config.pool_config(db_name))
    }
}

module.exports = db_conection
