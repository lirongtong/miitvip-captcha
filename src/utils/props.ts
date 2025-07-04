import { isVNode, Fragment, Comment, Text, type PropType, type Slots, type VNode } from 'vue'
import type { VueTypeDef, VueTypeValidableDef } from 'vue-types'
import { $tools } from './tools'

export const tuple = <T extends string[]>(...args: T): T => args

const onRE = /^on[^a-z]/
const isOn = (key: string): boolean => onRE.test(key)

interface Attrs {
    [key: string]: unknown
}

const splitAttrs = (attrs: Attrs) => {
    const allAttrs = Object.keys(attrs)
    const eventAttrs: Record<string, unknown> = {}
    const onEvents: Record<string, unknown> = {}
    const extraAttrs: Record<string, unknown> = {}
    for (let i = 0, l = allAttrs.length; i < l; i++) {
        const key = allAttrs[i]
        if (isOn(key)) {
            eventAttrs[key[2].toLowerCase() + key.slice(3)] = attrs[key]
            onEvents[key] = attrs[key]
        } else {
            extraAttrs[key] = attrs[key]
        }
    }
    return { onEvents, events: eventAttrs, extraAttrs }
}

const getEvents = (
    ele: { $?: boolean; $attrs?: Attrs; props?: Attrs } = {},
    on = true
): Record<string, unknown> => {
    let props: Attrs = {}
    if (ele.$) {
        props = { ...props, ...ele.$attrs }
    } else {
        props = { ...props, ...ele.props }
    }
    return splitAttrs(props)[on ? 'onEvents' : 'events']
}

const isEmptyElement = (elem: VNode): boolean => {
    return (
        elem.type === Comment ||
        (elem.type === Fragment && Array.isArray(elem.children) && elem.children.length === 0) ||
        (elem.type === Text && typeof elem.children === 'string' && elem.children.trim() === '')
    )
}

const flattenChildren = (children: unknown): unknown[] => {
    const normalized = Array.isArray(children) ? children : [children]
    const res: unknown[] = []

    normalized.forEach((child) => {
        if (Array.isArray(child)) {
            res.push(...flattenChildren(child))
        } else if (isVNode(child) && child.type === Fragment) {
            res.push(...flattenChildren(child.children))
        } else if (child && isVNode(child) && !isEmptyElement(child)) {
            res.push(child)
        } else if ($tools.isValid(child)) {
            res.push(child)
        }
    })

    return res
}

const getSlot = (
    instance: unknown,
    name = 'default',
    options: Record<string, unknown> = {}
): unknown[] => {
    if (isVNode(instance)) {
        if (instance.type === Fragment) {
            return name === 'default' ? flattenChildren(instance.children) : []
        } else if (
            typeof instance.children === 'object' &&
            instance.children !== null &&
            name in instance.children
        ) {
            const slotFn = (
                instance.children as Record<string, (opts: Record<string, unknown>) => unknown[]>
            )[name]
            if (typeof slotFn === 'function') {
                return flattenChildren(slotFn(options))
            }
        }
        return []
    } else if (
        typeof instance === 'object' &&
        instance !== null &&
        '$slots' in instance &&
        typeof (instance as { $slots: Slots }).$slots[name] === 'function'
    ) {
        const slotFn = (instance as { $slots: Slots }).$slots[name] as (
            opts: Record<string, unknown>
        ) => unknown[]
        return flattenChildren(slotFn(options))
    }
    return []
}

const getSlotContent = (
    instance: unknown,
    prop = 'default',
    options: Record<string, unknown> = {},
    exec = true
): unknown => {
    let content: unknown = undefined

    if (typeof instance === 'object' && instance !== null && '$' in instance) {
        const raw = (instance as Record<string, unknown>)[prop]
        if (raw !== undefined) {
            return typeof raw === 'function' && exec
                ? (raw as (opts: Record<string, unknown>) => unknown)(options)
                : raw
        }
        const slots = (instance as { $slots?: Slots }).$slots
        const slotFn = slots?.[prop]
        content = typeof slotFn === 'function' && exec ? slotFn(options) : slotFn
    } else if (isVNode(instance)) {
        const props = instance.props as Record<string, unknown> | null | undefined
        const raw = props?.[prop]
        if (raw !== undefined) {
            return typeof raw === 'function' && exec
                ? (raw as (opts: Record<string, unknown>) => unknown)(options)
                : raw
        }
        if (instance.type === Fragment) {
            content = instance.children
        } else if (
            typeof instance.children === 'object' &&
            instance.children !== null &&
            prop in instance.children
        ) {
            const slot = (
                instance.children as Record<string, (opts: Record<string, unknown>) => unknown>
            )[prop]
            content = typeof slot === 'function' && exec ? slot(options) : slot
        }
    }

    if (Array.isArray(content)) {
        const flattened = flattenChildren(content)
        if (flattened.length === 0) return undefined
        if (flattened.length === 1) return flattened[0]
        return flattened
    }
    return content
}

const getPropSlot = (slots: Slots, props: Record<string, unknown>, prop = 'default'): unknown => {
    return props[prop] ?? slots[prop]?.()
}

const getPrefixCls = (suffixCls: string, prefixCls?: string, customizeCls?: string): string => {
    if (customizeCls) return customizeCls
    return `${prefixCls ?? 'mi'}-${suffixCls}`
}

const initProps = <
    T extends Record<string, VueTypeValidableDef | VueTypeDef | { type?: PropType<unknown> }>
>(
    types: T,
    defaultProps: Partial<{
        [K in keyof T]: T[K] extends VueTypeValidableDef<infer U>
            ? U
            : T[K] extends VueTypeDef<infer U>
              ? U
              : T[K] extends { type: PropType<infer U> }
                ? U
                : unknown
    }>
): T => {
    const propTypes: Record<string, any> = { ...types }
    Object.keys(defaultProps).forEach((k) => {
        const prop = propTypes[k] as VueTypeValidableDef | undefined
        if (prop) {
            if ('type' in prop || 'default' in prop) {
                prop.default = defaultProps[k]
            } else if ('def' in prop && typeof prop.def === 'function') {
                prop.def(defaultProps)
            } else {
                propTypes[k] = { type: prop as any, default: defaultProps[k] } as any
            }
        } else {
            throw new Error(`${k} prop does not exist.`)
        }
    })
    return propTypes as T
}

export {
    splitAttrs,
    getEvents,
    isEmptyElement,
    flattenChildren,
    getSlot,
    getSlotContent,
    getPropSlot,
    getPrefixCls,
    initProps
}
