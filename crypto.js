const { program } = require("commander");
const { readFileSync, existsSync } = require("fs");
const path = require("path");
const Context = require("./lib");
const Color = require("cli-color");

let xfile;
let showInfo = false;

program
    .command("run")
    .description("Runs a mtf file")
    .argument("<file>", "File to run")
    .action((file) => {
        xfile = file;
    })

program
    .command("info")
    .description("Displays info about this project")
    .action(() => {
        showInfo = true;
    })

program.parse();

if (xfile) {
    if (!existsSync(path.join(process.cwd(), xfile))) return console.log("File not found, Please check if the file is found or not.");
    if (!xfile.endsWith(".crypto")) return console.log("File must end with .mtf extension to make it run.");
    let o = new Context(readFileSync(path.join(process.cwd(), xfile), "utf-8"));
    o.run();
}

if (showInfo) {

    console.log(String.raw`
    
                        _        
                       | |       
   ___ _ __ _   _ _ __ | |_ ___  
  / __| '__| | | | '_ \| __/ _ \ 
 | (__| |  | |_| | |_) | || (_) |
  \___|_|   \__, | .__/ \__\___/ 
             __/ | |             
            |___/|_|             
    
    `);

    console.log(Color.bold(Color.cyanBright("A Open Source Language Written with javascript that based off assembly.")));
    console.log("To Use this run: crypto run <file_ends_with_extension_.crypto>");

    console.log("Created by Max Jackson.");
    console.log("Licensed with MIT License.")

}