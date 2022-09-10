webpack-compile-loader
==

| **Exprimental loader!!!**

Loader for the Webpack (5+) that allows you to import any data

Example usage
--

```js
// test.compile.js
export default "{hello: 'World'}"
```



Getting started
--

Add a webpack rule for unique filename pattern (e.g. *.compile.js)

```js
{
    test: /\.compile\.js$/,
    use: [{ loader: 'webpack-compile-loader' }],
}
```

Create file with pattern matched name and ensure it exports string that contains javascript code. If you're planing to export structured data, you can use method `JSON.stringify` to prepare data.

```js
// test.compile.js
export default JSON.stringify({hello: 'World'});
```

```js
import testData from './test.compile.js'
console.log(testData.hello);
// "World"
```

Async
--

Your module can exports Promise or result of an async function. Here is an example of how to async list subdirectories of the project's source directory:

```js
// listSrc.compile.js
const glob = require('glob')
const util = require('util')

const asyncGlob = util.promisify(glob)

async function listProjectSrcFiles() {
  const files = await asyncGlob('src/*', { cwd: process.cwd() })
  return JSON.stringify({
    files,
  })
}

exports.default = listProjectSrcFiles()
```

In webpack's application code just import this file to get generated data at the build time:

```js
import srcFiles from './listSrc.compile.js'

console.log(srcFiles); // { files: [...] }
```

Options
--

*useRequire: false* By the default loader uses class Module to compile source code. You can enforce using `require` function by passing _true_ to this option. But keep in the mind that useRequire: true disables ability to precompiling.

Supported platforms
--

Webpack >=5, Node >=6