const Context = require("..")

module.exports = {
    name: "SECTION",
    /**
     * 
     * @param {Context} context 
     * @param {string[]} args 
     */
    callback: (context, args) => {
        if (!args || !args.length) {
            console.log(context.currentSection);
        } else {
            let [name] = args;
            context.setCurrentSection(name);
        }

    }
}