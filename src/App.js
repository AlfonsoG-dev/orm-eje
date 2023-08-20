const operation = require('./services/Operations')

const uUser = {
    id: 5,
    nombre: 'test_mio',
    rol: 'test',
}
operation.update(uUser)
.then((res) => console.log(res))
.catch((err) => {throw err})
