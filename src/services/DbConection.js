import {mysql2 as mysql} from "mysql2"
import DbConfig from "../utils/DbConfig";

export default class DbConection {
    constructor(config = new DbConfig("")) {
        this.config = config
    }
    normal_conection() {
        return mysql.createConnection(config.normal_config())
    }
    pool_conection() {
        return mysql.createPool(config.pool_config())
    }
}
