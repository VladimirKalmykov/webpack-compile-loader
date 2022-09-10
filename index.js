const loaderUtils = require('loader-utils');
const Module = require("module");
// const { NodeVM } = require("vm2");

function isPromise(promise) {
    return !!promise && typeof promise.then === 'function'
}

module.exports = async function(source) {
    const options = Object.assign({ cache: false, async: false }, typeof this.getOptions === "function" ? this.getOptions() : loaderUtils.getOptions(this));
    this.cacheable(options.cache);

    let moduleResult = 'null';
    if (options.useRequire) {
        moduleResult = require(this.resourcePath).default;
    } else {
        const module = new Module(this.resourcePath, this);
        module.paths = Module._nodeModulePaths(this.context);
        module.filename = this.resourcePath;
        module._compile(source, this.resourcePath);
        moduleResult = module.exports.default;

        // const vm = new NodeVM({
        //     allowAsync: true,
        //     require: {
        //         external: true
        //     }
        // });
    
        // moduleResult = vm.run(source, this.resourcePath);
    }

    const isAsync = isPromise(moduleResult) || options.async;

    if (isAsync) {
        const callback = this.async();
        try {
            const asyncReuslt = await moduleResult;
            callback(null, `module.exports = ${asyncReuslt};`)
        } catch (e) {
            callback(e);
        }
        return;
    }
    return `module.exports = ${moduleResult};`;
};
