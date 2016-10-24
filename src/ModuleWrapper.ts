/**
 *
 *
 * @export
 * @class ModuleWrapper
 */
export class ModuleWrapper {
    /**
     *
     *
     * @static
     * @param {string} name
     * @param {string} content
     * @returns
     *
     * @memberOf ModuleWrapper
     */
    public static wrapGeneric(name: string, content: string) {
        let fn = `// ${name}
___module___("${name}", function(exports, require, module){
${content}
});`;
        return fn;
    }
}