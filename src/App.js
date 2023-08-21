//dependencias
const operations = require('./services/Operations')
const conn = require('./services/DbConection')

//instancias
const op = new operations('test_db', 'test', conn.normal_conection())
op.count_column({options: ['create_at']})
.then((res) => console.log(res))
.catch((err) => {throw err})
//
/*op.read({options: 'nombre, email', limit: 1})
.then((res) => console.log(res))
.catch((err) => {throw err})*/


op.make_migrations()
.then((res) => {return res})

