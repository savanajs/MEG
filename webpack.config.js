const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');
const pkg = require('./package.json');
const fs = require('fs');
const resolvePath = (pathToResolve = '') => path.resolve(__dirname, pathToResolve)

function generateHtmlPlugins(templateDir) {

    let templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));

    templateFiles = templateFiles.filter((item) => {

        let parts = item.split('.');
        let extension = parts[1];

        if(extension == "html")
            return item;
        
    });

    return templateFiles.map(item => {
        // Split names and extension
        const parts = item.split('.')
        const name = parts[0]
        //const extension = parts[1]
        
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: resolvePath('src/' + name + '.html'),
            favicon: './src/favicon.ico',
            xhtml: true,
            hash: true,
            minify: name == "index" ? false : true,
            showErrors: false
        })
        
    })

}

module.exports = (env, options) => {

    const devMode = options.mode !== 'production';
    let entry_path;

    let plugins_developers = [
        new CleanWebpackPlugin(['docs']),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: pkg.name + '.min.css',
            chunkFilename: pkg.name + ".css"
        })
    ];

    if (devMode) {

        plugins_developers = [];

    }

    let plugins_production = [
        ...generateHtmlPlugins('./src'),
        new StyleLintPlugin({
            failOnError: false,
            configFile: '.stylelintrc',
            context: './src/styles/',
            files: '**/*.scss',
            syntax: 'scss'
        })
    ];

    if (pkg.entry == "ts") {

        entry_path = 'src/ts/app/app.ts';

    } else if (pkg.entry == "js") {

        entry_path = 'src/js/app.js';
        entry_path_main = 'src/js/main.js';

    }

    var rules = [
        {
            enforce: "pre",
            test: /\.js$/,
            include: [resolvePath('src/js')],
            exclude: /node_modules/,
            use: [
                {
                    loader: 'eslint-loader'
                }
            ]
        },
        {
            enforce: "pre",
            test: /\.html$/,
            include: [resolvePath('src'), resolvePath('src/includes')],
            exclude: /node_modules/,
            // use: [
            //     {
            //         loader: 'htmllint-loader',
            //         options: {
            //             config: '.htmllintrc',
            //             failOnError: true,
            //             failOnWarning: false,
            //         }
            //     }
            // ]
        },
        {
            test: /\.js$/,
            include: [resolvePath('src/js')],
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader'
                }
            ]
        },
        {
            test: /\.tsx?$/,
            include: [resolvePath('src/ts')],
            exclude: /node_modules/,
            use: 'ts-loader'
        },
        {
            test: /\.s(a|c)ss?$/,
            include: [resolvePath('src/styles'), resolvePath('src/styles/**/*')],
            use: [
                { loader: (devMode || pkg.is_style_loader) ? "style-loader" : MiniCssExtractPlugin.loader },
                { loader: "css-loader" },
                { loader: "postcss-loader" },
                { loader: "sass-loader" }

            ]
        },
        {
            test: /\.css?$/,
            include: [resolvePath('src/styles'), resolvePath('src/styles/**/*'), resolvePath('node_modules')],
            use: [
                { loader: 'style-loader' },
                { loader: "css-loader" }

            ]
        },
        {
            test: /\.(html)$/,
            include: [resolvePath('src')],
            exclude: /node_modules/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: false,
                    removeComments: true,
                    conservativeCollapse: false,
                    interpolate: true
                }
            }]
        }

    ];

    if (!devMode) {

        rules.push({
            test: /\.(png|jpe?g|svg|gif|ico|icon)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/',
                        publicPath: 'img/'
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        // the webp option will enable WEBP
                        webp: {
                            quality: 75
                        }
                    }
                }
            ]
        });

    } else {

        rules.push({
            test: /\.(png|jpe?g|svg|gif|ico|icon)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/',
                        publicPath: 'img/'
                    }
                }
            ]
        });

    }

    return {
        context: __dirname,
        devtool: devMode ? "inline-sourcemap": null,
        mode: options.mode,
        entry: {
            "app": resolvePath(entry_path),
            "main": resolvePath(entry_path_main)
        },
        output: {
            path: resolvePath('docs'),
            filename: pkg.name + '.[name].min.js',
            chunkFilename: '[name].js'
        },
        devtool: 'source-map',
        module: {
            rules: rules
        },
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.js', '.ts', '.scss', '.sass'],
            alias: {
                styles: resolvePath('src/styles'),
                helpers: resolvePath('src/ts/helpers')
            }
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: false,
                    cache: true,
                    parallel: true,
                    sourceMap: true, // set to true if you want JS source maps
                    uglifyOptions: {
                        output: {
                            beautify: false
                        },
                    }
                }),
                new OptimizeCSSAssetsPlugin({})
            ],
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        chunks: 'initial',
                        test: path.resolve(__dirname, 'node_modules'),
                        name: 'vendors',
                        enforce: true,
                    }
                },
            }
        },
        plugins: [
            ...plugins_developers,
            ...plugins_production
        ]
    }
};