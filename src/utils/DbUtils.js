const utils = {
    get_properties: function(obj = {}){
        const keys = Object.keys(obj)
        const values = Object.values(obj)
        return {
            keys,
            values,
        }
    },
    get_clean_properties: function(nUser = {}){
        const properties = this.get_properties(nUser)
        const k = properties['keys']
        const v = properties['values']
        //console.log(k)
        //console.log(v)
        let completas = [];
        for(let pr in k){
            completas.push(`${k[pr]} ${v[pr]},`)
        }
        const texto = completas.join(" ")
        const trim = texto.substr(0, texto.length-1)
        //console.log(trim)
        return trim
    }
}

module.exports = utils

