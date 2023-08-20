const mysql = require('mysql2')
const db_conection = {
    normal_conection: function(host = '', user = '', password = '', database = ''){
        return mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        })
    },
    pool_conection: function(){
        throw Error("not implemented yet")
    }
}

module.exports = db_conection
