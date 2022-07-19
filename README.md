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
![webpack](https://img.shields.io/badge/webpack-5.73.0-orange.svg)
![vue](https://img.shields.io/badge/vue-3.2.36-green.svg)
![vite](https://img.shields.io/badge/vite-2.9.13-yellow.svg)
![axios](https://img.shields.io/badge/axios-0.27.2-red.svg)
![ant design vue](https://img.shields.io/badge/ant%20design%20vue-3.x-blueviolet.svg)
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

```Vue
<!-- 自定义初始化 / 校验等 -->
<template>
    <div class="mi-captchas">

        <!-- 基础效果 -->
        <mi-captcha ref="captcha" />

        <!-- 手动触发重置 -->
        <a @click="reset">重置</a>

        <!-- 自定义主题色 -->
        <mi-captcha theme-color="#2F9688"
            border-color="#2F9688"
            box-shadow-color="#2F9688" />
        
        <!-- 自定义初始化 / 校验等 -->
        <mi-captcha theme-color="#be6be0"
            init-action="v1/captcha/init"
            @init="initAfter"
            verify-action="v1/captcha/verification"
            :verify-params="params.verify" />
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue'

    const captcha = ref(null)

    const params = reactive({
        verify: { key: null }
    })
    
    const initAfter = (res) => {
        if (res?.ret?.code === 200) {
            localStorage.setItem('mi-captcha-key', res?.data?.key)
            params.verify.key = res?.data?.key
        }
    }

    const reset = () => {
        console.log('reinitialize')
        captcha.value?.reset(false)
    }
</script>
```

## 更多

> 更多定制化内容及使用请查看在线示例：[https://admin.makeit.vip/components/captcha](https://admin.makeit.vip/components/captcha)
