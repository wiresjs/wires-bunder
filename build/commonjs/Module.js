"use strict";
const Utils_1 = require('./Utils');
const fs = require("fs");
const path = require("path");
class Module {
    constructor(absPath) {
        this.absPath = absPath;
        this.dependencies = [];
        if (!absPath) {
            return;
        }
        if (!path.isAbsolute(absPath)) {
            absPath = Utils_1.getAbsoluteEntryPath(absPath);
        }
        this.absPath = this.ensureExtension(absPath);
        this.dir = path.dirname(absPath);
    }
    digest() {
        if (!this.absPath) {
            return [];
        }
        this.contents = fs.readFileSync(this.absPath).toString();
        let requires = Utils_1.extractRequires(this.contents);
        return requires;
    }
    getAbsolutePathOfModule(name) {
        let mpath = path.join(this.dir, name);
        return this.ensureExtension(mpath);
    }
    addDependency(module) {
        this.dependencies.push(module);
    }
    getProjectPath(entry) {
        let root = path.dirname(entry.absPath);
        let input = this.absPath;
        input = input.replace(root, "");
        input = input.replace(/^\/|\\/, "");
        input = input.replace(/\\/g, "/");
        return input;
    }
    ensureExtension(name) {
        if (!name.match(/\.js$/)) {
            return name + ".js";
        }
        return name;
    }
}
exports.Module = Module;
