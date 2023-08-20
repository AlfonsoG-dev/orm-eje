const operations = require('./services/Operations')
const conn = require('./services/DbConection')
const op = new operations('test_db', 'test', conn.normal_conection('test_db'))

op.read({options: 'nombre, email'})
.then((res) => console.log(res))
.catch((err) => {throw err})

op.find({
    where: {
        id: 1
    }
})
.then((res) => console.log(res))
.catch((err) => {throw err})

/*const u = {
    nombre: 'test',
    email: 'test@test',
    password: 'test',
    rol: 'test'
}
op.save(u)*/
