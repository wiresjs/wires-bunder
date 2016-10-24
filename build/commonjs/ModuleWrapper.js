"use strict";
class ModuleWrapper {
    static wrapGeneric(name, content) {
        let fn = `// ${name}
___module___("${name}", function(exports, require, module){
${content}
});`;
        return fn;
    }
}
exports.ModuleWrapper = ModuleWrapper;
