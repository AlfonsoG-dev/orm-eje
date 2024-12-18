
/**
 * la primary key debe tener el identificador pk => id_pk
 * la foreign key debe tener el identificador fk => mio_fk
 */
export default class User {
    constructor(nombre = "", email = "", password = "", rol = "") {
        this.nombre = nombre
        this.email = email
        //apellido = apellido
        this.password = password
        this.rol = rol
    }
    initDB() {
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
