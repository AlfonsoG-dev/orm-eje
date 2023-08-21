
/**
 * la primary key debe tener el identificador pk => id_pk
 * la foreign key debe tener el identificador fk => mio_fk
 */
class User {
    id_pk = 'int not null unique primary key auto_increment'
    nombre = 'varchar(100) not null unique'
    email = 'varchar(100) not null unique'
    //apellido = 'varchar(100) not null unique'
    password = 'varchar(100) not null'
    rol = 'varchar(50)'
    create_at = 'datetime not null'
    update_at = 'datetime'
}
/*
    apellido= 'varchar(100) not null'
    dasad= 'varchar(100)'
    cuenta_id_fk = 'int not null'
 */
module.exports = {User}
