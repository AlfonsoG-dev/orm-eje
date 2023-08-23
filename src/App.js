//dependencias
const operations = require('./services/Operations')
const conn = require('./services/DbConection')
const models = require('./model/DbModel')


//instancias
const User = new models.User()
const op = new operations('test_db', 'test', conn.normal_conection(), User)
op.find({options: ["nombre", "email"], where: {id_pk: 2}})
.then((res) => console.log(res))
.catch((err) => {throw err})

//
/*op.read({options: 'nombre, email', limit: 1})
.then((res) => console.log(res))
.catch((err) => {throw err})*/


op.make_migrations()
.then((res) => {return res})

