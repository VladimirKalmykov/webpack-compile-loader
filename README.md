webpack-compile-loader
--

Loader for webpack that allows you to generate javascript code

```js
// test.compile.js
export default "{hello: 'World'}"
```

```es
import testData from 'webpack-compile-loader!./test.compile.js'
console.log(testData.hello);
// "World"
```
