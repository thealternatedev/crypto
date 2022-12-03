const Context = require("..")

module.exports = {
    name: "INC",
    /**
     * 
     * @param {Context} context 
     * @param {string[]} args 
     */
    callback: (context, args) => {
        let v = context.getMemory()[context.getCurrentAddress()];
        v += 1;
        context.setMemory(context.getCurrentAddress(), v);
    }
}