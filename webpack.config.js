var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var NODE_ENV = process.env.NODE_ENV || 'development';

var devtoolConfig = (NODE_ENV === 'production') ? false : '#source-map';

console.log('node_env: ' + NODE_ENV);
console.log('devtool config: ' + devtoolConfig);

module.exports = {
    devtool: devtoolConfig,

    entry: {
        global: ['babel-polyfill', './app/index.js'],
        admin: './app/modules/reactHelpDeskAdmin/admin.js'
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/[name].min.js',
        publicPath: '/'
    },

    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' }) },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                fallbackLoader: 'style-loader',
                loader: 'css-loader?sourceMap!postcss-loader!sass-loader?sourceMap',
                includePaths: [path.resolve(__dirname, './app/scss')]
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    plugins: [
                        ['transform-runtime']
                    ],
                    presets: ['es2015', 'stage-2']
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=images/[name]-[hash].[ext]',
                    //'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {
                test: /\.(eot|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            // { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                context: '/',
                postcss: [
                    require('autoprefixer')({
                        browsers: ['> 2%', 'IE 10']
                    })
                ]
                // ...other configs that used to directly on `modules.exports`
            }
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'app', 'index.html'),
            filename: 'index.html',
            inject: 'body'
        }),
        new ExtractTextPlugin('./css/[name].min.css'),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     },
        //     comments: false,
        //     //sourceMap: false
        // }),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify(NODE_ENV)
        //     }
        // })
    ]
};


