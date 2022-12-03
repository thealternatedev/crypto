
const Clear = {
    name: "CLEAR",
    callback(context, args) {
        context.resetMemory();
    },
}

module.exports = Clear;