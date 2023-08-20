//dependencias
const db_conection = require('../services/DbConection')
const User = require('../model/DbModel')
const utils = require('../utils/DbUtils')

//utilidades
const con = db_conection.normal_conection("localhost", "test_user", "5x5W12")
const trim = utils.get_clean_properties(User)

//operaciones
const operations = {
    test_db: function (db_name = ''){
        const data = con.connect()
        if(data !== undefined){
            return data
        }else{
            const data = con.execute(`create database if not exists ${db_name}`)
            return data
        }
    },
    create_table: async function(db_name = ''){
        const data = await con.execute(`create table if not exists ${db_name}.test(${trim})`)
        if(data !== undefined){
            console.log(data)
        }
    }
}


module.exports = operations
