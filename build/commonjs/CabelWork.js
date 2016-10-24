"use strict";
const ModuleWrapper_1 = require('./ModuleWrapper');
const Module_1 = require("./Module");
const ModuleCollection_1 = require("./ModuleCollection");
const Utils_1 = require("./Utils");
const appRoot = require("app-root-path");
class CabelWork {
    constructor() {
        console.log("Launch");
    }
    start(entryFile) {
        this.entryFile = entryFile;
        let entry = new Module_1.Module(Utils_1.getAbsoluteEntryPath(entryFile));
        let defaultCollection = new ModuleCollection_1.ModuleCollection("default", entry);
        defaultCollection.collect();
        let defaultContents = this.getCollectionSource(defaultCollection, entry);
    }
    getCollectionSource(collection, entry) {
        let visited = {};
        let cnt = [];
        let collectionResources = (module) => {
            let rpath = module.getProjectPath(entry);
            if (!visited[rpath]) {
                visited[rpath] = true;
                cnt.push(ModuleWrapper_1.ModuleWrapper.wrapGeneric(rpath, module.contents));
            }
            module.dependencies.forEach(dep => collectionResources(dep));
        };
        collectionResources(entry);
        return cnt.join("\n");
    }
}
exports.CabelWork = CabelWork;
