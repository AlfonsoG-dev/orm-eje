const models = require('../model/DbModel')
const utils = require('../utils/DbUtils')

const user = new models.User()
class Migrations{

    constructor(db_name, tb_name, conection){
        this.db_name = db_name
        this.tb_name = tb_name
        this.cursor = conection
    }
    //TODO: hacer que se puede agregar y quitar columnas dependiendo del modelo y la tabla
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
    async make_queris(){
        const faltante = await utils.compare_properties(user, this.db_name, this.tb_name, this.cursor)
        let queries = []
        for(let f of faltante){
            queries.push(` add column ${f},`)
        }
        const texto = queries.join("")
        const trim = texto.substr(0, texto.length-1)
        return trim
    }
    async make_migration(){
        const new_columns = await this.make_queris()
        const migrate_table = await this.alter_table(new_columns)
        return migrate_table
        
    }

}

module.exports = Migrations
