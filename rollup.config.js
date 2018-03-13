//npm install rollup rollup-plugin-babel babel-core babel-preset-env --save-dev
//npm install rollup-plugin-commonjs rollup-plugin-node-resolve --save-dev
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
export default [{
    input: 'src/module/main.js',
    output: {
        file: 'dist/main.js',
        format: 'iife'
    },
    plugins: [
        babel({
            "presets": [[
                "env",
                {
                    "modules": false
                }
            ]],
            "plugins": [
                ["transform-react-jsx", {
                    "pragma": "l"
                }]
            ]
        }),
        resolve(),
        commonjs()
    ]
}]
