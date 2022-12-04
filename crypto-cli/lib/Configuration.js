const { existsSync, readFileSync, writeFileSync } = require("fs");
const { homedir } = require("os");
const path = require("path");

class Configuration extends Map {

    constructor(filename) {
        super();
        this.filename = filename;
        this.loadConfiguration();
    }

    loadConfiguration() {
        if (existsSync(path.join(homedir(), ".crypto_cli", this.filename))) {
            let json = JSON.parse(readFileSync(path.join(homedir(), ".crypto_cli", this.filename), "utf-8"));
            for (let [key, value] of Object.entries(json)) {
                this.set(key, value);
            }
        }
    }

    toString() {
        return JSON.stringify(this.toJSON(), null, 4);
    }

    toJSON() {
        let o = {};

        this.forEach((v, k) => {
            o[k] = v;
        });

        return o;
    }

    saveConfiguration() {
        writeFileSync(path.join(homedir(), ".crypto_cli", "configuration.crypto.json"), this.toString());
    }
}
module.exports = Configuration;