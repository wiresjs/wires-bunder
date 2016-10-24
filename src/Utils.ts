const appRoot = require("app-root-path");
import * as path from "path";
export interface RequireOptions {
    name: string,
    str: string
}
/**
 *
 *
 * @export
 * @param {string} contents
 * @returns
 */
export function extractRequires(contents: string): RequireOptions[] {
    let regex = new RegExp('require\\([\'"`](.*)[\'"`]\\)', "g");
    let item;
    let match = () =>
        item = regex.exec(contents);
    let data = [];
    while (match()) {
        data.push({
            name: item[1],
            str: item[0],
        });
    }
    return data;
}


export function getAbsoluteEntryPath(entry: string): string {
    if (entry[0] === "/") {
        return path.dirname(entry);
    }
    return path.join(appRoot.path, entry);
}

export function getWorkspaceDir(entry: string): string {
    let p = getAbsoluteEntryPath(entry);
    return path.dirname(p);
}