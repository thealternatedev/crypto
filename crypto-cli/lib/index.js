#!/usr/bin/env node

const gift = require("gift");
const { program } = require("commander");
const { createLogger } = require("flaps-logger");
const cli = require("cli");
const download = require("download");
const fs = require("fs");
const fs_extra = require("fs-extra");
const path = require("path");
const targz = require("targz");
const { execSync } = require("child_process");
const { platform } = require("os");
const _URL = "https://github.com/maxjackson2/crypto.git";
const FlapsLogger = createLogger({ writeLogFile: true });
FlapsLogger.setLogFile("crypto-lang-cli.logs");

function shutdownProgram(reason) {
    FlapsLogger.info("[SHUTDOWN]: " + reason);
    return process.exit(0);
}

(async () => {

    let allowGitDownload = false;
    let allowInstallProject = false;
    let allowBuildProject = false;

    program
        .command("git")
        .description("Downloads the repository from github")
        .action(() => {
            allowGitDownload = true;
        });

    program
        .command("install")
        .description("Installs the project from the package.json file")
        .action(() => {
            allowInstallProject = true;
        });
    
    program
        .command("build")
        .description("Runs the crypto:build on the project based on your os")
        .action(() => {
            allowBuildProject = true;
        });

    program.parse();

    if (allowGitDownload) {
        console.log("> :Cloning repository.");
        gift.clone(_URL, path.join(process.cwd(), "crypto"), null, "main", (err, _repo) => {
            if (err) {
                shutdownProgram(err);
            }

            console.log("> :Finished");
        });
    }

    if (allowInstallProject) {
        let pkg = require(path.join(process.cwd(), "crypto", "package.json"));
        let execute = execSync(pkg.scripts["crypto:install"], { encoding: "utf-8", cwd: path.join(process.cwd(), "crypto") });
        if (execute) {
            console.log(execute);
        }
    }
    
    if (allowBuildProject) {
        let platform = process.platform === "win32" ? "win" : "sh";
        console.log(platform)
        let pkg = require(path.join(process.cwd(), "crypto", "package.json"));
        console.log(pkg);
        let execute = execSync(pkg.scripts["crypto:build:" + platform], { encoding: "utf-8", cwd: path.join(process.cwd(), "crypto") });
        if (execute) {
            console.log(execute);
        } 
    }

})();