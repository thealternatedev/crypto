const Context = require("..")

module.exports = {
    name: "LOOP",
    /**
     * 
     * @param {Context} context 
     * @param {string[]} args 
     */
    callback: (context, args) => {
        let amountInt;

        if (!args || !args.length) {
            amountInt = -1;
        } else {
            let [ amount ] = args;
            amountInt = parseInt(amount);
        }        

        context.loop(amountInt);
    }
}