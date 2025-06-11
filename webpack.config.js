const path = require('path');

module.exports = {
    entry: './src/index.ts', // Replace with your main TypeScript file
    output: {
        filename: 'bundle.js',  // The output bundle file
        path: path.resolve(__dirname, 'dist'),  // Output folder
    },
    resolve: {
        extensions: ['.ts', '.js'],  // Resolve .ts and .js files
    },
    module: {
        rules: [
            {
                test: /\.ts$/,  // Apply ts-loader for .ts files
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devtool: 'source-map',  // Optional: generate source maps for debugging
};