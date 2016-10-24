"use strict";
const path = require("path");
class PathManager {
    constructor(absolutePath, workspaceDir) {
        this.absolutePath = absolutePath;
        this.workspaceDir = workspaceDir;
        this.dir = path.dirname(absolutePath);
    }
    dependencyToRealPath(dependencyPath) {
        let p = path.join(this.dir, dependencyPath);
        if (!p.match(/\.js^/)) {
            return `${p}.js`;
        }
        return p;
    }
    getProjectPath() {
    }
}
exports.PathManager = PathManager;
