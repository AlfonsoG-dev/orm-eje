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
    id: 'int not null unique primary key auto_increment',
    nombre: 'varchar(100) not null unique',
    email: 'varchar(100) not null unique',
    password: 'varchar(100) not null unique',
    rol: 'varchar(50)',
    create_at: 'datetime not null',
    update_at: 'datetime'
}

const utils = {
    get_properties: function(obj = {}){
        const keys = Object.keys(obj)
        const values = Object.values(obj)
        return {
            keys,
            values,
        }
    }
}

const properties = utils.get_properties(User)
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
console.log(trim)
async function call(){
    const con = db_conection.normal_conection("localhost", "test_user", "5x5W12", "consulta")
    const data = await con.execute(`create table if not exists test(${trim})`)
    if(data !== undefined){
        console.log(data)
    }
}

call()
