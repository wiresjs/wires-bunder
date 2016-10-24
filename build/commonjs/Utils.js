"use strict";
const appRoot = require("app-root-path");
const path = require("path");
function extractRequires(contents) {
    let regex = new RegExp('require\\([\'"`](.*)[\'"`]\\)', "g");
    let item;
    let match = () => item = regex.exec(contents);
    let data = [];
    while (match()) {
        data.push({
            name: item[1],
            str: item[0],
        });
    }
    return data;
}
exports.extractRequires = extractRequires;
function getAbsoluteEntryPath(entry) {
    if (entry[0] === "/") {
        return path.dirname(entry);
    }
    return path.join(appRoot.path, entry);
}
exports.getAbsoluteEntryPath = getAbsoluteEntryPath;
function getWorkspaceDir(entry) {
    let p = getAbsoluteEntryPath(entry);
    return path.dirname(p);
}
exports.getWorkspaceDir = getWorkspaceDir;
