const Model = require('../model/DbModel')
const utils = require('../utils/DbUtils')

class Migrations{

    constructor(db_name, tb_name, conection){
        this.db_name = db_name
        this.tb_name = tb_name
        this.cursor = conection
    }


    get_properti_fields(){
        return new Promise((resolve, reject) => {
            this.cursor.execute(`show columns from ${this.db_name}.${this.tb_name}`, function(err, res){
                if(err) reject(err)
                resolve(res)
            })
        })
    }
    async get_column_name(){
        const data = await this.get_properti_fields()
        const c_name = []
        for(let f of data){
            c_name.push(f['Field'])
        }
        return c_name

    }
    /*
     * retorna la propiedad adicional del modelo
     */
    async compare_properties(){
        const db_properties = await this.get_column_name()
        const model_properties = utils.get_properties(Model)
        const {keys, values} = model_properties
        if(db_properties.length === keys.length){
            return;
        }else{
            const faltante = keys.filter((key) => db_properties.includes(key) !== true)
            let index = [];
            for(let f of faltante){
                index.push(model_properties['keys'].indexOf(f))
            }
            let res = []
            for(let i of index){
                res.push(`${keys[i]} ${values[i]}`)
            }
            return res
        }
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
        const faltante = await this.compare_properties()
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
