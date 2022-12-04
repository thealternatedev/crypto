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
const { homedir } = require("os");
const Configuration = require("./Configuration");
const { main } = require("cli");
const { boolean } = require("boolean");
const _URL = "https://github.com/maxjackson2/crypto.git";
const FlapsLogger = createLogger({ writeLogFile: true });
FlapsLogger.setLogFile("crypto-lang-cli.logs");

function shutdownProgram(reason) {
    FlapsLogger.info("[SHUTDOWN]: " + reason);
    return process.exit(0);
}

function alreadyCached() {
    let releases = {
        win: {
            fn: "crypto-v1.0-win.exe",
            url: "https://github.com/maxjackson2/crypto/releases/download/v1.0/crypto-win.exe",
        },
        linux: {
            fn: "crypto-v1.0-linux",
            url: "https://github.com/maxjackson2/crypto/releases/download/v1.0/crypto-linux"
        },
        macos: {
            fn: "crypto-v1.0-macos",
            url: "https://github.com/maxjackson2/crypto/releases/download/v1.0/crypto-macos",
        },
    };
    let release;
    if (process.platform === "win32") {
        release = releases.win.fn;
    } else if (process.platform === "darwin") {
        release = releases.macos.fn;
    } else if (process.platform === "linux") {
        release = releases.linux.fn;
    } else {
        release = "";
        console.log("Err: Not a release.");
        process.exit(0);
    }
    return fs.existsSync(path.join(homedir(), ".crypto_cli", `releases`, `${release}`));
}

async function useCache() {
    try {
        let releases = {
            win: {
                fn: "crypto-v1.0-win.exe",
            },
            linux: {
                fn: "crypto-v1.0-linux",
            },
            macos: {
                fn: "crypto-v1.0-macos",
            },
        };

        if (process.platform === "win32") {
            let releasePath = path.join(homedir(), ".crypto_cli", "releases", `${releases.win.fn}`);
            fs.copyFileSync(releasePath, path.join(process.cwd(), releases.win.fn));
        } else if (process.platform === "darwin") {
            let releasePath = path.join(homedir(), ".crypto_cli", "releases", `${releases.macos.fn}`);
            fs.copyFileSync(releasePath, path.join(process.cwd(), releases.macos.fn));
        } else if (process.platform === "linux") {
            let releasePath = path.join(homedir(), ".crypto_cli", "releases", `${releases.linux.fn}`);
            fs.copyFileSync(releasePath, path.join(process.cwd(), releases.linux.fn));
        } else {
            console.log("Err: Not Supported Operating System.");
            process.exit(0);
        }
    } catch (err) {
        console.log("Err: " + err)
        process.exit(0);
    }
}

async function cacheRelease(file_path, fn) {

    fs.mkdirSync(path.join(homedir(), ".crypto_cli"), { recursive: true });
    fs.mkdirSync(path.join(homedir(), ".crypto_cli", "releases"), { recursive: true });
    fs.copyFileSync(file_path, path.join(homedir(), ".crypto_cli", "releases", fn));
}

async function downloadRelease() {
    let releases = {
        win: {
            fn: "crypto-v1.0-win.exe",
            url: "https://github.com/maxjackson2/crypto/releases/download/v1.0/crypto-win.exe",
        },
        linux: {
            fn: "crypto-v1.0-linux",
            url: "https://github.com/maxjackson2/crypto/releases/download/v1.0/crypto-linux"
        },
        macos: {
            fn: "crypto-v1.0-macos",
            url: "https://github.com/maxjackson2/crypto/releases/download/v1.0/crypto-macos",
        },
    };
    fs.mkdirSync(path.join(process.cwd()), { recursive: true });
    try {
        
        if (process.platform === "win32") {
            console.log("> Downloading Release: " + releases.win.fn);
            let installationPath = path.join(process.cwd());
            await download(releases.win.url, installationPath, { filename: releases.win.fn });
            await cacheRelease(path.join(installationPath, releases.win.fn), releases.win.fn);
        } else if (process.platform === "darwin") {
            console.log("> Downloading Release: " + releases.macos.fn);
            let installationPath = path.join(process.cwd());
            await download(releases.macos.url, installationPath, { filename: releases.macos.fn });
            await cacheRelease(path.join(installationPath, releases.macos.fn), releases.macos.fn);
        } else if (process.platform === "linux") {
            console.log("> Downloading Release: " + releases.linux.fn);
            let installationPath = path.join(process.cwd());
            await download(releases.linux.url, installationPath, { filename: releases.linux.fn });
            await cacheRelease(path.join(installationPath, releases.linux.fn), releases.linux.fn);
        } else {
            console.log("Err: Not Supported Operating System.");
            process.exit(0);
        }
    } catch (err) {
        console.log("Err: " + err);
        process.exit(0);
    }
}

