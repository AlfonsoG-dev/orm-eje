//dependencias
const Operaciones = require('./services/Operations')
const conn = require('./services/DbConection')
const User = require('./model/DbModel')


// model instance
const model = new User()
model.initDB()

// instance of database connection
const cursor = conn.normal_conection('consulta')

// database and table operations
const op = new Operaciones('consulta', 'users', cursor, model)
/*
op.make_migrations()
    .then((res) => {console.log(res)})
    .catch((err) => {throw Error(err)})
*/
