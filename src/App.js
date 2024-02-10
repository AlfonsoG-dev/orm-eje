//dependencias
const operations = require('./services/Operations')
const conn = require('./services/DbConection')
const User = require('./model/DbModel')


//instancias
const model = new User()
model.initDb()
const op = new operations('consulta', 'users', conn.normal_conection(), model)

/*
op.make_migrations()
.then((res) => {return res})
.catch((err) => {throw Error(err)})
*/
