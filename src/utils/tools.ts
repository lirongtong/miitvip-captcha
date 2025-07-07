import type { App } from 'vue'
import type { DeviceSize, Position, KeyValue } from './types'
import { $g } from './global'
import {
    argbFromHex,
    themeFromSourceColor,
    hexFromArgb,
    type Scheme
} from '@material/material-color-utilities'

class MiTools {
    /**
     * Whether the `element / params` is valid.
     * @param value
     */
    isValid(value: unknown): boolean {
        return value !== undefined && value !== null && value !== ''
    }

    /**
     * 是否为数字
     * @param number
     * @returns
     */
    isNumber(number: any): boolean {
        return typeof number === 'number' && isFinite(number)
    }

    /**
     * 单位转换 px -> rem
     * @param value
     * @param base
     */
    px2rem(value: number | string, base?: number): number {
        const val = parseInt((value || '').toString().replace('px', ''))
        return this.isNumber(val) ? Math.round((val / (base || 16)) * 1000) / 1000 : 0
    }

    /**
     * 转 rem
     * @param num
     * @returns
     */
    convert2rem(num: any): any {
        return this.isNumber(num)
            ? `${this.px2rem(num)}rem`
            : num
              ? /%|px|rem|em|rpx|auto/g.test(num)
                  ? num
                  : `${this.px2rem(parseInt(num))}rem`
              : null
    }

    /**
     * 根据窗口尺寸获取配置的大小值
     * @param value 大小值
     *
     * @see DeviceSize
     * @see Breakpoints
     */
    distinguishSize(value?: string | number | DeviceSize, dynamicWidth?: number) {
        if (value === undefined) return null
        if (typeof value !== 'object') return value
        const width = dynamicWidth ?? ($g?.winSize?.width || 0)
        if (!width) return null
        const { md = 768, lg = 992 } = $g?.breakpoints ?? {}
        return width < md
            ? (value.mobile ?? Object.values(value)[0])
            : width < lg
              ? (value.tablet ?? Object.values(value)[0])
              : (value.laptop ?? value.tablet ?? Object.values(value)[0])
    }

