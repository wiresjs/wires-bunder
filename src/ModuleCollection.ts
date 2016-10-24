import { Module } from "./Module";
import * as path from "path"
import * as fs from "fs";
const MODULE_CACHE = {};

const appRoot = require("app-root-path");
const NODE_MODULES_DIR = path.join(appRoot.path, "node_modules");

export class ModuleCollection {
    public nodeModules: Map<string, ModuleCollection> = new Map();
    public dependencies: Map<string, Module> = new Map();
    constructor(private name: string, private entry?: Module) {

    }
    public collect() {
        if (this.entry) {
            this.resolve(this.entry);
        }
    }

    public resolve(module: Module) {
        let requires = module.digest();
        requires.forEach(options => {
            if (this.isNodeModule(options.name)) {
                // just collecting node modules names
                if (!this.nodeModules.has(options.name)) {
                    let targetEntryFile = this.getNodeModuleMainFile(options.name);
                    let depCollection;
                    if (targetEntryFile) {
                        let targetEntry = new Module(targetEntryFile);
                        depCollection = new ModuleCollection(options.name, targetEntry);
                        depCollection.collect();
                    } else {
                        depCollection = new ModuleCollection(options.name);
                    }
                    this.nodeModules.set(options.name, depCollection);
                }
            } else {
                let modulePath = module.getAbsolutePathOfModule(options.name);

                if (MODULE_CACHE[modulePath]) {
                    module.addDependency(MODULE_CACHE[modulePath]);
                } else {
                    let dependency = new Module(modulePath);
                    MODULE_CACHE[modulePath] = dependency;

                    module.addDependency(dependency);
                    this.resolve(dependency);
                }
            }
        });
    }


    public isNodeModule(name: string) {
        return name.match(/^[a-z0-9_-]+$/i);
    }

    private getNodeModuleMainFile(name: string) {
        let modulePath = path.join(NODE_MODULES_DIR, name);
        if (fs.existsSync(modulePath)) {
            // package.json path
            let packageJSONPath = path.join(modulePath, "package.json");
            if (fs.existsSync(packageJSONPath)) {
                // read contents
                let json: any = JSON.parse(fs.readFileSync(packageJSONPath).toString());
                // Getting an entry point
                if (json.main) {
                    let entryFile = path.join(modulePath, json.main);
                    return entryFile;
                }
            }
        } else {
            console.warn(`Node Module ${name} was not found in ${NODE_MODULES_DIR}`);
        }
    }

}