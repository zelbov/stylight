const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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

    const testsBundle = {

        ...commonConfigs,

        entry: './test/browser-entrypoint.tsx',

        output: {
            filename: 'browsertests.bundle.js',
            path: path.join(process.cwd(), 'dist', 'test')
        },

        target: 'web',
        mode: 'none',
        devtool: 'inline-source-map',

        module: {

            rules: [

                {

                    test: /.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: path.join(process.cwd(), "tsconfig.json"),
                                transpileOnly: true
                            }
                        },
                    ]

                },

                { enforce: "pre", test: /\.jsx?$/, loader: "source-map-loader" }

            ]

        },

        externalsPresets: { node: false },

        resolve: {

            extensions: [ '.js', '.ts', '.jsx', '.tsx' ],
            fullySpecified: false,
            fallback: {

                // test-only: external node deps resolved by Karma
                mocha: false,
                path: false,
                fs: false,
                util: require.resolve('util'),

            },

            // test-only: for projects that have a module installed via npm, providing aliases or path plugins is not required
            plugins: [new TsconfigPathsPlugin()]

        },

        plugins: [
            
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),

        ]

    }

    return [commonBundle, reactBundle, testsBundle];

}