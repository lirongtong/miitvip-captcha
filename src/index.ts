import type { App } from 'vue'
import { captchaLocales } from './locales/index'
import { createI18n } from 'vue-i18n'
import { default as Captcha } from './captcha'

let _i18n: any = null

export const setupCaptchaI18n = (options: { i18n?: any } = {}) => {
    _i18n = options.i18n || null
}

const install = (app: App) => {
    if (_i18n) {
        Object.entries(captchaLocales).forEach(([locale, msg]) => {
            _i18n.global.mergeLocaleMessage(locale, msg)
        })
        const currentLocale = _i18n.global.locale.value
        _i18n.global.mergeLocaleMessage(currentLocale, captchaLocales['zh-cn'])
    } else {
        const i18n = createI18n({
            legacy: false,
            locale: 'zh-cn',
            fallbackLocale: 'zh-cn',
            messages: captchaLocales
        })
        app.use(i18n)
    }
    app.use(Captcha)
    return app
}

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        MiCaptcha: typeof Captcha
    }
}

export default {
    version: '1.0.0',
    install,
    Captcha
}
