const operation = require('./services/Operations')

//operation.test_db('consulta')
//operation.create_table('consulta')
operation.read({options: 'nombre, email, password', limit: '1'})
.then((res) => {return})
.catch((err) => {throw Error(err)})

const buscado = {
    where: {
        nombre:'test',
        email: 'test@gmail',
        password: 'test'
    }
}
operation.find({
    where:{
        nombre: 'alfonso'
    }
})
.then((res) => console.log(res))
.catch((err) => {throw err})
