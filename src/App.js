const operation = require('./services/Operations')

//operation.test_db('consulta')
//operation.create_table('consulta')
operation.read({options: 'nombre, email, password', limit: '1'})
.then((res) => console.log(res))
.catch((err) => {throw Error(err)})