async function writeRunCode() {

    try {
        let releases = {
            win: {
                fn: "crypto-v1.0-win.exe",
            },
            linux: {
                fn: "crypto-v1.0-linux",
            },
            macos: {
                fn: "crypto-v1.0-macos",
            },
        };

        if (process.platform === "win32") {
            let code = `@echo off
            
call ${releases.win.fn} run program.crypto
            
pause`;
            fs.writeFileSync(path.join(process.cwd(), "run.bat"), code);
        } else if (process.platform === "darwin") {
            let code = `#!/usr/bin/env bash
./${releases.macos.fn} run program.crypto

exit`;
            fs.writeFileSync(path.join(process.cwd(), "run.sh"), code);
        } else if (process.platform === "linux") {
            let code = `#!/usr/bin/env bash
./${releases.linux.fn} run program.crypto

exit`;
            fs.writeFileSync(path.join(process.cwd(), "run.sh"), code);
        } else {
            console.log("Err: Not Supported Operating System.");
            process.exit(0);
        }
    } catch (err) {
        console.log("Err: " + err);
        process.exit(0);
    }

}

(async () => {

    let allowGitDownload = false;
    let allowInstallProject = false;
    let allowBuildProject = false;
    let allowCreateWorkspace = false;
    const mainConfiguration = new Configuration("configuration.crypto.json");

    fs.mkdirSync(path.join(homedir(), ".crypto_cli"), { recursive: true });
    fs.mkdirSync(path.join(homedir(), ".crypto_cli", "releases"), { recursive: true });

    program
        .name("crypto-cli");

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

    program
        .command("init")
        .description("Creates a new workspace")
        .action(() => {
            allowCreateWorkspace = true;
        });

    let configCommand = program
        .command("config")
        .description("Edits the main configuration file of crypto-cli");

    configCommand
        .command("set")
        .description("Sets or updates a item in the configuration")
        .argument("<key>", "Key to add or update in the configuration")
        .argument("<value>", "The value that is going to be the key value")
        .action((key, value) => {
            mainConfiguration.set(key, value);
            mainConfiguration.saveConfiguration();
        });
    configCommand
        .command("remove")
        .description("Removes a item from the configuration")
        .argument("<key>", "Key to remove from the configuration")
        .action((key) => {
            mainConfiguration.delete(key);
            mainConfiguration.saveConfiguration();
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

    if (allowCreateWorkspace) {
        console.log("> Creating Project.");
        if (mainConfiguration.has("canUseCached")) {
            let value = mainConfiguration.get("canUseCached");
            let bool = boolean(value);
            if (bool) {
                if (alreadyCached()) {
                    console.log("> Using cached file.");
                    await useCache();
                } else {
                    console.log("> Downloading content.");
                    await downloadRelease();
                }
            } else {
                console.log("! Configuration is revoking the cached file from being used, Change this in the config.");
                console.log("> Downloading content.");
                await downloadRelease();
            }
        } else {
            console.log("! Configuration is revoking the cached file from being used, Change this in the config.");
            console.log("> Downloading content.");
            await downloadRelease();
        }
        fs.writeFileSync(path.join(process.cwd(), "program.crypto"), `; Print Hello!
POS 0
SET 72
PRINT

POS 1
SET 101
PRINT

POS 2
SET 108
PRINT

POS 3
SET 108
PRINT

POS 4
SET 111
PRINT

POS 5
SET 33
PRINTLN`);

        await writeRunCode();
        console.log("> Done!.")
    }
})();