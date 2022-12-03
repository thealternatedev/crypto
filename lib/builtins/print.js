
 const prn = {
    name: "PRINT",
    callback(context, args) {
        process.stdout.write(String.fromCharCode(context.getMemory()[context.getCurrentAddress()]));
    },
}

module.exports = prn;