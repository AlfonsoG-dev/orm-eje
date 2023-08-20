//dependencias
const db_conection = require('../services/DbConection')
const User = require('../model/DbModel')
const utils = require('../utils/DbUtils')
const {AxiosHeaders} = require('axios')

//utilidades
const cursor = db_conection.normal_conection("localhost", "test_user", "5x5W12")
const trim = utils.get_clean_properties(User)

//operaciones
const operations = {
    test_db: function (db_name = ''){
        const data = cursor.connect()
        if(data !== undefined){
            return data
        }else{
            const data = cursor.execute(`create database if not exists ${db_name}`)
            return data
        }
    },
    create_table: async function(db_name = ''){
        const data = await cursor.execute(`create table if not exists ${db_name}.test(${trim})`)
        if(data !== undefined){
            console.log(data)
        }
    },
    any_query: function(sql = '', ...args){
        return new Promise((resolve, reject) => {
            cursor.query(sql, args, function(err, res) {
                if(err) reject(err)
                resolve(res)
            })
        })
    },
    any_execute: function(sql = '', ...args){
        return new Promise((resolve, reject) => {
            cursor.execute(sql, args, function(err, res) {
                if(err) reject(err)
                resolve(rs)
            })
        })
    }
}


module.exports = operations
