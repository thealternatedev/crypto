
 const prnln = {
    name: "PRINTLN",
    callback(context, args) {
        process.stdout.write(String.fromCharCode(context.getMemory()[context.getCurrentAddress()]) + "\n");
    },
}

module.exports = prnln;