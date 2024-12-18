import {mysql2 as mysql} from "mysql2"
import DbConfig from "../utils/DbConfig";

export default class DbConection {
    constructor(config = new DbConfig()) {
        this.config = config
    }
    normal_conection(db_name = '') {
        return mysql.createConnection(config.normal_config(db_name))
    }
    pool_conection(db_name = '') {
        return mysql.createPool(config.pool_config(db_name))
    }
}
