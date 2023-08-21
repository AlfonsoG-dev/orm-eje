const utils = {

    get_properti_fields: function(db_name, tb_name, cursor){
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

    get_column_name: async function(db_name, tb_name, cursor){
        const data = await this.get_properti_fields(db_name, tb_name, cursor)
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
        if(m_model === undefined){
            throw Error("el modelo es necesario")
        }
        const db_properties = await this.get_column_name(db_name, tb_name, cursor)
        const model_properties = this.get_properties(m_model)
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
    get_properties: function(obj = {}){
        const keys = Object.keys(obj)
        const values = Object.values(obj)
        return {
            keys,
            values,
        }
    },
    get_clean_properties: function(nUser = {}){
        const properties = this.get_properties(nUser)
        const k = properties['keys']
        const v = properties['values']
        //console.log(k)
        //console.log(v)
        let completas = [];
        for(let pr in k){
            completas.push(`${k[pr]} ${v[pr]},`)
        }
        const texto = completas.join(" ")
        const trim = texto.substr(0, texto.length-1)
        //console.log(trim)
        return trim
    },
    get_find_properties: function(obj = {}){
        //console.log(where)
        const data = utils.get_properties(obj)
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
    }
}

module.exports = utils

