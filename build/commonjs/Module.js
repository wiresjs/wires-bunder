"use strict";
const Utils_1 = require("./Utils");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
const nodeModulesDir = path.join(appRoot.path, "node_modules");
const CACHED_MODULES = new Map();
class Module {
    constructor(userPath, base) {
        this.userPath = userPath;
        this.base = base;
        this.deps = [];
        this.resolved = false;
        this.isNodeModule = false;
        this.notifications = [];
        if (!this.base) {
            this.base = appRoot.path;
        }
    }
    notify(cb) {
        this.notifications.push(cb);
    }
    resolve() {
        if (this.resolved) {
            return;
        }
        this.filePath = this.prepare();
        this.contents = this.readContents();
        let reqs = Utils_1.extractRequires(this.contents);
        reqs.forEach(item => {
            let dep;
            let cacheName = item.name.match(/^[a-z0-9_-]+$/i) ? item.name
                : path.join(path.dirname(this.filePath), item.name);
            if (CACHED_MODULES.get(cacheName)) {
                dep = CACHED_MODULES.get(cacheName);
            }
            else {
                dep = new Module(item.name, path.dirname(this.filePath));
                CACHED_MODULES.set(cacheName, dep);
                dep.resolve();
            }
            this.deps.push(dep);
        });
        this.resolved = true;
    }
    readContents() {
        return fs.readFileSync(this.filePath).toString();
    }
    prepare() {
        if (path.isAbsolute(this.userPath)) {
            return this.userPath;
        }
        else {
            let wanted = path.join(this.base, this.userPath);
            if (this.userPath[0] === ".") {
                if (!/\.js$/.test(wanted)) {
                    let folderModule = path.join(wanted, "/", "index.js");
                    if (fs.existsSync(folderModule)) {
                        return folderModule;
                    }
                    else {
                        return `${wanted}.js`;
                    }
                }
                else {
                    return wanted;
                }
            }
        }
        let nodeModuleEntry = this.resolveNodeModule(this.userPath);
        this.isNodeModule = true;
        this.nodeModuleName = this.userPath;
        return nodeModuleEntry;
    }
    wrap() {
        let projectRoot = path.dirname(this.filePath);
        let convertToProjectPath = (input) => {
            input = input.replace(projectRoot, "");
            input = input.replace(/^\/|\\/, "");
            input = input.replace(/\\/g, "/");
            return input;
        };
        let wrapCurrent = (module) => {
            let moduleProjectPath = convertToProjectPath(module.filePath);
            console.log(moduleProjectPath, " of (" + module.userPath);
            module.deps.forEach(dep => {
                let depProjectPath = convertToProjectPath(dep.filePath);
                console.log("\t", depProjectPath, " of (" + dep.userPath);
                if (dep.deps.length) {
                    wrapCurrent(dep);
                }
            });
        };
        wrapCurrent(this);
    }
    resolveNodeModule(name) {
        let modulePath = path.join(nodeModulesDir, name);
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
            console.warn(`Node Module ${name} was not found in ${nodeModulesDir}`);
        }
    }
}
exports.Module = Module;
