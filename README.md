# My ORM
- ORM like app in javascript
- i try to recreate an orm functionality in javascript

# External dependencies
>- [mysql server 8.0.34](https://dev.mysql.com/downloads/mysql/)
>- [nodeJS 20.9.0](https://nodejs.org/es)

# Other dependencies 
>- mysql2
>- npm

# Features
- [x] count operation
- [x] select using: patterns, where clause, in clause
- [x] CRUD operations
- [x] inner join operation
- [x] migration operations 


# Instructions

>- `git clone https://github.com/AlfonsoG-dev/orm-eje.git`
>- `cd ./orm-eje`
>- `npm install`
>- `npm start`

# Usage

>- create in the `utils` directory a file name: *DbConfig* with the following class
```js
class DbConfig {
    normal_config(db_name = "") {
        return  {
            host: "my_ip_host",
            user: "database_user",
            password: "user_password",
            database: db_name
        }
    }
    pool_config(db_name = "") {
        return {
            connectionLimit: limit of concurrent connections,
            host: 'my_ip_host',
            user: 'database_user',
            password: 'user_password',
            database: db_name
        }
    }

}
```

>- create the model for the database:
>- create a folder -> `md ./src/model`
>- create a file with the name: "DbModel.js"
>- initialize the database state for model usage
```js
class User {
    user_id_pk
    nombre
    email
    constructor() {

    }
    initDB() {
        this.user_id_pk = 'int not null unique primary kay auto_increment'
        this.nombre = 'varchar(100) not null'
        this.email = 'varchar(100) not null unique'
    }
}
```

## Operations

```js
// dependencies
const operations = require('./services/Operations')
const conn = require('./services/DbConection')
const User = require('./model/DbModel')


// intances
const model = new User()

// initialize the database fields
model.initDB()

// create an operation instance
const op = new operations(
    'db_name',
    'tb_name',
    conn.normal_conection(),
    model
)


//contar 
op.count_column({options: ['create_at']})
.then((res) => console.log(res))
.catch((err) => {throw err})


//leer nombre y email de 2 registros
op.read({options: 'nombre, email', limit:2})
.then((res) => console.log(res))
.catch((err) => {throw err})

//buscar por id
op.find({
    options: ["nombre", "email"],
    where: {
        id: 1
    }
})
.then((res) => console.log(res))
.catch((err) => {throw err})

//buscar entre varios valores
op.findIn("nombre", ['alfonso', 'test', 'admin'])
.then((res) => console.log(res))
.catch((err) => {throw err})

//buscar por patron para varias columnas
op.findPattern("admin", ['nombre', 'rol'])
.then((res) => console.log(res))
.catch((err) => {throw err})

// busca valor max and min
const condition = {
    nombre: "alfonso"
}
const options = {
    min: ["password"],
    max: ["create_at"]
}
op.find_min_max(condition, options, "and")
.then((res) => console.log(res))
.catch((err) => { throw err })

//modelo del usuario 
const u = {
    nombre: 'test',
    email: 'test@test1',
    password: 'test',
    rol: 'test'
}
// registrar usuario
op.save(u)
.then((res) => console.log(res))
.catch((err) => {throw err})

const modificar = {
    nombre: 'test',//para la condición no para actualizar
    email: 'test@admin',//para actualizar desde aqui
    password: 'test123',
    rol: 'test1'
}

//actualizar por nombre
op.update(modificar)
then((res) => console.log(res))
.catch((err) => {throw err})

//eliminar por id
op.delete({
    id: 2
}).then((res) => console.log(res))
.catch((err) => {throw err})

//innerJoin
class Cuentas {
    cuenta_id_pk = 'int not null unique'
    nombre = ''
    email = ''
    user_id_fk = ''
}
op.innerJoin({local_op: ["id_pk", "nombre"], ref_op: ["nombre, email"]}, new Cuentas(), 'cuentas', 'consulta')
.then((res) => console.log(res))
.catch((err) => {throw Error(err)})
```

## Migration usage
- migrations are make base on the database table model
>- you can make changes in the model and later run the migrations to update the database table fields
```js
//dependencias
const operations = require('./services/Operations')
const conn = require('./services/DbConection')
const User = require('./model/DbModel')

// instances
const model = new User()
const op = new operations('db_name', 'tb_name', conn.normal_conection(), model)

// make migrations
op.make_migrations()
.then((res) => {return res})
```
## Migration features 
- [x] create database
- [x] create table base on javascript classes as models
- [x] add, rename, delete, modify columns
- [x] dynamic loading of migrations

## Make relationships

### Foreign key
>- when you declara a *FK* use the following style: `name_id_fk`.
### Primary key
>- when you declare a *PK* use the following style: `id_pk`


>- the relations in the models looks like:
```js
class Cuenta{
    user_id_fk = '' // foreign key
}

class User{
    id_pk = '' // promary key
}
```

## Relationship usage

```js
//modelos
const foreignModel = new User()
const primaryModel = new Cuenta()

//operaciones
const userOP = new operations(database, table, conexión, foreignModel)
const cuentaOP = new opreations(database, table, conexion, primaryModel)

userOP.make_migrations(new Cuenta(), "cuenta_table_name")
.then((res) => { return res })
.cathc((err) => { throw err })
```

---

# Disclaimer
- this project is for educational purposes.
- security issues are not taken into account.
- its intended to replicate an ORM functionality.
- this project is to learn about javascript and ORM behaviors
