
const Debug = {
    name: "DEBUG",
    callback(context, args) {
        console.log(context.getMemory());
    },
}

module.exports = Debug;
