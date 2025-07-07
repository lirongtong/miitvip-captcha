// vite.config.base.ts
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        vueDevTools(),
        dts({
            entryRoot: path.resolve(__dirname, 'src'),
            tsconfigPath: path.resolve(__dirname, 'tsconfig.app.json'),
            include: ['src'],
            outDir: 'es',
            copyDtsFiles: true,
            insertTypesEntry: true,
            cleanVueFileName: true
        })
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'MiCaptcha'
        },
        cssCodeSplit: true,
        minify: true,
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
            output: [
                {
                    format: 'es',
                    dir: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].mjs',
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
