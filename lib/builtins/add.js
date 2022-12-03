const Context = require("..")

module.exports = {
    name: "ADD",
    /**
     * 
     * @param {Context} context 
     * @param {string[]} args 
     */
    callback: (context, args) => {
        let [amount] = args;
        let v = context.getMemory()[context.getCurrentAddress()];
        v += parseInt(amount);
        context.setMemory(context.getCurrentAddress(), v);
    }
}