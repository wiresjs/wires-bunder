"use strict";
const Module_1 = require('./Module');
class ProjectCompiler {
    constructor(entry) {
        this.entry = entry;
        let module = new Module_1.Module(entry, null);
    }
    resolve(cb) {
    }
}
exports.ProjectCompiler = ProjectCompiler;
