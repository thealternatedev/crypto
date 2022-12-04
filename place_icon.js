const path = require('path');
let rcedit = require('rcedit');
let xpath = process.argv[2];

console.log(xpath);

xpath = path.join(__dirname, xpath);

console.log("> Trying to edit " + xpath);
if (!xpath.endsWith(".exe")) {
    console.log("> Unable to edit a non windows executable file.");
    process.exit(0);
}
rcedit(xpath, { icon: path.join(__dirname, "icon.ico"), "file-version": "1.0.0", "version-string": "1.0.0", "product-version": "1.0.0" });
console.log("> Done!");