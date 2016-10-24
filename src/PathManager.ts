import { getWorkspaceDir } from './Utils';
import * as path from "path";
/**
 *
 *
 * @export
 * @class PathManager
 */
export class PathManager {
    /**
     *
     *
     * @type {string}
     * @memberOf PathManager
     */
    public dir: string;
    /**
     * Creates an instance of PathManager.
     *
     * @param {string} absolutePath
     * @param {string} workspaceDir
     *
     * @memberOf PathManager
     */
    constructor(public absolutePath: string, public workspaceDir: string) {
        this.dir = path.dirname(absolutePath);
    }




    /**
     *
     *
     * @param {string} dependencyPath
     * @returns
     *
     * @memberOf PathManager
     */
    public dependencyToRealPath(dependencyPath: string) {

        let p = path.join(this.dir, dependencyPath);
        //console.log("dep to real", p);
        if (!p.match(/\.js^/)) {
            return `${p}.js`;
        }
        return p;
    }

    /**
     *
     *
     * @private
     *
     * @memberOf PathManager
     */
    private getProjectPath() {
        // let root = path.dirname(this.absolutePath);
        // input = input.replace(this.workspaceDir, "");
        // input = input.replace(/^\/|\\/, "");
        // input = input.replace(/\\/g, "/");
        // return input;
    }
}