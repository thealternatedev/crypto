const { isEmpty } = require("lodash");
const { isNull } = require("lodash");
const Clear = require("./builtins/Clear");
const Debug = require("./builtins/Debug");
const get = require("./builtins/get");
const pos = require("./builtins/pos");
const prn = require("./builtins/print");
const set = require("./builtins/set");
const { createLogger } = require("flaps-logger");
const dec = require("./builtins/dec");
const inc = require("./builtins/inc");
const mov = require("./builtins/mov");
const prnln = require("./builtins/println");
const add = require("./builtins/add");
const section = require("./builtins/section");
const loop = require("./builtins/loop");
const FlapsLogger = createLogger();

class Context {
    

    /**
     * 
     * @param {string} code 
     */
    constructor(code) {
        this.pos = 0;
        this.code = code;
        this.memory = [];
        this.builtins = new Map();
        this.lastInstructions = [];
        this.currentSection = "";
        this.currentAddress = 0;
        this.commentTag = ";";

        this.registerBuiltin(Clear);
        this.registerBuiltin(Debug);
        this.registerBuiltin(get);
        this.registerBuiltin(pos);
        this.registerBuiltin(prn);
        this.registerBuiltin(set);
        this.registerBuiltin(dec);
        this.registerBuiltin(inc);
        this.registerBuiltin(mov);
        this.registerBuiltin(prnln);
        this.registerBuiltin(add);
        this.registerBuiltin(section);
        this.registerBuiltin(loop);
    }
    
    setCommentTag(commentTag) {
        this.commentTag = commentTag;
    }

    getCommentTag() {
        return this.commentTag;
    }

     getCurrentAddress() {
        return this.currentAddress;
    }

    getCurrentSection() {
        return this.currentSection;
    }

    setCurrentSection(name) {
        this.currentSection = name;
    }

     setMemory(idx, v) {
        this.memory[idx] = v;
    }

     setCurrentAddress(address) {
        this.currentAddress = address;
    }

     registerBuiltin(builtin) {
        this.builtins.set(builtin.name, builtin);
    }

     resetMemory() {
        this.memory = [];
    }

    getBuiltin(name) {
        return this.builtins.get(name);
    }

     getMemory() {
        return this.memory;
    }

    advance() {
        this.pos += 1;
    }
    
     run() {


        this.code = this.code.trim();
        let splitCode = this.code.split("\n");

        for (let line of splitCode) {
            this.advance();


            line = line.replace("\r", "")
            if (this.validateLine(line)) {
                if (line.includes(this.commentTag)) line = line.slice(0, line.indexOf(this.commentTag));
                let [keyword, ...args] = line.split(" ");


                if (this.builtins.has(keyword)) {

                    let builtin = this.builtins.get(keyword);

                    if (builtin) {

                        builtin.callback(this, args);   
                        this.lastInstructions.push(line)
                    }
                } else {
                    FlapsLogger.failure(`Invalid Keyword: ${keyword}`);
                }
            } else {
            }
        }
    } 

    

    loop(amountInt) {
        if (amountInt === -1) {
            while (true) {
                this.lastInstructions.forEach((line) => {
                    if (this.validateLine(line)) {
                        if (line.includes(this.commentTag)) line = line.slice(0, line.indexOf(this.commentTag));
                        let [keyword, ...args] = line.split(" ");
        
        
                        if (this.builtins.has(keyword)) {
        
                            let builtin = this.builtins.get(keyword);
        
                            if (builtin) {
        
                                builtin.callback(this, args);   
                                this.lastInstructions.push(line)
                            }
                        } else {
                            FlapsLogger.failure(`Invalid Keyword: ${keyword}`);
                        }
                    } else {
                    }
                });
            }
        } else {
            for (let i = 0; i<amountInt; i++) {
                this.lastInstructions.forEach((line) => {
                    if (this.validateLine(line)) {
                        if (line.includes(this.commentTag)) line = line.slice(0, line.indexOf(this.commentTag));
                        let [keyword, ...args] = line.split(" ");
        
        
                        if (this.builtins.has(keyword)) {
        
                            let builtin = this.builtins.get(keyword);
        
                            if (builtin) {
        
                                builtin.callback(this, args);   
                                this.lastInstructions.push(line)
                            }
                        }
                    }
                });
            }
        }
    }

     validateLine(line) {
        if (!line || !line.length) return false;
        let [keyword] = line.split(" ");
        if (!this.builtins.has(keyword)) {
            return false;
        }
        return true;
    }
}

module.exports = Context;