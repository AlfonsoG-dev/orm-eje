const models = require('../model/DbModel')
const utils = require('../utils/DbUtils')

const user = new models.User()
class Migrations{

    constructor(db_name, tb_name, conection){
        this.db_name = db_name
        this.tb_name = tb_name
        this.cursor = conection
    }
    alter_table(columns){
        if(columns === undefined){
            throw Error("no column was provide")
        }
        return new Promise((resolve, reject) => {
            this.cursor.execute(`alter table ${this.db_name}.${this.tb_name}${columns}`, function(err, res){
                if(err) reject(err)
                resolve(res)
            })
        })
    }
    //:TODO: para agregar column como FK se tiene que modificar la query creada para alter table
    async add_columns(model){
        const faltante = await utils.compare_properties(user, this.db_name, this.tb_name, this.cursor)
        if(faltante === undefined){
            throw Error("la tabla y el modelo se encuentran sincronizados")
        }
        let queries = []
        for(let f of faltante){
            if(model[f.split(" ")[0]] !== undefined){
                queries.push(` add column ${f}`)
            }
        }
        const texto = queries.join("")
        const trim = texto.substr(0, texto.length)
        return trim
    }
    async add_pk_or_fk(isPK = [], isFK = [], column_ref){
        if(isPK.length > 0 && isFK.length === 0){
            const texto = ` ${isPK},`
            const trim = texto.substr(0, texto.length-1)
            return trim
        }
        if(isFK.length > 0 && isPK.length === 0 && column_ref !== undefined){
            const texto = ` ${isFK},`
            const trim = texto.substr(0, texto.length-1)
            return trim
        }
    }

    async drop_columns(model){
        const faltante = await utils.compare_properties(user, this.db_name, this.tb_name, this.cursor)
        if(faltante === undefined){
            throw Error("la tabla y el modelo se encuentran sincronizados")
        }
        let d_queries = []
        for(let f of faltante){
            if(model[f.split(" ")[0]] === undefined){
                d_queries.push(` drop column ${f.split(" ")},`)
            }else{
                return undefined
            }
        }
        const texto = d_queries.join("")
        const trim = texto.substr(0, texto.length-1)
        return trim
    }

    //TODO: renombrar la columna
    async rename_columns(model){
        throw Error("not implemented yet")
    }

    //TODO: change column data type
    async change_columns_type(model){
        throw Error("not implemented yet")
    }
    async make_migration(){
        const new_columns = await this.add_columns(user)
        const d_columns = await this.drop_columns(user)
        if(new_columns !== "" && d_columns === undefined){
            const faltante = await utils.compare_properties(user, this.db_name, this.tb_name, this.cursor)
            const isPK = utils.add_primary_key(faltante)
            const isFK = utils.add_foreign_key(faltante, '`test_db`.`cuentas`', 'cuenta_id')
            const pk_fk_columns = await this.add_pk_or_fk(isPK, isFK, 'cuenta_id')
            console.log("ingresa a ")
            const migration = Promise.all([this.alter_table(new_columns), this.alter_table(pk_fk_columns)])
            return migration
        }
        if(d_columns !== "" && new_columns === ""){
            console.log("llegada")
            const migration = Promise.all([ this.alter_table(d_columns)])
            return migration
        }
    }

}

module.exports = Migrations
