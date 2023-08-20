const operation = require('./services/Operations')

console.log(operation.test_db('consulta'))
operation.create_table('consulta')