    /**
     * 随机生成字符串.
     * @returns {string}
     */
    random(): string {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    /**
     * 生成唯一的 UID.
     * @param upper
     * @returns {string}
     */
    uid(upper = false, prefix?: string): string {
        let str = (
            this.random() +
            this.random() +
            this.random() +
            this.random() +
            this.random()
        ).toLocaleUpperCase()
        str = (prefix ?? $g.prefix) + str
        return upper ? str.toUpperCase() : str.toLowerCase()
    }

    /**
     * 添加事件监听.
     * 注: scroll 事件的监听等请务必使用此方法设定.
     * 避免多人重复定义被覆盖.
     * @param el
     * @param event
     * @param listener
     * @param useCapture
     */
    on(
        el: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (this: HTMLElement, evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
        useCapture?: false
    ) {
        if (!!document.addEventListener) {
            if (el && event && listener) el.addEventListener(event, listener, useCapture)
        } else {
            if (el && event && listener) (el as any).attachEvent(`on${event}`, listener)
        }
    }

    /**
     * 移除事件监听.
     * @param el
     * @param event
     * @param listener
     * @param useCapture
     */
    off(
        el: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (this: HTMLElement, evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
        useCapture?: false
    ) {
        if (!!document.addEventListener) {
            if (el && event && listener) el.removeEventListener(event, listener, useCapture)
        } else {
            if (el && event && listener) (el as any).detachEvent(`on${event}`, listener)
        }
    }

    /**
     * 颜色转换 hex -> rgba
     * @param color
     * @param opacity
     * @returns
     */
    colorHex2Rgba(color: string, opacity = 1): string {
        if (color) {
            if ($g.regExp.hex.test(color)) {
                if (color.length === 4) {
                    if (color.length === 4) {
                        let newColor = '#'
                        for (let i = 1; i < 4; i++) {
                            newColor += color.slice(i, i + 1).concat(color.slice(i, i + 1))
                        }
                        color = newColor
                    }
                    const changeColor: number[] = []
                    for (let i = 1; i < 7; i += 2) {
                        changeColor.push(parseInt('0x' + color.slice(i, i + 2)))
                    }
                    return `rgba(${changeColor.join(',')}, ${opacity})`
                }
            }
        }
        return color
    }

    /**
     * 颜色转换 rgb -> hex
     * @param color
     * @returns
     */
    colorRgb2Hex(color: string): string {
        if (color) {
            if ($g.regExp.rgb.test(color)) {
                const aColor = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
                let strHex = '#'
                for (let i = 0; i < aColor.length; i++) {
                    let hex = Number(aColor[i]).toString(16)
                    if (hex === '0') hex += hex
                    strHex += hex
                }
                if (strHex.length !== 7) strHex = color
                return strHex
            } else if ($g.regExp.hex.test(color)) {
                const aNum = color.replace(/#/, '').split('')
                if (aNum.length === 6) {
                    return color
                } else if (aNum.length === 3) {
                    let numHex = '#'
                    for (let i = 0; i < aNum.length; i += 1) {
                        numHex += aNum[i] + aNum[i]
                    }
                    return numHex
                }
            }
        }
        return color
    }

    /**
     * Hex 转 rgb 数值
     * @param color
     * @returns
     */
    hex2rgbValues(color: string): number[] {
        const hex = color.replace(/^#/, '')
        const len = hex.length
        if (len !== 3 && len !== 6) return []
        const expand =
            len === 3
                ? hex
                      .split('')
                      .map((c) => c + c)
                      .join('')
                : hex

        return expand.match(/[a-f\d]{2}/gi)!.map((v) => parseInt(v, 16))
    }

    /**
     * 判断是否为 URL
     * @param url
     * @returns
     */
    isUrl(url: string): boolean {
        try {
            const info = new URL(url)
            if (
                ($g.protocols || ['https', 'http', 'ftp', 'mms', 'rtsp']).includes(
                    info.protocol.replace(':', '')
                )
            )
                return true
            return false
        } catch {
            return false
        }
    }

    /**
     * 生成范围内的随机数.
     * @param start
     * @param end
     * @returns {number}
     */
    randomNumberInRange(start: number, end: number): number {
        return Math.round(Math.random() * (end - start) + start)
    }

    /**
     * 封装定位或间距
     * @param [string, number] value 数值
     * @param prefix 前缀 (如: margin)
     */
    wrapPositionOrSpacing(data: Position, prefix?: string) {
        const position: Record<string, string> = {}
        if (Object.keys(data).length > 0) {
            const defaultPosition = ['top', 'bottom', 'left', 'right'] as const

            const ucfirst = (letter: string): string => {
                return letter.slice(0, 1).toUpperCase() + letter.slice(1).toLowerCase()
            }

            const getKeys = (): KeyValue[] => {
                return defaultPosition.map((pos) => ({
                    key: pos,
                    value: prefix ? `${prefix}${ucfirst(pos)}` : pos
                }))
            }
            const items = getKeys()
            items.forEach((item: KeyValue) => {
                const v = data[item.key as keyof Position]
                position[item.value] =
                    typeof v !== 'undefined'
                        ? v !== 'unset'
                            ? $tools.convert2rem($tools.distinguishSize(v))
                            : v
                        : null
            })
        }
        return position
    }

    /**
     * 格式化空字符串
     * @param str
     * @param formatter
     * @returns
     */
    formatEmpty(str?: string, formatter?: string): string | undefined {
        if (this.isEmpty(str)) return formatter ?? '-'
        return str
    }

    /**
     * 判断是否为空
     * @param str
     * @param format
     * @returns
     */
    isEmpty(str: any, format = false): boolean | string {
        let result: any = str === null || str == '' || typeof str === 'undefined'
        if (format) result = this.formatEmpty(str)
        return result
    }

    /**
     * 根据主色调生成主题变量
     * @param primary 主题色 ( hex )
     * @param target 变量插入的节点
     */
    createThemeProperties(primary?: string, target?: HTMLElement) {
        try {
            const themes = themeFromSourceColor(argbFromHex(primary || '#386E57'))
            this.setThemeSchemeProperties(themes.schemes[$g?.theme?.type || 'dark'], target)
        } catch {
            throw new Error('The `theme` variable only supports HEX (e.g. `#FFFFFF`).')
        }
    }

    /**
     * 设置全局的主题变量
     * @param scheme
     * @returns
     */
    setThemeSchemeProperties(scheme: Scheme, target?: HTMLElement) {
        const tokens: string[] = [`--mi-radius: ${$tools.convert2rem($g?.theme?.radius)};`]
        for (const [key, value] of Object.entries(scheme.toJSON())) {
            const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
            const color = hexFromArgb(value)
            const rgb = this.hex2rgbValues(color)
            tokens.push(`--mi-${token}: ${color};`, `--mi-rgb-${token}: ${rgb.join(',')};`)
            if (target) {
                target.style.setProperty(`--mi-${token}`, color)
                target.style.setProperty(`--mi-rgb-${token}`, rgb as any)
            }
        }
        if (!target) this.createCssVariablesElement(tokens, undefined, true)
    }

    /**
     * 创建 style 标签并写入 css variables
     * @param tokens
     * @param id
     * @param overwritten 强制覆盖
     * @param append head 末尾追加
     * @param scopeKey 默认全局
     */
    createCssVariablesElement(
        tokens: string[],
        id?: string,
        overwritten?: boolean,
        append?: boolean,
        scopeKey?: string
    ) {
        if (tokens.length > 0) {
            id = id ?? `${$g.prefix}common-css-variables`
            const oldStyle = document.querySelector(`#${id}`)
            if (!oldStyle || overwritten) {
                if (oldStyle) oldStyle.remove()
                const style = document.createElement('style')
                style.setAttribute('id', id)
                style.setAttribute('data-css-hash', Math.random().toString(36).slice(-8))
                style.textContent = `${scopeKey || `:root`} {${tokens.join('')}}`
                const head = document.head || document.getElementsByTagName('head')[0]
                const first = head.firstChild
                if (append) head.appendChild(style)
                else head.insertBefore(style, first)
            }
        }
    }

    /**
     * 获取局部的主题变量
     * @param properties
     * @returns
     */
    getThemeModuleProperties(properties: Record<string, any>): Record<string, any> {
        const vars = {} as Record<string, any>
        Object.keys(properties || {}).forEach((key: string) => {
            if (/^--*/.test(key)) {
                const label = key.replace(/--/g, '')
                vars[label] = properties[key]
            }
        })
        return vars
    }

    /**
     * 主题变量
     * @param record
     * @returns
     */
    setThemeModuleTokens(record: Record<string, any>, target?: HTMLElement) {
        const tokens: string[] = []
        let id = ''
        for (const key in record) {
            tokens.push(`--mi-${key}: ${record[key]};`)
            if (this.isEmpty(id)) {
                const keys = (key || '').split('-') || []
                if (keys.length > 0) keys.pop()
                id = `${$g.prefix}components-${keys.join('-')}-css-variables`
            }
            if (target) target.style.setProperty(`--mi-${key}`, record[key])
        }
        if (!target) this.createCssVariablesElement(tokens, id)
    }

    /**
     * 设定局部主题变量
     * @param properties 内置局部变量
     * @param customProperties 自定义变量
     */
    applyThemeModuleProperties(
        properties: Record<string, any>,
        customProperties: Record<string, any>,
        target?: HTMLElement
    ) {
        const themeVars = this.getThemeModuleProperties(properties) || {}
        const getCustomTokens = (data: Record<string, any>, name?: string) => {
            for (const key in data) {
                const index = `${name ? `${name}-` : ''}${key}`
                if (typeof data[key] === 'string') {
                    themeVars[index] = data[key]
                } else if (typeof data[key] === 'object') getCustomTokens(data[key], index)
            }
        }
        getCustomTokens(customProperties)
        if (Object.keys(themeVars).length > 0) this.setThemeModuleTokens(themeVars, target)
    }

    /**
     * 合并组件局部主题变量
     * @param properties 组件内的默认主题变量
     * @param customProperties 自定义组件主题变量
     * @returns
     */
    assignThemeModuleProperties(
        properties: Record<string, any>,
        customProperties: Record<string, any>
    ): Record<string, any> {
        const themes = this.getThemeModuleProperties(properties) || {}
        if (Object.keys(themes).length > 0) {
            for (const key in themes) {
                const keys = (key || '').split('-') || []
                let current = customProperties?.components
                for (let i = 0, l = keys.length; i < l; i++) {
                    current = current?.[keys[i]] || {}
                    if (i === l - 1 && typeof current === 'string') {
                        themes[key] = current
                        break
                    }
                }
            }
        }
        return themes
    }

    /**
     * 销毁局部主题变量
     * @param properties
     */
    destroyThemeModuleProperties(properties: Record<string, any>) {
        let label = ''
        const keys = Object.keys(properties || {})
        for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i]
            if (/^--*/.test(key)) {
                label = key.replace(/--/g, '')
                break
            }
        }
        const labels = (label || '').split('-') || []
        if (labels.length > 0) labels.pop()
        const token = `${$g.prefix}components-${labels.join('-')}-css-variables`
        const elem = document.getElementById(token)
        if (elem) elem.remove()
    }

    /**
     * 判断字符串是否是颜色值
     * @param str
     * @returns
     */
    isColorString(str: string): boolean {
        if (!str) return false
        const hexColorRegex = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
        const rgbColorRegex = /^rgb\(\s*(\d{1,3}%?\s*,){2}\d{1,3}%?\s*\)$/
        const rgbaColorRegex = /^rgba\(\s*(\d{1,3}%?\s*,){3}(0|1|0?\.\d+)\s*\)$/

        return hexColorRegex.test(str) || rgbColorRegex.test(str) || rgbaColorRegex.test(str)
    }
}

export const $tools: MiTools = new MiTools()

export default {
    install(app: App) {
        app.config.globalProperties.$tools = $tools
        return app
    }
}
