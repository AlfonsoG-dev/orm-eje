//dependencias
import Utils from '../utils/DbUtils.js'
import QueryBuilder from '../utils/QueryBuilder.js'
import Migrations from '../services/Migrations.js'
import min_max_structure from '../utils/ParamTypes.js'

//operaciones
export default class Operaciones {
    constructor(db_name, tb_name, connection, model) {
        if(tb_name === undefined || connection === undefined || db_name === undefined) {
            throw Error("no se puede crear las operaciones")
        }
        this.query_builder = new QueryBuilder(tb_name)
        this.model = model
        this.tb_name = tb_name
        this.db_name = db_name
        this.cursor = connection
        this.utils = new Utils()
        this.migrate = new Migrations(this.db_name, this.tb_name, this.cursor)
        // verify database creation
        //this.test_db()
        //this.select_db()
        //this.create_table()
    }
    async test_db() {
        const data = this.cursor.connect()
        if(data !== undefined) {
            return data
        }else {
            const data = await this.cursor.execute(`create database if not exists ${this.db_name}`)
            return data
        }
    }
    async select_db() {
        const data = await this.cursor.query(`use ${this.db_name}`)
        if(data !== undefined) {
            return data
        }
    }
    async create_table() {
        const trim = this.utils.get_key_value(this.model)
        const data = await this.cursor.execute(`create table if not exists ${this.tb_name}(${trim})`)
        if(data !== undefined) {
            return data
        }
    }
    any_query(sql = '', values=[]) {
        return new Promise((resolve, reject) => {
            this.cursor.query(
                sql,
                values,
                (err, res) => {
                    if(err) reject(err)
                    resolve(res)
                }
            )
        })
    }
    any_execute(sql = '', values=[]) {
        return new Promise((resolve, reject) => {
            this.cursor.execute(
                sql,
                values,
                (err, res) => {
                    if(err) reject(err)
                    resolve(res)
                }
            )
        })
    }
    async prepared_select(columns=[], model={}, type="") {
        try {
            const {sql, values} = this.query_builder.select_query(columns, model, type)
            const result = await this.any_execute(sql, values)
            if(result.length === 0) {
                return {
                    error: "Empty set"
                }
            }
            return result
        } catch(er) {
            console.error(er)
        }
    }
    async prepared_select_all(clause={}, type="", limit=0, offset=0) {
        try {
            const {sql, values} = this.query_builder.select_all(clause, type, limit, offset)
            const result = await this.any_execute(sql, values)
            if(result.length === 0) {
                return {
                    error: "Empty set"
                }
            }
            return result
        } catch(er) {
            console.error(er)
        }
    }
    read({options, limit}) {
        if(options === undefined && limit === undefined) {
            throw Error("asignar los datos correspondientas para {options} y {limit}")
        }
        return new Promise((resolve, reject) => {
            this.any_execute(`select ${options} from ${this.tb_name} limit ${limit}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
        })
    }
    count_column(options = []) {
        if(options.length === 0) {
            return new Promise((resolve, reject) => {
                this.any_execute(`select count('*') as count_todo from ${this.tb_name}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })
        }
        if(options.length > 0) {
            let queries = []
            for(let p of options) {
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
    /**
     * se deberia dar la opción de obtener solo lo necesario
     */
    find({options, where}) {
        if(where === undefined) {
            throw Error("debe asignar un objeto con la propiedad ¡{where: {condicion}}!")
        }
        if(options === undefined || options.length === 0) {
            const properties = this.utils.get_asign_value(where)
            const p_clean = this.utils.get_condicional(properties, "and")
            return new Promise((resolve, reject) => {
                this.any_execute(`select * from ${this.tb_name} where${p_clean}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })
        }
        if(options !== undefined || options.length > 0) {
            const properties = this.utils.get_asign_value(where)
            const p_clean = this.utils.get_condicional(properties, "and")
            let queries = []
            for(let p of options) {
                queries.push(` ${p},`)
            }
            const texto = queries.join("")
            const trim = texto.substring(0, texto.length-1)
            return new Promise((resolve, reject) => {
                this.any_execute(`select ${trim} from ${this.tb_name} where${p_clean}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })
        }
    }
    /**
     * select min(column) as min_column_name from table where condition 
     * select max(column) as max_column_name from table where condition 
     *
     * find_min_max("name: test, email: otro@gmail", {
     *      min: ["nombre", "edad"]
     *      max: ["sueldo", "create_at"]
     * }, "and")
     */
    find_min_max(condition = {}, options = min_max_structure, type = "") {
        const c_values = this.utils.get_asign_value(condition);
        const c = this.utils.get_condicional(c_values, type)
        const mx = this.utils.get_min_max_selection(options)
        return new Promise((resolve, reject) => {
            this.any_execute(`select ${mx} from ${this.tb_name} where ${c}`)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    }
    /**
     * findIn(column, options)
     * column: "nombre"
     * options: ['test', 'admin']
     */
    findIn(column = "", options = []) {
        if(column === "" || options.length === 0) {
            throw Error("debe asignar los argumentos correctamente");
        }
        let in_options = "";
        for(let k of options) {
            in_options += `'${k}', `;
        }
        let clean_options = in_options.substring(0, in_options.length-2);
        let sql = `select * from ${this.tb_name} where ${column} in (${clean_options})`;

        return new Promise((resolve, reject) => {
            this.any_execute(sql)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    }
    /**
     * findPattern(pattern, columns)
     * pattern: "pk"
     * columns: ['nombre', 'email']
     * type : and, or, not
     * when not is used the type of the condition is or
     * where not email=? or not name=?
     */
    findPattern(pattern = "", columns = [], type = "") {
        if(pattern === "" || columns.length === 0) {
            throw Error("debe asignar los argumentos correctamente");
        }
        const pattern_conditional = this.utils.get_like_conditional(pattern, columns, type);
        let sql = `select * from ${this.tb_name} where ${pattern_conditional}`;

        return new Promise((resolve, reject) => {
            this.any_execute(sql)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    }
    save(obj) {
        if(obj === undefined) {
            throw Error("no se ha asignado ningun objeto para guardar")
        }
        const {keys, values} = this.utils.get_model_properties(obj)
        const date_format = this.utils.get_date_format()
        const t_va = []
        for(let i of values) {
            t_va.push(`'${i}'`)
        }
        return new Promise((resolve, reject) => {
            this.any_execute(`insert into ${this.tb_name}(${keys.toString()}, create_at) values(${t_va.toString()}, ?)`, date_format)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    }
    async prepared_insert(model={}) {
        try {
            const {sql, values} = this.query_builder.insert_query(model)
            const result = await this.any_execute(sql, values)
            if(result.affectedRows === 0) {
                return {
                    error: "Something happend while trying to insert"
                }
            }
            return {
                msg: "Successfully inserted"
            }
        } catch(er) {
            console.error(er)
        }
    }
    /*
     * el primer elemento del objeto se utiliza para actualizar el objeto
     * objeto en la posición 1 re remueve de la acutalización y se utiliza como condicional
     * */
    update(obj) {
        if(obj === undefined) {
            throw Error("no se ha asignado ningun objeto para actualizar")
        }
        const combin = this.utils.get_asign_value(obj).split(',')
        const valor = combin.splice(1, combin.length)
        const date_now = this.utils.get_date_format()
        return new Promise((resolve, reject) => {
            this.any_execute(`update ${this.tb_name} set ${valor.toString()}, update_at=? where${combin.toString()}`, date_now)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    }
    async prepared_upate(model={}, clause=[]) {
        try {
            const {sql, values} = this.query_builder.update_query(model, clause)
            const result = await this.any_execute(sql, values)
            if(result.affectedRows === 0) {
                return {
                    error: "Something happend while trying to update"
                }
            }
            return {
                msg: "Successfully updated"
            }
        } catch(er) {
            console.error(er)
        }
    }
    remove(where) {
        if(where === undefined) {
            throw Error("no se ha asignado un objeto para eliminar")
        }
        const del = this.utils.get_asign_value(where)
        const valores = this.utils.get_condicional(del, "and")
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
        const {pk, fk} = this.utils.get_pk_fk(this.model, ref_model);
        const {s_lp, s_rp} = this.utils.get_asign_table_name(options, this.tb_name, ref_tb_name)
        const c_lp = s_lp.substring(0, s_lp.length-2)
        const c_rp = s_rp.substring(0, s_rp.length-2)
        const sql = `select ${c_lp}, ${c_rp} from ${this.tb_name} inner join ${ref_db}.${ref_tb_name} on ${ref_tb_name}.${fk}=${this.tb_name}.${pk}`
        return new Promise(( resolve, reject) => {
          this.any_execute(sql)  
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        })
    }
    async make_migrations(ref_model, ref_tb_name) {
        try {
            if(ref_model !== undefined && ref_tb_name !== undefined){
                await this.migrate.make_migration(this.model, ref_model, ref_tb_name)
            }
            await this.migrate.make_migration(this.model)
        } catch(err) {
            throw Error(err)
        }
    }
}

