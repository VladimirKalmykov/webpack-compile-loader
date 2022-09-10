const loaderUtils = require('loader-utils');

function isPromise(promise) {
    return !!promise && typeof promise.then === 'function'
}

module.exports = async function(source) {
    const options = Object.assign({ cache: false, async: false }, typeof this.getOptions === "function" ? this.getOptions() : loaderUtils.getOptions(this));
    this.cacheable(options.cache);
    const moduleResult = this.exec(source, this.resourcePath);
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
