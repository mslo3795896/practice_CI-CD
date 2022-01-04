import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'

const bundleDir = 'cms-build'

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: require('./aliases.config').webpack,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/_variables.scss";`
      }
    }
  },
  server: {
    port: 2087,
    proxy: {'/api':'http://zerone2021.test'}
  },
  build: {
    outDir: "../public",
    // assetsDir: "checkin-plus-build",
    sourcemap: true,
    assetsInlineLimit: 30960,
    rollupOptions: {
      output: {
        chunkFileNames: `${bundleDir}/js/[name]-[hash].js`,
        entryFileNames: `${bundleDir}/js/[name]-[hash].js`,
        assetFileNames: `${bundleDir}/[ext]/[name]-[hash].[ext]`,  //  將檔案分類至不同資料夾
      },
      plugins: [
        //  --emptyOutDir 會把 public 底下的其他重要的檔案清除，所以改用 plugin 清除特定目錄
        del({ targets: `../public/${bundleDir}/*`, force: true }),
        // 將多餘的 index.html 刪除
        // del({ targets: `../public/index.html`, force: true, hook: 'closeBundle' }),
        /* https://github.com/vladshcherbin/rollup-plugin-copy */
        copy({
          targets: [
            { 
              src: '../public/index.html',
              dest: `../resources/views/${bundleDir.replace('-build', '')}`,
              rename: 'index.blade.php',
            }
          ],
          hook: 'writeBundle'
        })
      ]
    },
  },
  
})