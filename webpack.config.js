const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = function(env, args) {

    const commonConfigs = {

        devtool: env.production ? 'source-map' : 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'ts-loader',
                        options: { transpileOnly: false }
                    },
                    exclude: /node_modules/
                },
            ]
        },
        resolve: {
            extensions: [ '.ts', '.tsx', '.js', '.json' ],
        },
        plugins: [
            new ESLintPlugin({
                extensions: ['.ts', '.tsx'],
                quiet: false,
                exclude: ['node_modules', 'dist', 'public', 'log']
            }),
        ],
        target: 'web',
        mode: 'production',
        devtool: args.mode == 'production' ? undefined : 'inline-source-map',
        watch: false
    
    }

    const commonBundle = {

        ...commonConfigs,

        entry: './src/umd.ts',
        optimization: {
            minimize: args.mode == 'production'
        },
        output: {
            filename: `stylight${ args.mode == 'production' ? '.min' : ''}.js`,
            path: __dirname+'/umd'
        },

    }

    const reactBundle = {

        ...commonConfigs,

        entry: './src/react/umd.ts',
        optimization: {
            minimize: args.mode == 'production'
        },
        output: {
            filename: `stylight.react${ args.mode == 'production' ? '.min' : ''}.js`,
            path: __dirname+'/umd'
        },
        externals: {
            'stylight': 'Stylight',
            'react': 'React'
        }

    }

    return [commonBundle, reactBundle];

}