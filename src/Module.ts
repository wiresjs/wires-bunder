import { extractRequires, getAbsoluteEntryPath, RequireOptions } from './Utils';
import * as fs from "fs";
import * as path from "path";

// const appRoot = require("app-root-path");
// const nodeModulesDir = path.join(appRoot.path, "node_modules");
// const CACHED_MODULES = new Map<string, Module>();

export class Module {
    public contents: string;
    public dir: string;
    public dependencies: Module[] = [];

    constructor(public absPath) {
        if (!absPath) {
            return;
        }
        if (!path.isAbsolute(absPath)) {
            absPath = getAbsoluteEntryPath(absPath);
        }
        this.absPath = this.ensureExtension(absPath);
        this.dir = path.dirname(absPath);
    }

    public digest(): RequireOptions[] {
        if(!this.absPath){
            return [];
        }
        this.contents = fs.readFileSync(this.absPath).toString();
        let requires = extractRequires(this.contents);
        return requires;
    }

    public getAbsolutePathOfModule(name: string) {
        let mpath = path.join(this.dir, name);
        return this.ensureExtension(mpath);
    }

    public addDependency(module: Module) {
        this.dependencies.push(module);
    }

    public getProjectPath(entry: Module) {
        let root = path.dirname(entry.absPath);
        let input = this.absPath;
        input = input.replace(root, "");
        input = input.replace(/^\/|\\/, "");
        input = input.replace(/\\/g, "/");
        return input;
    }

    private ensureExtension(name: string) {
        if (!name.match(/\.js$/)) {
            return name + ".js";
        }
        return name;
    }
}
/*

export class Module {
    public contents: string;
    public deps: Module[] = [];
    public resolved: boolean = false;
    public entry: string;
    public filePath: string;
    public isNodeModule: boolean = false;
    public notifications = [];
    public nodeModuleName: string;


    constructor(public userPath: string, public base?: string) {
        if (!this.base) {
            this.base = appRoot.path;
        }
    }
    public notify(cb: { (mod: Module) }) {
        this.notifications.push(cb);
    }
    public resolve() {
        if (this.resolved) {
            return;
        }
        this.filePath = this.prepare();
        this.contents = this.readContents();
        let reqs = extractRequires(this.contents);
        reqs.forEach(item => {
            let dep;
            let cacheName = item.name.match(/^[a-z0-9_-]+$/i) ? item.name
                : path.join(path.dirname(this.filePath), item.name);
            if (CACHED_MODULES.get(cacheName)) {
                dep = CACHED_MODULES.get(cacheName);
            } else {
                dep = new Module(item.name, path.dirname(this.filePath));
                CACHED_MODULES.set(cacheName, dep);
                dep.resolve();
            }
            this.deps.push(dep);
        });

        this.resolved = true;
    }


    public readContents(): string {
        return fs.readFileSync(this.filePath).toString();
    }



    public prepare(): string {
        if (path.isAbsolute(this.userPath)) {
            return this.userPath;
        } else {
            let wanted = path.join(this.base, this.userPath);
            if (this.userPath[0] === ".") {
                if (!/\.js$/.test(wanted)) { // if it's not js file explicetely
                    let folderModule = path.join(wanted, "/", "index.js");
                    if (fs.existsSync(folderModule)) {
                        return folderModule;
                    } else {
                        return `${wanted}.js`;
                    }
                } else {
                    return wanted;
                }
            }
        }
        let nodeModuleEntry = this.resolveNodeModule(this.userPath);
        this.isNodeModule = true;
        this.nodeModuleName = this.userPath;
        return nodeModuleEntry;
    }

    public wrap() {

        let app = new ApplicationCollection();
        // // let primary_contents = [];
        // let modules = {};
        // let node_modules = {};

        // // Collect resources for a project module (either node_module or the current project)
        // let collectionResources = (module: Module) => {
        //     let rootProjectPath = this.getProjectPath(module.filePath);

        //     if (module.isNodeModule) {
        //         if (!node_modules[module.nodeModuleName]) {
        //             node_modules[module.nodeModuleName] = module;
        //         }
        //         return;
        //     }
        //     modules[rootProjectPath] = module;
        //     module.deps.forEach(dep => {
        //         let depProjectPath = this.getProjectPath(dep.filePath);
        //         if (dep.deps.length) {
        //             collectionResources(dep);
        //         }
        //     });
        // }
        // collectionResources(this);
        //  return primary_contents;
        return [];
    }

    private getProjectPath(input: string, root?: string) {
        root = root || path.dirname(this.filePath);
        input = input.replace(root, "");
        input = input.replace(/^\/|\\/, "");
        input = input.replace(/\\/g, "/");
        return input;
    }


    private resolveNodeModule(name: string): string {
        let modulePath = path.join(nodeModulesDir, name);
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
            console.warn(`Node Module ${name} was not found in ${nodeModulesDir}`);
        }
    }
}*/