const mysql = require('mysql2')
const db_conection = {
    normal_conection: function(db_name = '') {
        return mysql.createConnection({
            host: 'localhost',
            user: 'test_user',
            password: '5x5W12',
            database: db_name
        })
    },
    pool_conection: function() {
        // TODO: implemt the pool connection
        throw Error("not implemented yet")
    }
}

module.exports = db_conection
