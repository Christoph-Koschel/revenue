const {ConfigBuilder} = require("./engine/config");
const {PLUGINS} = require("./engine/plugins");
let builder = new ConfigBuilder();

builder.add_module("app", [
    "./src"
])
    .use(PLUGINS.TSB.MINIFIER)
    .add_loader("./src/app.ts");

builder.add_module("preload", [
    "./preload"
])
    .use(PLUGINS.TSB.MINIFIER)
    .add_loader("./preload/preload.ts");

builder.create_build_queue("all")
    .compile_module("app")
    .compile_module("preload")
    .copy("./out/app.min.js", "../build")
    .copy("./out/preload.min.js", "../build")
    .done();

exports.default = builder.build();