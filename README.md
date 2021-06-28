<p align="center">
    <a href="https://admin.makeit.vip/">
        <img width="200" src="https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_pUyOALE2LAAAtlj6Tt_s370.png">
    </a>
</p>

<h1 align="center" color="green">
    <a href="https://admin.makeit.vip/components/captcha" target="_blank" style="color: #41b995">
        Makeit Captcha
    </a>
</h1>

<div align="center">

基于 Vue3.0 + Vite 开发，动态生成验证滑块的验证码组件

[![npm package](https://img.shields.io/npm/v/makeit-captcha.svg?style=flat-square)](https://www.npmjs.org/package/makeit-captcha)
[![npm_downloads](http://img.shields.io/npm/dm/makeit-captcha.svg?style=flat-square)](http://www.npmtrends.com/makeit-captcha)
![MIT](https://img.shields.io/badge/license-MIT-ff69b4.svg)
![webpack](https://img.shields.io/badge/webpack-5.11.0-orange.svg)
![vue](https://img.shields.io/badge/vue-3.0.5-green.svg)
![vite](https://img.shields.io/badge/vite-1.0.0-yellow.svg)
![axios](https://img.shields.io/badge/axios-0.21.1-red.svg)
</div>

## 关于

> Makeit Captcha 滑块验证码组件，是基于 Vue3.0 + Vite + Canvas 开发，动态生成验证滑块，结合后端进行二次校验，能有效避免被恶意抓取后的模拟验证，进一步提升验证码的可靠性。

## 安装

```bash
npm i makeit-captcha
```

## 使用
```ts
import { createApp } from 'vue'
import MakeitCaptcha from 'makeit-captcha'
import 'makeit-captcha/dist/captcha.min.css'
import App from './app.vue'

const app = createApp(App)
app.use(MakeitCaptcha)
app.mount('#app')
```

## 示例
```vue
<!-- 基础效果 -->
<template>
    <mi-captcha></mi-captcha>
</template>

<!-- 自定义主题色 -->
<template>
    <mi-captcha theme-color="#2F9688"></mi-captcha>
</template>

<!-- 自定义初始化 / 校验等 -->
<template>
    <mi-captcha theme-color="#be6be0"
        init-action="v1/captcha/init"
        @init="initAfter"
        verify-action="v1/captcha/verification"
        :verify-params="verifyParams">
    </mi-captcha>
</template>
```

```ts
import { defineComponent } from 'vue'
export default defineComponent({
    data() {
        return {
            verifyParams: {}
        }
    },
    methods: {
        initAfter(res) {
            if (res.ret.code === 1) {
                localStorage.setItem('mi-captcha-key', res.data.key)
                this.verifyParams = {key: res.data.key}
            }
        }
    }
})
```

## 更多
> 更多定制化内容及使用请查看在线示例：[https://admin.makeit.vip/components/captcha](https://admin.makeit.vip/components/captcha)