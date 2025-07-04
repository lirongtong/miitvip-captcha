import { createI18n, type I18n } from 'vue-i18n'
import zhCN from './locales/zh-cn'
import enUS from './locales/en-us'
import zhTw from './locales/zh-tw'

const messages = {
    'zh-CN': zhCN,
    'en-US': enUS,
    'zh-tw': zhTw
}

export const setupI18n = (app: any) => {
    const globalI18n: I18n | undefined = app.config.globalProperties.$i18n

    if (globalI18n) {
        Object.entries(messages).forEach(([locale, msg]) => {
            globalI18n.global.mergeLocaleMessage(locale, msg)
        })
    } else {
        const i18n = createI18n({
            legacy: false,
            locale: 'zh-CN',
            messages
        })
        app.use(i18n)
    }
}
