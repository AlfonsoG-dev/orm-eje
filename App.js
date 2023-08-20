const mysql = require('mysql2')

const db_conection = {
    normal_conection: function(host = '', user = '', password = '', database = ''){
        return mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        })
    },
    pool_conection: function(){
        throw Error("not implemented yet")
    }
}

//validar datos modelos
const User = {
    id: 0,
    nombre: '',
    email: '',
    password: '',
    rol: ''
}

const utils = {
    get_properties: function(obj = {}){
        let valores = []
        let d;
        for(let p in obj){
            if(typeof obj[p] === 'string'){
                valores.push({[p]: 'varchar(100)'})
            }
            if(typeof obj[p] === 'number'){
                valores.push({[p]: 'int'})
            }
            if(p === 'id'){
                 d = valores.at(valores.indexOf('int'))
                 d['id'] = `${d['id']} primary key auto_increment`
            }
        }
        return valores
    },
    transformar_valores: function(lista = []){
        let mio = {}
        for(let v of lista){
            mio = Object.assign(mio, v)
        }
        return mio
    }
}

const properties = utils.get_properties(User)
//console.log(properties)
const list = utils.transformar_valores(properties)
const nombres = Object.keys(list)
const tipos = Object.values(list)
//console.log(`${nombres} ${tipos}`)
    let completas = ''
for(let a in nombres){
    completas +=` ${nombres[a]} ${tipos[a]},`
}
const triling = completas.substr(0, completas.length-1)
//console.log(triling)
async function call(){
    const con = db_conection.normal_conection("localhost", "test_user", "5x5W12", "consulta")
    const data = await con.execute(`create table test (${triling})`)
    if(data !== undefined){
        console.log(data)
    }
}

call()
