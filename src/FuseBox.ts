import { ModuleWrapper } from './ModuleWrapper';

import { Module } from "./Module";
import { ModuleCollection } from "./ModuleCollection";
import { getAbsoluteEntryPath } from "./Utils";
import * as path from "path";

const appRoot = require("app-root-path");

export class FuseBox {


    constructor() {}

    public start(entryFile: string) {
        let entry = new Module(entryFile);
        let defaultCollection = new ModuleCollection("default", entry);
        defaultCollection.collect();

        // resolve the current module
        let defaultContents =
            this.getCollectionSource(defaultCollection, entry);

        // collection node modules
        let nodeModules = this.collectNodeModules(defaultCollection);
        nodeModules.forEach((value, name) => {
            console.log(name);
        });
    }


    public collectNodeModules(defaultCollection: ModuleCollection): Map<string, ModuleCollection> {

        let modules: Map<string, ModuleCollection> = new Map();
        let collect = (nodeModules: Map<string, ModuleCollection>) => {
            nodeModules.forEach((collection, name) => {
                if (!modules.has(name)) {
                    modules.set(name, collection);
                    if (collection.nodeModules.size > 0) { collect(collection.nodeModules); }
                }
            });
        };
        collect(defaultCollection.nodeModules);
        return modules;
    }

    public getCollectionSource(collection: ModuleCollection, entry: Module) {
        let visited: any = {};
        let cnt = [];
        let collectionResources = (module: Module) => {
            let rpath = module.getProjectPath(entry);
            if (!visited[rpath]) {
                visited[rpath] = true;
                cnt.push(ModuleWrapper.wrapGeneric(rpath, module.contents));
            }
            module.dependencies.forEach(dep => collectionResources(dep));
        };
        collectionResources(entry);
        return cnt.join("\n");
    }
}