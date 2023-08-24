# Proyecto para recrear la funcionalidad de un ORM en JS

## dependencias externas
>>- [mysql server 8.0.34](https://dev.mysql.com/downloads/mysql/)
>>- [nodeJS 18.17.0](https://nodejs.org/es)

## Dependencias internas
>>- mysql2
>>- npm


## Instalación y uso

>>- copiar el repositorio: `git clone https://github.com/AlfonsoG-dev/orm-eje.git`
>>- ingresar a la carpeta: `cd ./orm-eje`
>>- instalar las dependencias: `npm i`
>>- ejecutar el programa: `npm start`

### Uso

>>- conexión a base de datos: por el momento solo funciona con `mysql`
```js
normal_conection: function(db_name = ''){
        return mysql.createConnection({
            host: 'localhost',
            user: 'test_user',
            password: '5x5W12',
            database: db_name
        })

```

>>- modelo para la base de datos:
>>- en la carpeta _Models_: `mkdir ./src/model` -> crear el archivo "DbModel.js": `touch DbModel.js`
>>- en el archivo crear los modelos necesarios
```js
class User{
    user_id_pk = 'int not null unique primary kay auto_increment'
    nombre = 'varchar(100) not null'
    email = 'varchar(100) not null unique'
}
```

>>- uso de las operaciones

```js
//dependencias
const operations = require('./services/Operations')
const conn = require('./services/DbConection')
const models = require('./model/DbModel')


//instancias
const User = new models.User()
const op = new operations('test_db', 'test', conn.normal_conection(), User)


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
```

## Uso para las migraciones
>>- para migrar las propiedades del modelo a la base de datos es necesario llamar el método de manera manual
```js
//dependencias
const operations = require('./services/Operations')
const conn = require('./services/DbConection')
const models = require('./model/DbModel')

//instancias
const User = new models.User()
const op = new operations('test_db', 'test', conn.normal_conection(), User)

//realizar migración
op.make_migrations()
.then((res) => {return res})
```
## Migraciones 
>- por el momento solo soporta los siguientes métodos
>>- crear base de datos
>>- crear tabla en base al modelo
>>- agregar columnas
>>- renombrar columnas
>>- eliminar columnas 
>- todo lo anterior se realiza de manera automática 
>- solo debes hacer modificaciones al modelo

---

>- solo el llamar esté método permite migrar las modificaciones del modelo de manera automática 

```js
op.make_migrations()
.then((res) => {return res})
```
>- al llamar el siguiente método se crea la base de datos y la tabla en base al modelo
```js
const op = new operations('test_db', 'test', conn.normal_conection(), User)
```
>>- 'test_db' : nombre de la base de datos.
>>- 'test' : nombre de la tabla
>>- 'conn.normal_conection()' : conexión a la base de datos
>>- 'User' : clase modelo para la tabla de la base de datos

## Uso para relacionar con otro modelo

### Llave foranea
>>- se debe crear en el modelo que lleva la llave foranea una propiedad que tenga de nombre: `nombrePropiedadfk`.
>>- si no tiene en el nombre `fk` no se puede realizar la creación de la llave foranea 
### Llave que referencia
>>- la llave primaria del modelo al que se hace referencia debe tener: `nombrePropiedadpk`
>>- si no tienen en el nombre `pk` no se puede hacer la referencia 


-> En los modelos se crean las siguientes propiedades para la relacionar
```js
class Cuenta{
    cuenta_id_pk = '' // llave de referencia
}

class User{

    cuenta_id_pk = '' // llave foranea
}
```

-> en la clase pricipal se relacionan
```js
const userOp = new operations(database, table, conexión)
const cuentaOp = new opreations(database, table, conexion)

userOp.make_migrations(new Cuenta(), cuentaTable)
.then((res) => {return res})
```

---
>>- Al teminar la migración de los datos, si se ejecuta de nuevo se lanza el siguiente error: 
`Error: Error: no se puede migrar datos que no existen
    at Operaciones.make_migrations (C:\JavaScript\orm-eje\src\services\Operations.js:155:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) `

>>- Ya que el modelo es el mismo que la tabla en la base de datos no es necesario ejecutar la migración
>>- Por lo tanto al terminar la migracion eliminar o comentar el llamado al método de migración

---

# Disclaimer
>>- Este proyecto tiene el objetivo de replicar la funcionalidad de un ORM
>>- No se tiene en cuenta medidas de seguridad como SQL inyection entre otros
>>- Simplemente es un proyecto para aprender sobre JS y la forma en la que un ORM se comporta
