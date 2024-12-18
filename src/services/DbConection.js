import mysql2 from "mysql2"
import DbConfig from "../utils/DbConfig.js";

export default class DbConection {
    constructor(config = new DbConfig("")) {
        this.config = config
    }
    normal_conection() {
        return mysql2.createConnection(this.config.normal_config())
    }
    pool_conection() {
        return mysql2.createPool(this.config.pool_config())
    }
}
