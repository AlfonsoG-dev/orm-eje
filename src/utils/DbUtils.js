const utils = {

    get_table_properties: function(db_name, tb_name, cursor){
        if(db_name === undefined || tb_name === undefined){
            throw Error("es necesario el nombre de la tabla y base de datos")
        }
        return new Promise((resolve, reject) => {
            cursor.execute(`show columns from ${db_name}.${tb_name}`, function(err, res){
                if(err) reject(err)
                resolve(res)
            })
        })
    },

    get_table_column: async function(db_name, tb_name, cursor){
        const data = await this.get_table_properties(db_name, tb_name, cursor)
        const c_name = []
        for(let f of data){
            c_name.push(f['Field'])
        }
        return c_name
    },
    /*
     * retorna la propiedad adicional del modelo
     */
    compare_properties: async function(m_model, db_name, tb_name, cursor){
        if(m_model === undefined || db_name === undefined || tb_name === undefined || cursor === undefined){
            throw Error("falta pasar argumentos")
        }
        const db_properties = await this.get_table_column(db_name, tb_name, cursor)
        const model_properties = this.get_model_properties(m_model)
        const {keys, values} = model_properties
        if(db_properties.length === keys.length){
            return;
        }
        if(keys.length > db_properties.length){
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
        if(db_properties.length > keys.length){
            const faltante = db_properties.filter((k) => keys.includes(k) === false)
            return faltante
        }
    },
    get_model_properties: function(obj = {}){
        const keys = Object.keys(obj)
        const values = Object.values(obj)
        return {
            keys,
            values,
        }
    },
    get_key_value: function(nUser = {}){
        const properties = this.get_model_properties(nUser)
        const k = properties['keys']
        const v = properties['values']
        //console.log(k)
        //console.log(v)
        let completas = [];
        for(let pr in k){
            completas.push(`${k[pr]} ${v[pr]},`)
        }
        const texto = completas.join(" ")
        const trim = texto.substring(0, texto.length-1)
        //console.log(trim)
        return trim
    },
    get_asign_value: function(obj = {}){
        //console.log(where)
        const data = this.get_model_properties(obj)
        const keys = data['keys']
        const values = data['values']
        let tratado = []
        for(let i in keys){
            tratado.push(` ${keys[i]}='${values[i]}'`)
        }
        return tratado.toString()
    },
    get_condicional: function(properties = ''){
        return properties.replaceAll(',' , ' and')
    },
    get_date_format(){
        const date_now = new Date(Date.now())
        return date_now
    },

    /**
     * la columna ya debe haber sido creada para realizar la referencia
     */
    add_primary_key: function(keys){
        if(keys === undefined){
            throw Error("no hay primary_key parar agregar")
        }
        let ks = []
        for(let k of keys){
            let p = k.split(" ")[0]
            ks.push(p)
        }
        let primary_key = [];
        for(let k of ks){
            const b = k.match('pk')
            if(b !== null){
                primary_key.push(` add constrain ${b['input']} primary key (${b['input']})`)
            }
        }
        return primary_key
    },
    /*
     * la columna debe hacer sido creada para realizar la referencia
     * */
    add_foreign_key: function(keys, ref_tb_name, column_ref){
        if(keys === undefined){
            throw Error("no hay foreign_key parar agregar")
        }
        let ks = [];
        for(let k of keys){
            let p = k.split(" ")[0]
            ks.push(p)
        }
        let foreign_key = [];
        for(let k of ks){
            const b = k.match('fk')
            if(b !== null){
                foreign_key.push(` add constraint ${b['input']} foreign key (${b['input']}) references ${ref_tb_name}(${column_ref}) on delete cascade on update cascade`)
            }
        }
        return foreign_key
    },
    get_foreign_key: function(ref_model){
        if(ref_model === undefined){
            return undefined
        }
        const keys = Object.keys(ref_model)
        let fk = [];
        for(let p of keys){
            const b = p.match('pk')
            if(b !== null){
                fk.push(b['input'])
            }
        }
        return fk
    },
    get_model_column_type: function(obj){
        const {keys, values} = this.get_model_properties(obj);
        let model_column_types = []
        for(let mp of values){
            model_column_types.push(mp.split(' ').join(" "))
        }
        return model_column_types
    },
    get_table_column_type: async function(db_name, tb_name, cursor){
        const tb_properties = await this.get_table_properties(db_name, tb_name, cursor);
        let colums = []
        for(let tp of tb_properties){
            let querie = '';
            for(let op in tp){
                if(op === 'Type'){
                    querie = tp[op]
                }
                if(op === 'Null' && tp[op] === 'NO'){
                    querie += ' not null'
                }
                if(op === 'Key'){
                    if(tp[op] === 'PRI'){
                        querie += ' unique primary key'
                    }
                    if(tp[op] === 'UNI'){
                        querie += ' unique'
                    }

                }
                if(op === 'Extra'){
                    querie += ` ${tp[op]}`
                }
            }
            colums.push(querie.trimEnd())
        }
        return colums
    }
}

module.exports = utils

