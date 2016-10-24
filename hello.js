const build = require("./build/commonjs/index.js");

const getAbsoluteEntryPath = build.getAbsoluteEntryPath;
const Module = build.Module;
const FuseBox = build.FuseBox;
const ModuleCollection = build.ModuleCollection;
let fuseBox = new FuseBox();
fuseBox.start("./test-project/index.js");

// let contents = m.wrap();
// fs.writeFileSync("./out.js", contents.join("\n\n"));