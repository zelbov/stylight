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
        watch: args.mode == 'production' ? false : true
    
    }

    const commonBundle = {

        ...commonConfigs,

        entry: './src/index.ts',
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

        entry: './src/react/index.ts',
        optimization: {
            minimize: args.mode == 'production'
        },
        output: {
            filename: `stylight.react${ args.mode == 'production' ? '.min' : ''}.js`,
            path: __dirname+'/umd'
        },
        externals: {
            'stylight': 'Stylight',
            'react': 'React',
            'react-dom': 'ReactDOM'
        }

    }

    return [commonBundle, reactBundle];

}