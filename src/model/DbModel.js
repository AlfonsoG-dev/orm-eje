
/**
 * la primary key debe tener el identificador pk => id_pk
 * la foreign key debe tener el identificador fk => mio_fk
 */
class User {
    id_pk
    nombre
    email
    password
    rol
    create_at
    update_at
    constructor(id_pk = 0, nombre = "", email = "", password = "", rol = "") {
        this.id_pk = id_pk
        this.nombre = nombre
        this.email = email
        //apellido = apellido
        this.password = password
        this.rol = rol
        this.create_at = new Date(Date.now)
        this.update_at = undefined
    }
    initDb() {
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
module.exports = User
