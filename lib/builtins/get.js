const get = {
    name: "GET",
    callback(context, args) {
        console.log(context.getMemory()[context.getCurrentAddress()]);
    },
}
module.exports = get;
