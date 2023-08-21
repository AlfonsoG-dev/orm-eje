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

>>- uso de las operaciones

```js
const operations = require('./services/Operations')
const conn = require('./services/DbConection')
const op = new operations('test_db', 'test', conn.normal_conection('test_db'))

//leer nombre y email de 2 registros
op.read({options: 'nombre, email', limit:2})
.then((res) => console.log(res))
.catch((err) => {throw err})

//buscar por id
op.find({
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

//instancias
const op = new operations('test_db', 'test', conn.normal_conection())

//realizar migración
op.make_migrations()
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
