//dependencias
const db_conection = require('../services/DbConection')
const User = require('../model/DbModel')
const utils = require('../utils/DbUtils')

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
                resolve(res)
            })
        })
    },
    read: function({options = '', limit = ''}){
        if(options === undefined && limit === undefined){
            throw Error("asignar los datos correspondientas para {options} y {limit}")
        }
        if(options !== undefined && limit !== undefined){
            return new Promise((resolve, reject) =>{
                this.any_execute(`select ${options} from consulta.users limit ${limit}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })
        }
        if(options === undefined){
            return new Promise((resolve, reject) =>{
                this.any_execute(`select * from consulta.users limit ${limit}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })

        }
        if(limit === undefined){
            return new Promise((resolve, reject) =>{
                this.any_execute(`select ${options} from consulta.users`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })

        }
    },
    find: function({where}){
        if(where === undefined){
            throw Error("debe asignar un objeto con la propiedad ¡{where: {condicion}}!")
        }
        const properties = utils.get_find_properties(where)
        const p_clean = utils.get_condicional(properties)
        return new Promise((resolve, reject) =>{
            this.any_execute(`select nombre from consulta.users where${p_clean}`)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    },
    save: function(obj = {}){
        if(obj === undefined){
            throw Error("no se ha asignado ningun objeto para guardar")
        }
        const {keys, values} = utils.get_properties(obj)
        const date_format = utils.get_date_format()
        const t_va = []
        for(let i of values){
            t_va.push(`'${i}'`)
        }
        return new Promise((resolve, reject) =>{
            this.any_execute(`insert into consulta.users(${keys.toString()}, create_at) values(${t_va.toString()}, ?)`, date_format)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    },
    update: function(obj = {}){
        if(obj === undefined){
            throw Error("no se ha asignado ningun objeto para actualizar")
        }
        const combin = utils.get_find_properties(obj).split(',')
        const valor = combin.splice(1, combin.length)
        const date_now = utils.get_date_format()
        return new Promise((resolve, reject) => {
            this.any_execute(`update consulta.users set ${valor.toString()}, update_at=? where${combin.toString()}`, date_now)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    },
    delete: function(where = {}){
        console.log(where)
        return;
        return new Promise((resolve, reject) => {
            this.any_execute('')
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
        
    }
}


module.exports = operations
