const path = require('path');
const resolve = (dir) => path.resolve(__dirname, '../', dir);
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const pkg = require('../package.json');
const postcssConfig = require('../postcss.config');
const banner = `${pkg.name} v${pkg.version}

Copyright ${new Date().getFullYear()} makeit.vip <lirongtong@hotmail.com>.
All rights reserved.
@license MIT`;

const entry = resolve('index');
const distFileName = 'captcha';

module.exports = merge(baseConfig, {
	devtool: 'source-map',
    mode: 'production',
    entry: {
        [`${distFileName}`]: entry,
        [`${distFileName}.min`]: entry
    },
    output: {
        path: resolve('dist'),
        filename: '[name].js',
        library: distFileName,
        libraryTarget: 'umd'
    },
    externals: [
        {
            vue: {
				root: 'Vue',
				commonjs: 'vue',
				commonjs2: 'vue',
				amd: 'vue'
            },
			axios: {
				root: 'Axios',
				commonjs: 'axios',
				commonjs2: 'axios',
				amd: 'axios'
			},
			'@ant-design/icons-vue': {
				root: '@AntDesign/IconsVue',
				commonjs: '@ant-design/icons-vue',
				commonjs2: '@ant-design/icons-vue',
				amd: '@ant-design/icons-vue'
			}
        }
    ],
    plugins: [
        new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"',
			'process.env.MAKEIT_CAPTCHA_PREFIX': '"mi-"'
		}),
		new webpack.BannerPlugin({
			banner
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		}),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ['dist']
		}),
		new CaseSensitivePathsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new CompressionPlugin({
			test: /\.min.(js|css)$/,
			algorithm: 'gzip',
			threshold: 10240,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				test: /\.min.js(\?.*)?$/i
			}),
			new OptimizeCSSAssetsPlugin({
				assetNameRegExp: /\.min\.css$/
			})
		]
	}
});