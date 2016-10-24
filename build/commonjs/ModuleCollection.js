"use strict";
const Module_1 = require("./Module");
const path = require("path");
const fs = require("fs");
const MODULE_CACHE = {};
const appRoot = require("app-root-path");
const NODE_MODULES_DIR = path.join(appRoot.path, "node_modules");
class ModuleCollection {
    constructor(name, entry) {
        this.name = name;
        this.entry = entry;
        this.nodeModules = new Map();
        this.dependencies = new Map();
    }
    collect() {
        if (this.entry) {
            this.resolve(this.entry);
        }
    }
    resolve(module) {
        let requires = module.digest();
        requires.forEach(options => {
            if (this.isNodeModule(options.name)) {
                if (!this.nodeModules.has(options.name)) {
                    let targetEntryFile = this.getNodeModuleMainFile(options.name);
                    let depCollection;
                    if (targetEntryFile) {
                        let targetEntry = new Module_1.Module(targetEntryFile);
                        depCollection = new ModuleCollection(options.name, targetEntry);
                        depCollection.collect();
                    }
                    else {
                        depCollection = new ModuleCollection(options.name);
                    }
                    this.nodeModules.set(options.name, depCollection);
                }
            }
            else {
                let modulePath = module.getAbsolutePathOfModule(options.name);
                if (MODULE_CACHE[modulePath]) {
                    module.addDependency(MODULE_CACHE[modulePath]);
                }
                else {
                    let dependency = new Module_1.Module(modulePath);
                    MODULE_CACHE[modulePath] = dependency;
                    module.addDependency(dependency);
                    this.resolve(dependency);
                }
            }
        });
    }
    isNodeModule(name) {
        return name.match(/^[a-z0-9_-]+$/i);
    }
    getNodeModuleMainFile(name) {
        let modulePath = path.join(NODE_MODULES_DIR, name);
        if (fs.existsSync(modulePath)) {
            let packageJSONPath = path.join(modulePath, "package.json");
            if (fs.existsSync(packageJSONPath)) {
                let json = JSON.parse(fs.readFileSync(packageJSONPath).toString());
                if (json.main) {
                    let entryFile = path.join(modulePath, json.main);
                    return entryFile;
                }
            }
        }
        else {
            console.warn(`Node Module ${name} was not found in ${NODE_MODULES_DIR}`);
        }
    }
}
exports.ModuleCollection = ModuleCollection;
