"use strict";
const Utils_1 = require("./Utils");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
const nodeModulesDir = path.join(appRoot.path, "node_modules");
class ModuleCompiler {
    constructor(file) {
        this.toResolve = {};
        this.entry = path.isAbsolute(file) ? file : path.join(appRoot.path, file);
    }
    ready(cb) {
        this.resultCallback = cb;
    }
    resolve(entry) {
        let fname = entry || this.entry;
        if (this.toResolve[fname]) {
            return;
        }
        let _promised = new Promise((resolve, reject) => {
            fs.readFile(fname, (err, data) => {
                let contents = data.toString();
                let base = path.dirname(entry || this.entry);
                let requires = Utils_1.extractRequires(contents);
                for (let required of requires) {
                    if (required.name[0] === "." || path.isAbsolute(required.name)) {
                        let wanted = path.join(base, required.name);
                        if (!/\.js$/.test(wanted)) {
                            let folderModule = path.join(wanted, "/", "index.js");
                            fs.exists(folderModule, (exists) => {
                                if (exists) {
                                    this.resolve(folderModule);
                                }
                                else {
                                    this.resolve(`${wanted}.js`);
                                }
                                ;
                            });
                        }
                        else {
                            console.log("resolve wanted", wanted);
                            this.resolve(wanted);
                        }
                    }
                    else {
                    }
                }
                this.toResolve[fname].resolved = true;
                this.moduleResolved();
            });
        });
        this.toResolve[fname] = {
            promised: _promised,
            resolved: false,
        };
    }
    getNodeModule(name) {
        let modulePath = path.join(nodeModulesDir, name);
        if (fs.existsSync(modulePath)) {
            let packageJSONPath = path.join(modulePath, "package.json");
            if (fs.existsSync(packageJSONPath)) {
                let json = JSON.parse(fs.readFileSync(packageJSONPath).toString());
                if (json.main) {
                    let entryFile = path.join(modulePath, json.main);
                    let moduleCompiler = new ModuleCompiler(entryFile);
                    moduleCompiler.resolve();
                }
            }
        }
        else {
            console.warn(`Node Module ${name} was not found in ${nodeModulesDir}`);
        }
    }
    moduleResolved() {
        for (let path in this.toResolve) {
            if (this.toResolve.hasOwnProperty(path)) {
                let data = this.toResolve[path];
                if (!data.resolved) {
                    return false;
                }
            }
        }
        if (this.resultCallback) {
            return this.resultCallback(this.toResolve);
        }
    }
}
exports.ModuleCompiler = ModuleCompiler;
