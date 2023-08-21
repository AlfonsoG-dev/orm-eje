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
            //asi 1 a 1
            this.cursor.execute(`alter table ${this.db_name}.${this.tb_name}${columns}`, function(err, res){
                if(err) reject(err)
                resolve(res)
            })
        })
    }
    async add_columns(model){
        const faltante = await utils.compare_properties(user, this.db_name, this.tb_name, this.cursor)
        let queries = []
        for(let f of faltante){
            if(model[f] !== undefined){
                queries.push(` add column ${f},`)
            }
            else{
                return undefined
            }
        }
        const texto = queries.join("")
        const trim = texto.substr(0, texto.length-1)
        return trim
    }

    async drop_columns(model){
        const faltante = await utils.compare_properties(user, this.db_name, this.tb_name, this.cursor)
        if(faltante === undefined){
            throw Error("la tabla y el modelo se encuentran sincronizados")
        }
        let d_queries = []
        for(let f of faltante){
            if(model[f] === undefined){
                d_queries.push(` drop column ${f.split(" ")},`)
            }else{
                return undefined
            }
        }
        const texto = d_queries.join("")
        const trim = texto.substr(0, texto.length-1)
        return trim
    }
    async make_migration(){
        const new_columns = await this.add_columns(user)
        const d_columns = await this.drop_columns(user)
        if(new_columns !== undefined && d_columns !== undefined){
            throw Error("la tabla posee datos que el modelo no y el modelo posee datos que la tabla no tiene \n intenta sincronizarlos primero")
        }
        if(new_columns !== undefined && d_columns === undefined){
            const migration = await this.alter_table(new_columns)
            return migration
        }
        if(d_columns !== undefined && new_columns === undefined){
            const migration = await this.alter_table(d_columns)
            return migration
        }
    }

}

module.exports = Migrations
