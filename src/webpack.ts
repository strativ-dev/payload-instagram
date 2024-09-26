import path from 'path'
import type { Config } from 'payload/config'
import type { Configuration as WebpackConfig } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export const extendWebpackConfig =
  (config: Config): ((webpackConfig: WebpackConfig) => WebpackConfig) =>
  webpackConfig => {
    const existingWebpackConfig =
      typeof config.admin?.webpack === 'function'
        ? config.admin.webpack(webpackConfig)
        : webpackConfig

    const mockModulePath = path.resolve(__dirname, './mocks/mockFile.js')

    const newWebpack = {
      ...existingWebpackConfig,
      rules: [
        ...(existingWebpackConfig.module?.rules || []),
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
      resolve: {
        ...(existingWebpackConfig.resolve || {}),
        alias: {
          ...(existingWebpackConfig.resolve?.alias ? existingWebpackConfig.resolve.alias : {}),
          // Add additional aliases here like so:
          [path.resolve(__dirname, './yourFileHere')]: mockModulePath,
        },
      },
      plugins: [
        ...(existingWebpackConfig.plugins || []),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
      ],
      output: {
        ...existingWebpackConfig.output,
        // Add additional output properties here
        path: path.resolve(__dirname, 'dist'),
      },
    }

    return newWebpack
  }
