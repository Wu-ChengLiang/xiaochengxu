import type { UserConfigExport } from '@tarojs/cli'
import { defineConfig } from '@tarojs/cli'
import path from 'path'

export default defineConfig<'vite'>({
  projectName: 'massage-appointment',
  date: '2025-1-3',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    375: 2,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-platform-weapp', '@tarojs/plugin-platform-h5'],
  defineConstants: {
    'process.env.TARO_APP_USE_MOCK': JSON.stringify(process.env.TARO_APP_USE_MOCK || 'true'),
    'process.env.TARO_APP_API': JSON.stringify(process.env.TARO_APP_API || ''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  copy: {
    patterns: [
      { from: 'src/assets/images/', to: 'dist/assets/images/' }
    ],
    options: {
    }
  },
  framework: 'react',
  compiler: 'vite',
  cache: {
    enable: true // 开启缓存，提升编译速度
  },
  sass: {
    resource: [],
    // 静默依赖包的弃用警告
    quietDeps: true,
    // 静默所有弃用警告（可选，更彻底）
    // silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api']
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/services': path.resolve(__dirname, '..', 'src/services'),
    '@/store': path.resolve(__dirname, '..', 'src/store'),
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/mock': path.resolve(__dirname, '..', 'src/mock')
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js'
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[chunkhash].css'
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
} satisfies UserConfigExport<'vite'>)