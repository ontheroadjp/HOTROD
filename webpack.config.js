var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var conf = require('./config.json');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var PurifyCSSPlugin = require('purifycss-webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var inProduction = (process.env.NODE_ENV === 'production');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    //context: srcPath,

	entry: {
        app: [
            './src/js/main.js',
            './src/sass/main.scss',
        ],
        vendor: ['moment']
    },

	output: {
		path: path.resolve(__dirname, './public'),
		filename: 'js/[name].[chunkhash].js',
        publicPath: conf.publicPath
	},

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        clientLogLevel: "info"
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: [ 'css-loader', 'sass-loader', {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer')(),
                                    //require('stylelint')(),
                                ]
                            }
                        }
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2)$/,
                use: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: ['file-loader?name=images/[hash].[ext]', 'img-loader']
            },
//            {
//                test: /\.html$/,
//                use: [{
//                    loader: 'html-loader',
//                    options: {
//                        minimize: true
//                    }
//                }]
//            }
        ]
    },

    plugins: [
        // clean destination directory
        new CleanWebpackPlugin(['public'], {
            root:     __dirname,
            //exclude:  ['images/icons-*/*'],
            verbose:  true,
            dry:      false
        }),

        // export chunk manifest
        function() {
            if( conf.debug ) {
                this.plugin('done', stats => {
                    require('fs').writeFileSync(
                        path.join(__dirname, 'stats/chunk-stats.json'),
                        //JSON.stringify(stats.toJson().assetsByChunkName, 'utf8')
                        JSON.stringify(stats.toJson(), 'utf8')
                    );
                });
            }
        },

        // split vendor.js
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor'],
            minChunks: function (module) {
               return module.context && module.context.indexOf('node_modules') !== -1;
            },
            filename: "js/[name].[chunkhash].js"
        }),

        // split manifest.js
        new webpack.optimize.CommonsChunkPlugin({ 
            name: ['manifest']
        }),

        // split xxx.css
        new ExtractTextPlugin('css/[name].[hash].css'),

        // minimize css files and remove unused style
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/**/*.html')),
            minimize: inProduction
        }),

        // minimize javascript files.
        new webpack.LoaderOptionsPlugin({
            minimize: inProduction
        }),

        // for HTML
        new HtmlWebpackPlugin({
            //template: 'src/index.html'
            template: path.resolve(__dirname, 'src/index.html'),
            mobile: false,
            title: conf.title,
            inject: true,
            minify: {
                collapseInlineTagWhitespace: inProduction,
                collapseWhitespace: inProduction,
                removeComments: inProduction,
                minifyCSS: inProduction,
                minifyJS: inProduction,
                minifyURLs: inProduction
            }
        }),

        // for favicons
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, conf.icons.seedImage),
            prefix: 'images/icons-[hash]/',
            emitStats: conf.debug,
            statsFilename: '../stats/icon-stats-[hash].json',
            persistentCache: true,
            inject: true,
            background: conf.icons.background,
            title: conf.title,
            icons: {
                android: conf.icons.android,
                appleIcon: conf.icons.appleIcon,
                appleStartup: conf.icons.appleStartup,
                coast: conf.icons.coast,
                favicons: conf.icons.favicons,
                firefox: conf.icons.firefox,
                opengraph: conf.icons.opengraph,
                twitter: conf.icons.twitter,
                yandex: conf.icons.yandex,
                windows: conf.icons.windows
            }
        }),

        // for moment.js
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ja|cn/),

    ]
};

if( inProduction ) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
}
