//dependencias
const models = require('../model/DbModel')
const utils = require('../utils/DbUtils')
const migrations = require('../services/Migrations')
const user = new models.User()
//operaciones
class Operaciones {
    constructor(db_name, tb_name, connection){
        if(tb_name === undefined || connection === undefined || db_name === undefined){
            throw Error("no se puede crear las operaciones")
        }
        this.tb_name = tb_name
        this.db_name = db_name
        this.cursor = connection
        this.test_db()
        this.select_db()
        this.create_table()
        this.migrate = new migrations(this.db_name, this.tb_name, this.cursor);
    }
    test_db(){
        const data = this.cursor.connect()
        if(data !== undefined){
            return data
        }else{
            const data = this.cursor.execute(`create database if not exists ${this.db_name}`)
            return data
        }
    }
    select_db(){
        const data = this.cursor.query(`use ${this.db_name}`)
        if(data !== undefined){
            return data
        }
    }
    async create_table(){
        const trim = utils.get_clean_properties(user)
        const data = await this.cursor.execute(`create table if not exists ${this.tb_name}(${trim})`)
        if(data !== undefined){
            return data
        }
    }
    any_query(sql = '', ...args){
        return new Promise((resolve, reject) => {
            this.cursor.query(sql, args, function(err, res) {
                if(err) reject(err)
                resolve(res)
            })
        })
    }
    any_execute(sql = '', ...args){
        return new Promise((resolve, reject) => {
            this.cursor.execute(sql, args, function(err, res) {
                if(err) reject(err)
                resolve(res)
            })
        })
    }
    read({options, limit}){
        if(options === undefined && limit === undefined){
            throw Error("asignar los datos correspondientas para {options} y {limit}")
        }
        if(options !== undefined && limit !== undefined){
            return new Promise((resolve, reject) =>{
                this.any_execute(`select ${options} from ${this.tb_name} limit ${limit}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })
        }
        if(options === undefined){
            return new Promise((resolve, reject) =>{
                this.any_execute(`select * from ${this.tb_name} limit ${limit}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })

        }
        if(limit === undefined){
            return new Promise((resolve, reject) =>{
                this.any_execute(`select ${options} from ${this.tb_name}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })

        }
    }
    //TODO: por el momento retorna todos los campos del elemento buscado
    //se deberia dar la opción de obtener solo lo necesario
    find({where}){
        if(where === undefined){
            throw Error("debe asignar un objeto con la propiedad ¡{where: {condicion}}!")
        }
        const properties = utils.get_find_properties(where)
        const p_clean = utils.get_condicional(properties)
        return new Promise((resolve, reject) =>{
            this.any_execute(`select * from ${this.tb_name} where${p_clean}`)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    }

    save(obj){
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
            this.any_execute(`insert into ${this.tb_name}(${keys.toString()}, create_at) values(${t_va.toString()}, ?)`, date_format)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    }
    /*
     * el primer elemento del objeto se utiliza para actualizar el objeto
     * objeto en la posición 1 re remueve de la acutalización y se utiliza como condicional
     * */
    update(obj) {
        if(obj === undefined){
            throw Error("no se ha asignado ningun objeto para actualizar")
        }
        const combin = utils.get_find_properties(obj).split(',')
        const valor = combin.splice(1, combin.length)
        const date_now = utils.get_date_format()
        return new Promise((resolve, reject) => {
            this.any_execute(`update ${this.tb_name} set ${valor.toString()}, update_at=? where${combin.toString()}`, date_now)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    }
    delete(where) {
        if(where === undefined){
            throw Error("no se ha asignado un objeto para eliminar")
        }
        const del = utils.get_find_properties(where)
        const valores = utils.get_condicional(del).toString()
        return new Promise((resolve, reject) => {
            this.any_execute(`delete from ${this.tb_name} where${valores}`)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
        
    }
    async make_migrations(){
        try{
            const faltante = await utils.compare_properties(user, this.db_name, this.tb_name, this.cursor)
            if(faltante === undefined){
                throw Error("no se puede migrar datos que no existen")
            }
            await this.migrate.make_migration()
        }catch(err) {
            throw Error(err)
        }
    }
}


module.exports = Operaciones
