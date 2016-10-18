const wiresBundler = require("./build/commonjs/index.js");
const should = require("should");
const FileManager = wiresBundler.FileManager;
const ModuleCompiler = wiresBundler.ModuleCompiler;
const Module = wiresBundler.Module;
const ProjectCompiler = wiresBundler.ProjectCompiler;

let m = new Module("./test-project/index.js");
m.resolve()

m.wrap();