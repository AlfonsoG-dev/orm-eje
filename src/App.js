//dependencias
import Operaciones from './services/Operations.js'
import User from "./model/DbModel.js"
import DbConfig from "./utils/DbConfig.js"
import DbConection from "./services/DbConection.js"


// model instance
const model = new User()
const config = new DbConfig("consulta")
model.initDB()

// instance of database connection
const cursor = new DbConection(config).normal_conection()

// database and table operations
const op = new Operaciones('consulta', 'users', cursor, model)

//op.save(new User("testing", "testing@gmail.com", "asdf", "worker"))
//    .then((res) => console.log(res))
//    .catch((err) => console.error(err))
