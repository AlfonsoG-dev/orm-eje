import assert from "assert"
export default class QueryBuilder {
    tb_name
    constructor(tb_name) {
        this.tb_name = tb_name
    }
    static trim_query(type="", sentence) {
        switch(type.trim().toLowerCase()) {
            case "and":
                return sentence.substring(0, sentence.length-4)
            case "or":
                return sentence.substring(0, sentence.length-3)
        }
    }
    select_all(clause={}, type="", limit=0, offset=0) {
        const keys = Object.keys(clause)
        assert.notEqual(keys.length, 0)

        let where_clause = ""
        let values = []

        for(let k of keys) {
            if(clause[k] !== null) {
                where_clause += `${k}=? ${type.toUpperCase()}`
                values.push(clause[k])
            }
        }

        values.push(limit)
        values.push(offset)


        assert.notEqual(where_clause.length, 0)
        where_clause = QueryBuilder.trim_query(type, where_clause)
        return {
            sql: `SELECT * FROM ${this.tb_name} WHERE ${where_clause} LIMIT ? OFFSET ?`,
            values: values
        }
    }
    /**
     * builder method for select sentences.
     * @param model the object with the data
     * @param type the where logic type
     * @returns
    */
    select_query(columns=[], model, type="") {
        const keys = Object.keys(model)
        assert.notEqual(keys.length, 0)
        let where_clause = ""
        let values = []

        for(let k of keys) {
            if(model[k] !== null) {
                where_clause += `${k}=? ${type.toUpperCase()}`
                values.push(model[k])
            }
        }
        assert.notEqual(where_clause.length, 0)
        where_clause = QueryBuilder.trim_query(type, where_clause)
        return {
            sql: `SELECT ${columns.join(", ")} FROM ${this.tb_name} WHERE ${where_clause}`,
            values: values
        }
    }
    /**
     * builder method for insert sentences.
     * @param model the request object with the stract data.
     * @returns the sql sentence & the query prepared values.
    */
    insert_query(model) {
        const keys = Object.keys(model)
        let where_values = []
        let where_names = []
        let values = []

        for(let k of keys) {
            if(model[k] !== null) {
                where_values.push("?")
                where_names.push(k)
                values.push(model[k])
            }
        }

        return {
            sql: `INSERT INTO ${this.tb_name} (${where_names.join(', ')}) VALUES (${where_values.join(', ')})`,
            values: values
        }
    }

    /**
     * builder method for update sentences.
     * @param model the object with the request object to stract the data.
     * @param clause indicates what value from model should be used to create the condition.
     * @returns the sql sentence and the values for the prepared statement
    */
    update_query(model, clause=[]) {
        const keys = Object.keys(model)
        let set_clause = []
        let where_clause = clause
        let values = []
        let condition = ""

        for (let k of keys) {
            if (!where_clause.includes(k)) {
                set_clause.push(`${k}=?`)
                values.push(model[k])
            }
        }
        for(let i of where_clause) {
            values.push(model[i])
            condition += i + "=? AND "
        }
        condition = condition.substring(0, condition.length-5)

        return {
            sql: `UPDATE ${this.tb_name} SET ${set_clause.join(', ')} WHERE ${condition}`,
            values: values
        }
    }
}
