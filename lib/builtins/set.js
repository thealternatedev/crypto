
const set = {
    name: "SET",
    callback(context, args) {
        let [v] = args;
        context.setMemory(context.getCurrentAddress(), parseInt(v));
    },
}

module.exports = set;