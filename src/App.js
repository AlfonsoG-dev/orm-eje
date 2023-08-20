const operation = require('./services/Operations')

const eliminar = {
    id: 5, 
    nombre: 'test_mio',
}

operation.delete(eliminar)
.then((res) => console.log(res))
.catch((err) => {throw err})
