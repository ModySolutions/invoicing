const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config.js');

module.exports = {
    ...defaults,
    entry: {
        'invoice': path.resolve(process.cwd(), 'src/scripts', 'invoice.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(process.cwd(), 'dist'),
    },
    resolve: {
        ...defaults.resolve,
        ...{
            alias: {
                ...defaults?.resolve?.alias ?? {},
                ...{
                    '@invoice': path.resolve(process.cwd(), 'src/scripts'),
                    '@inscss': path.resolve(process.cwd(), 'src/scss'),
                    '@modycloud': [path.resolve(process.cwd(), '../../../../src/scripts')]
                }
            }
        }
    },
    module: {
        ...defaults.module,
        rules: [
            ...defaults.module.rules,
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                    },
                },
            },
        ]
    }
};