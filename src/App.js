const operation = require('./services/Operations')
const nUser = {
    nombre: 'mio',
    email: 'mio@gmail',
    password: 'mio'
}
operation.save(nUser)
.then((res) => console.log(res))
.catch((err) => {throw err})
