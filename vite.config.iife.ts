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
            name: 'MiCaptcha'
        },
        rollupOptions: {
            external: ['vue', 'ant-design-vue', 'vue-i18n', '@ant-design/icons-vue'],
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
                    dir: 'dist/iife',
                    entryFileNames: 'makeit-captcha.min.js',
                    name: 'MiCaptcha',
                    globals: {
                        vue: 'Vue',
                        'ant-design-vue': 'AntDesignVue',
                        'vue-i18n': 'VueI18n',
                        '@ant-design/icons-vue': 'AntDesignIconsVue'
                    },
                    exports: 'named',
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                            return 'makeit-captcha.min.css'
                        }
                        return '[name]-[hash][extname]'
                    }
                }
            ]
        }
    }
})
