const db_conection = require('./services/DbConection')
const con = db_conection.normal_conection("localhost", "test_user", "5x5W12", "consulta")
const User = require('./model/DbModel')
const utils = require('./utils/DbUtils')
const trim = utils.get_clean_properties(User)
async function call(){
    const data = await con.execute(`create table if not exists test(${trim})`)
    if(data !== undefined){
        console.log(data)
    }
}

call()
