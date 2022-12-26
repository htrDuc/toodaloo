import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {crx} from '@crxjs/vite-plugin'
import Icons from 'unplugin-icons/vite'

// @ts-ignore
import manifest from './manifest.json'

export default defineConfig({
    plugins: [vue(), crx({manifest}), Icons({ compiler: 'vue3' }),
    ],
})
