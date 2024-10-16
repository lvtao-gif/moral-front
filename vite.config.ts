import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    server: {
        host: "0.0.0.0",
        port: 34568,     // 端口
        proxy:{
            // 配置代理地址   api可以自定义
            '/api':{
                changeOrigin: true,
                secure: false, // 是否https接口
                // 配置后端的地址
                target:"http://127.0.0.1:8000",
                // 自动将/api替换成空
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/vcis11':{
                changeOrigin: true,
                secure: false, // 是否https接口
                // 配置后端的地址
                target:"http://10.110.147.246:5004",
                // 自动将/api替换成空
                rewrite: (path) => path.replace(/^\/vcis11/, ''),
            },
            '/vc':{
                changeOrigin: true,
                secure: false, // 是否https接口
                // 配置后端的地址
                target:"http://43.143.213.61:8080",
                // 自动将/api替换成空
                rewrite: (path) => path.replace(/^\/vcis/, ''),
            }
        },
    },
    assetsInclude: ['**/*.md', '**/*.gltf'],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})

