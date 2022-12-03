
const pos = {
    name: "POS",
    callback(context, args) {
        let [address] = args;
        context.setCurrentAddress(parseInt(address));
    },
}

module.exports = pos;