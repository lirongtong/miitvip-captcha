import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'
import { babel } from '@rollup/plugin-babel'
import { transformAsync } from '@babel/core'

function babelForIIFE() {
    const babelConfig = {
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts', '.tsx', '.vue', '.jsx'],
        exclude: 'node_modules/**',
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: '> 0.25%, not dead',
                    modules: false
                }
            ]
        ],
        filter: (_id: string, options: { format?: string }) => options.format === 'iife'
    }

    return {
        name: 'babel-for-iife-only',
        async renderChunk(code: string, chunk: any, outputOptions: any) {
            if (outputOptions.format === 'iife') {
                const result = await transformAsync(code, {
                    filename: chunk.fileName,
                    presets: babelConfig.presets,
                    sourceMaps: false,
                    babelrc: false,
                    configFile: false
                })

                return result?.code ?? code
            }
            return null
        }
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        vueDevTools(),
        dts({
            entryRoot: path.resolve(__dirname, 'src'),
            outDir: ['dist/es', 'dist/lib'],
            include: ['src'],
            tsconfigPath: path.resolve(__dirname, 'tsconfig.app.json'),
            rollupTypes: true,
            copyDtsFiles: true,
            insertTypesEntry: true,
            cleanVueFileName: true
        })
    ],
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'MiCaptcha'
        },
        rollupOptions: {
            external: ['vue', 'ant-design-vue', 'vue-i18n', '@ant-design/icons-vue'],
            output: [
                // ES module, 保持文件结构，输出到 dist/es
                {
                    format: 'es',
                    dir: 'dist/es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].mjs',
                    exports: 'named'
                },
                // CommonJS, 保持文件结构，输出到 dist/lib
                {
                    format: 'cjs',
                    dir: 'dist/lib',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].cjs.js',
                    exports: 'named'
                },
                // IIFE for direct <script> 引入，输出到 dist/iife
                {
                    format: 'iife',
                    dir: 'dist/iife',
                    entryFileNames: 'makeit-captcha.iife.js',
                    name: 'MiCaptcha',
                    globals: {
                        vue: 'Vue',
                        'ant-design-vue': 'AntDesignVue',
                        'vue-i18n': 'VueI18n',
                        '@ant-design/icons-vue': 'AntDesignIconsVue'
                    },
                    plugins: [
                        babel({
                            babelHelpers: 'bundled',
                            extensions: ['.ts', '.tsx', '.js', '.vue'],
                            exclude: 'node_modules/**',
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: '> 0.25%, not dead',
                                        modules: false
                                    }
                                ]
                            ]
                        })
                    ]
                }
            ]
        },
        cssCodeSplit: true,
        sourcemap: false,
        minify: false
    },
    css: {
        devSourcemap: true,
        modules: {
            generateScopedName: 'mi-[name]-[hash:base64:8]',
            localsConvention: 'camelCase'
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
