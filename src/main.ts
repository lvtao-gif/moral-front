import './assets/main.css'

import {createApp} from 'vue'
import VueCookies from 'vue-cookies'

// 预览组件以及样式
import VMdPreview from '@kangc/v-md-editor/lib/preview.js';
import '@kangc/v-md-editor/lib/style/preview.css';
// VuePress主题以及样式（这里也可以选择github主题）
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';

// Prism
import Prism from 'prismjs';
// 代码高亮
import 'prismjs/components/prism-json';


// 选择使用主题
VMdPreview.use(vuepressTheme, {
    Prism,
});

import App from './App.vue'
import router from './router'

import ElementUI from 'element-plus'
// import 'element-plus/theme-chalk/index.css'
import './assets/element-variables.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import locale from 'element-plus/es/locale/lang/zh-cn'
const app = createApp(App)

locale.el.pagination.goto = '跳转至';
locale.el.pagination.total = '总共 {total} 条';

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.config.globalProperties.$cookies = VueCookies
app.use(router).use(ElementUI, {locale}).use(VMdPreview).mount('#app')
