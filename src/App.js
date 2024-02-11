//dependencias
const operations = require('./services/Operations')
const conn = require('./services/DbConection')
const User = require('./model/DbModel')


// model instance
const model = new User()
model.initDB()

// instance of database connection
const cursor = conn.normal_conection()

// database and table operations
const op = new operations('consulta', 'users', cursor, model)



/*
op.make_migrations()
.then((res) => {return res})
.catch((err) => {throw Error(err)})
*/
