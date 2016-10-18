import * as fs from "fs";
/**
 *
 *
 * @export
 * @class FileManager
 */
export class FileManager {
    /**
     *
     *
     * @static
     * @param {string} file
     * @returns {boolean}
     *
     * @memberOf FileManager
     */
    public static fileExists(file: string): boolean {
        return fs.existsSync(file);
    }
    /**
     *
     *
     * @static
     * @param {string} file
     * @returns
     *
     * @memberOf FileManager
     */
    public static read(file: string): string {
        let exists = fs.existsSync(file);
        if (!exists) {
            throw new Error(`File ${file} does not exist`);
        }
        let contents = fs.readFileSync(file).toString();
        return contents;
    }
    /**
     *
     *
     * @static
     * @param {string} file
     * @param {string} contents
     *
     * @memberOf FileManager
     */
    public static write(file: string, contents: string): void {
        fs.writeFileSync(file, contents);
    }
}

