// vite.config.iife.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import babel from '@rollup/plugin-babel'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'MiCaptcha',
            fileName: 'makeit-captcha.min.js'
        },
        sourcemap: true,
        rollupOptions: {
            external: [
                'vue',
                'ant-design-vue',
                'vue-i18n',
                '@ant-design/icons-vue',
                'axios',
                'vue-types',
                '@material/material-color-utilities'
            ],
            plugins: [
                babel({
                    babelHelpers: 'bundled',
                    extensions: ['.js', '.ts', '.vue'],
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
            ],
            output: [
                {
                    format: 'iife',
                    dir: 'dist',
                    entryFileNames: 'makeit-captcha.min.js',
                    assetFileNames: 'makeit-captcha.min.css',
                    name: 'MiCaptcha',
                    globals: {
                        vue: 'Vue',
                        'ant-design-vue': 'AntDesignVue',
                        'vue-i18n': 'VueI18n',
                        '@ant-design/icons-vue': 'AntDesignIconsVue',
                        axios: 'Axios',
                        'vue-types': 'VueTypes',
                        '@material/material-color-utilities': 'MaterialColorUtilities'
                    },
                    exports: 'named'
                }
            ]
        }
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
    }
})
