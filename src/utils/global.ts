import { type App, reactive } from 'vue'
import { logo, background } from './images'

export const MI_DEFAULT_AVATAT = logo
export const MI_DEFAULT_BACKGROUND = background
export const MI_POWERED = 'Powered By makeit.vip'
export const MI_TARGET = 'https://admin.makeit.vip/components/captcha'

/**
 * 全局通用变量.
 * Global variable.
 */
export const $g = reactive({
    name: 'Makeit Admin Pro',
    title: 'Makeit Admin Pro',
    site: 'Admin Pro',
    author: 'makeit.vip',
    background: MI_DEFAULT_BACKGROUND,
    keywords: 'makeit, 麦可易特网, makeit-captcha, captcha, 滑块验证码, vue3, vite, canvas',
    description:
        '基于 Vue3.x + Vite6.x + Canvas 开发的滑块验证码。动态生成验证滑块，结合后端的二次校验，能有效的避免被其他人肆意抓取并模拟验证，进一步提升验证码的的可靠性，且能满足大部分用户的不同定制化需求，譬如自定义背景图 / 定制主题色等等。',
    powered: MI_POWERED,

    /**
     * 前缀.
     * anywhere you want to used, eg: cookie, storage, vuex ...
     */
    prefix: 'mi-',

    logo: MI_DEFAULT_AVATAT,
    avatar: MI_DEFAULT_AVATAT,

    /**
     * 加密盐值 ( 可自行通过 env 配置进行覆盖 ).
     * Encrypted salt.
     */
    salt: 'mi-bXrf4dJbLlf0u8X3',

    /**
     * 分隔符 ( 可用于加密字串的切分, 用于解密等 ).
     * delimiter, Mainly used when decrypting encrypted strings.
     */
    separator: '/!#!$/',

    apiVersion: 'v1',
    locale: 'zh-cn',

    protocols: ['https', 'http', 'ftp', 'mms', 'rtsp'],
    regExp: {
        phone: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
        password: /^[A-Za-z0-9~!@#$%^&*()_+=\-.,]{6,32}$/,
        username: /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/,
        email: /^[A-Za-z0-9.\-_\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        chinese: /^[\u4e00-\u9fa5]*$/,
        hex: /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,
        rgb: /^(rgb|RGB)/
    },

    /**
     * 缓存 Key 值 ( cached key value ).
     * 区分 `storage` 与 `cookie` 的缓存.
     * including `storages` and `cookies`.
     */
    caches: {
        cookies: {
            auto: 'auto-login',
            token: {
                access: 'access-token',
                refresh: 'refresh-token'
            }
        },
        storages: {
            token: {
                access: 'access-token',
                refresh: 'refresh-token'
            },
            captcha: {
                login: 'login-captcha-key',
                register: 'register-captcha-key',
                email: 'email-captcha-key'
            }
        }
    },
    breakpoints: {
        xs: 480,
        sm: 576,
        md: 768,
        lg: 992,
        xm: 1024,
        xl: 1200,
        xxl: 1600,
        xxxl: 2000
    },
    winSize: {
        width: 0,
        height: 0
    }
})

export default {
    install(app: App) {
        app.config.globalProperties.$g = $g
        app.provide('$g', $g)
        return app
    }
}
