//dependencias
const utils = require('../utils/DbUtils')
const migrations = require('../services/Migrations')
//operaciones
class Operaciones {
    constructor(db_name, tb_name, connection, model){
        if(tb_name === undefined || connection === undefined || db_name === undefined){
            throw Error("no se puede crear las operaciones")
        }

        this.model = model
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
        const trim = utils.get_key_value(this.model)
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
    count_column({options = []}){
        if(options.length === 0){
            return new Promise((resolve, reject) => {
                this.any_execute(`select count('*') as count_todo from ${this.tb_name}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })
        }
        if(options.length > 0){
            let queries = []
            for(let p of options){
                queries.push(` count(${p}) as count_${p},`)
            }
            const texto = queries.join("")
            const trim = texto.substring(0, texto.length-1)
            return new Promise((resolve, reject) => {
                this.any_execute(`select${trim} from ${this.tb_name}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })
        }
    }
    //se deberia dar la opción de obtener solo lo necesario
    find({options, where}){
        if(where === undefined){
            throw Error("debe asignar un objeto con la propiedad ¡{where: {condicion}}!")
        }
        if(options === undefined || options.length === 0){
            const properties = utils.get_asign_value(where)
            const p_clean = utils.get_condicional(properties)
            return new Promise((resolve, reject) =>{
                this.any_execute(`select * from ${this.tb_name} where${p_clean}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })
        }
        if(options !== undefined || options.length > 0){
            const properties = utils.get_asign_value(where)
            const p_clean = utils.get_condicional(properties)
            let queries = []
            for(let p of options){
                queries.push(` ${p},`)
            }
            const texto = queries.join("")
            const trim = texto.substring(0, texto.length-1)
            return new Promise((resolve, reject) =>{
                this.any_execute(`select ${trim} from ${this.tb_name} where${p_clean}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })
        }
    }

    save(obj){
        if(obj === undefined){
            throw Error("no se ha asignado ningun objeto para guardar")
        }
        const {keys, values} = utils.get_model_properties(obj)
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
        const combin = utils.get_asign_value(obj).split(',')
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
        const del = utils.get_asign_value(where)
        const valores = utils.get_condicional(del).toString()
        return new Promise((resolve, reject) => {
            this.any_execute(`delete from ${this.tb_name} where${valores}`)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
        
    }
    /**
     * local_options: ["email, password"]
     * ref_options: ["user_id, nombre"]
     */
    innerJoin(options = {local_op: [], ref_op: []}, ref_model, ref_tb_name="", ref_db ="") {
        if( ref_model === undefined ||
            options.local_op.length === 0 ||
            options.ref_op === 0) {
            throw Error("deberia ser diferente a undefined");
        }
        if(ref_tb_name === "" || ref_db === "") {
            throw Error("deberia declara los nombres de referencia");
        }
        const {pk, fk} = utils.get_pk_fk(this.model, ref_model);
        const {s_lp, s_rp} = utils.clean_properties(options, this.tb_name, ref_tb_name)
        const c_lp = s_lp.substring(0, s_lp.length-2)
        const c_rp = s_rp.substring(0, s_rp.length-2)
        const sql = `select ${c_lp}, ${c_rp} from ${this.tb_name} inner join ${ref_db}.${ref_tb_name} on ${ref_tb_name}.${fk}=${this.tb_name}.${pk}`
        return new Promise(( resolve, reject) => {
          this.any_execute(sql)  
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    }
    async make_migrations(ref_model, ref_tb_name){
        try{
            /*
            const faltante = await utils.compare_properties(user, this.db_name, this.tb_name, this.cursor)
            if(faltante === undefined){
                throw Error("no se puede migrar datos que no existen")
            }
             */
            if(ref_model !== undefined && ref_tb_name !== undefined){
                await this.migrate.make_migration(this.model, ref_model, ref_tb_name)
            }
            await this.migrate.make_migration(this.model)
        }catch(err) {
            throw Error(err)
        }
    }
}


module.exports = Operaciones
