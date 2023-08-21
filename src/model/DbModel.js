
//validar datos modelos
const User = {
    id: 'int not null unique primary key auto_increment',
    nombre: 'varchar(100) not null unique',
    email: 'varchar(100) not null unique',
    password: 'varchar(100) not null unique',
    rol: 'varchar(50)',
    create_at: 'datetime not null',
    update_at: 'datetime'
}
/*
    apellido: 'varchar(100) not null',
    dasad: 'varchar(100)',
 */
module.exports = User
