
/**
 * la primary key debe tener el identificador pk => id_pk
 * la foreign key debe tener el identificador fk => mio_fk
 */
class User {
    constructor(){
        this.id_pk = 'int not null unique primary key auto_increment'
        this.nombre = 'varchar(100) not null unique'
        this.email = 'varchar(100) not null unique'
        //apellido = 'varchar(100) not null unique'
        this.password = 'varchar(100) not null'
        this.rol = 'varchar(50)'
        this.create_at = 'datetime not null'
        this.update_at = 'datetime'
    }
}
/*
    apellido= 'varchar(100) not null'
    dasad= 'varchar(100)'
    cuenta_id_fk = 'int not null'
 */
module.exports = {User}
