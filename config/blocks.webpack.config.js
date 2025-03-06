const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config.js');

module.exports = {
    ...defaults,
    resolve: {
        ...defaults.resolve,
        ...{
            alias: {
                ...defaults?.resolve?.alias ?? {},
                ...{
                    '@invoice': path.resolve(process.cwd(), 'resources/scripts'),
                    '@inscss': path.resolve(process.cwd(), 'resources/scss'),
                    '@modycloud': [path.resolve(process.cwd(), '../../../../resources/scripts')]
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