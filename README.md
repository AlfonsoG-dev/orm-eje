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

# Disclaimer
>>- Este proyecto tiene el objetivo de replicar la funcionalidad de un ORM
>>- No se tiene en cuenta medidas de seguridad como SQL inyection entre otros
>>- Simplemente es un proyecto para aprender sobre JS y la forma en la que un ORM se comporta
