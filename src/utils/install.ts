import type { App, Plugin } from 'vue'

export const install = <T extends { name: string }>(component: T, alias?: string): T & Plugin => {
    const C = component as Plugin & T
    C.install = (app: App) => {
        app.component(C.name, component)
        if (alias) app.config.globalProperties[alias] = component
    }
    return component as T & Plugin
}
