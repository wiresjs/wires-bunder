"use strict";
const ModuleWrapper_1 = require('./ModuleWrapper');
const Module_1 = require("./Module");
const ModuleCollection_1 = require("./ModuleCollection");
const appRoot = require("app-root-path");
class FuseBox {
    constructor() {
    }
    start(entryFile) {
        let entry = new Module_1.Module(entryFile);
        let defaultCollection = new ModuleCollection_1.ModuleCollection("default", entry);
        defaultCollection.collect();
        let defaultContents = this.getCollectionSource(defaultCollection, entry);
        let nodeModules = this.collectNodeModules(defaultCollection);
        nodeModules.forEach((value, name) => {
            console.log(name);
        });
    }
    collectNodeModules(defaultCollection) {
        let modules = new Map();
        let collect = (nodeModules) => {
            nodeModules.forEach((collection, name) => {
                if (!modules.has(name)) {
                    modules.set(name, collection);
                    if (collection.nodeModules.size > 0) {
                        collect(collection.nodeModules);
                    }
                }
            });
        };
        collect(defaultCollection.nodeModules);
        return modules;
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
exports.FuseBox = FuseBox;
