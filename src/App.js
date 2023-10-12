//dependencias
const operations = require('./services/Operations')
const conn = require('./services/DbConection')
const models = require('./model/DbModel')


//instancias
const User = new models.User()
const op = new operations('test_db', 'test', conn.normal_conection(), User)

op.make_migrations()
.then((res) => {return res})
.catch((err) => {throw Error(err)})
