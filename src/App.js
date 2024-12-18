//dependencias
import Operaciones from './services/Operations'
import User from "./model/DbModel.js"
import DbConfig from "./utils/DbConfig.js"
import DbConection from "./services/DbConection"


// model instance
const model = new User()
const config = new DbConfig()
model.initDB()

// instance of database connection
const cursor = new DbConection(config).normal_conection('consulta')

// database and table operations
const op = new Operaciones('consulta', 'users', cursor, model)
/*
op.make_migrations()
    .then((res) => {console.log(res)})
    .catch((err) => {throw Error(err)})
*/
