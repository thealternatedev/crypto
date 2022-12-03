const Context = require("..");

module.exports = {
    name: "MOV",
    /**
     * 
     * @param {Context} context 
     * @param {string[]} args 
     */
    callback: (context, args) => {
        let [address1, address2] = args;
        let v = context.getMemory()[parseInt(address2)];
        context.getMemory()[parseInt(address1)] = v;
    }
}