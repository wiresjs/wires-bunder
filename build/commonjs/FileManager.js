"use strict";
const fs = require("fs");
class FileManager {
    static fileExists(file) {
        return fs.existsSync(file);
    }
    static read(file) {
        let exists = fs.existsSync(file);
        if (!exists) {
            throw new Error(`File ${file} does not exist`);
        }
        let contents = fs.readFileSync(file).toString();
        return contents;
    }
    static write(file, contents) {
        fs.writeFileSync(file, contents);
    }
}
exports.FileManager = FileManager;
