const utils = require('../utils/DbUtils')
class Migrations{

    constructor(db_name, tb_name, conection){
        this.db_name = db_name
        this.tb_name = tb_name
        this.cursor = conection
    }
    alter_table(columns){
        if(columns === undefined){
            return undefined
        }
        return new Promise((resolve, reject) => {
            this.cursor.execute(`alter table ${this.db_name}.${this.tb_name}${columns};`, function(err, res){
                if(err) reject(err)
                resolve(res)
            })
        })
    }
    async add_columns(model){
        const faltante = await utils.compare_properties(model, this.db_name, this.tb_name, this.cursor)
        if(faltante === undefined){
            return undefined
        }
        let queries = []
        for(let f of faltante){
            if(model[f.split(" ")[0]] !== undefined){
                queries.push(` add column ${f},`)
            }
        }
        const texto = queries.join("")
        const trim = texto.substring(0, texto.length-1)
        return trim
    }
    async add_pk_or_fk(isPK = [], isFK = [], column_ref){
        if(isPK.length > 0 && isFK.length === 0){
            const texto = ` ${isPK},`
            const trim = texto.substring(0, texto.length-1)
            return trim
        }
        if(isFK.length > 0 && isPK.length === 0 && column_ref !== undefined){
            const texto = ` ${isFK},`
            const trim = texto.substring(0, texto.length-1)
            return trim
        }
    }
    async drop_columns(model){
        const faltante = await utils.compare_properties(model, this.db_name, this.tb_name, this.cursor)
        if(faltante === undefined){
            return undefined
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
        const trim = texto.substring(0, texto.length-1)
        return trim
    }
    async drop_fk(model){
        const faltante = await utils.compare_properties(model, this.db_name, this.tb_name, this.cursor)
        if(faltante === undefined){
            return undefined
        }
        let d_queries = []
        for(let f of faltante){
            if(model[f.split(" ")[0]] === undefined){
                d_queries.push(' DROP FOREIGN KEY `'+`${f.split(" ")}`+'`;,')
            }else{
                return undefined
            }
        }
        const texto = d_queries.join("")
        const trim = texto.substring(0, texto.length-1)
        return trim
    }
    async rename_columns(model){
        const db_properties = await utils.get_table_column(this.db_name, this.tb_name, this.cursor)
        const {keys, values} = utils.get_model_properties(model)
        let old_column;
        let rename_queries = [];
        for(let p in db_properties){
            if(model[db_properties[p]] === undefined){
                old_column = p
                rename_queries.push(` rename column ${db_properties[p]} to ${keys[old_column]},`)
            }
        }
        const texto = rename_queries.join("")
        const trim = texto.substring(0, texto.length-1)
        return trim

    }
    async compare_columns_types(model){
        const model_types = utils.get_model_column_type(model);
        const table_types = await utils.get_table_column_type(this.db_name, this.tb_name, this.cursor);
        const {keys} = utils.get_model_properties(model)
        let different = [];
        for(let mct in model_types){
           if(table_types[mct] !== model_types[mct]){
               different.push({
                   column: keys[mct],
                   type: model_types[mct]

               })
           }
        }
        return different
    }
    async change_columns_type(model){
        /*
         * ALTER TABLE `consulta`.`users` 
            CHANGE COLUMN `password` `password` VARCHAR(200) NOT NULL ,
            CHANGE COLUMN `rol` `rol` VARCHAR(100) NULL DEFAULT NULL ;
        */
        const different = await this.compare_columns_types(model)
        let querie = []
        for(let dp of different){
            querie.push(` change column ${dp['column']} ${dp['column']} ${dp['type']},`)
        }
        const texto = querie.join("")
        const trim = texto.substring(0, texto.length-1)
        return trim
    }
    async make_migration(model, ref_model, ref_tb_name){
        const new_columns = await this.add_columns(model)
        const d_columns = await this.drop_columns(model)
        const fd_columns = await this.drop_fk(model)
        const rn_columns = await this.rename_columns(model)
        const rn_column_type = await this.change_columns_type(model)
        console.log({
            new_columns,
            d_columns,
            fd_columns,
            rn_columns,
            rn_column_type
        })
        if(new_columns !== undefined && new_columns !== ''){
            const faltante = await utils.compare_properties(model, this.db_name, this.tb_name, this.cursor)
            let migration = Promise.all([this.alter_table(new_columns)])
            if(ref_model !== undefined && ref_tb_name !== undefined){
                const fk = utils.get_foreign_key(ref_model);
                const isPK = utils.add_primary_key(faltante)
                const isFK = utils.add_foreign_key(faltante, ref_tb_name, fk)
                const pk_fk_columns = await this.add_pk_or_fk(isPK, isFK, fk)
                migration = Promise.all([this.alter_table(pk_fk_columns)])
                console.log({
                    pk_fk_columns
                })
            }
            return migration
        }
        if(fd_columns !== undefined && fd_columns !== ''){
            const migration = Promise.all([this.alter_table(fd_columns)])
            return migration
        }
        if(d_columns !== undefined && d_columns !== ''){
            const migration = Promise.all([this.alter_table(d_columns)])
            return migration
        }
        if(rn_columns !== ''){
            const migration = await this.alter_table(rn_columns)
            return migration
        }
        if(rn_column_type !== ''){
            const migration = await this.alter_table(rn_column_type)
            return migration
        }
    }

}

module.exports = Migrations
