import { type CSSProperties } from 'vue'
import type { AxiosRequestConfig } from 'axios'
import { createTypes, type VueTypesInterface, type VueTypeValidableDef } from 'vue-types'

export const tuple = <T extends string[]>(...args: T) => args

export const PropTypes = createTypes() as VueTypesInterface & {
    readonly style: VueTypeValidableDef<CSSProperties>
}

/**
 * +===============================+
 * |      不同设备下的尺寸配置       |
 * +===============================+
 * @param laptop 笔记本 ( > breakpoints.lg )
 * @param mobile 移动端 ( < breakpoints.md )
 * @param tablet 平板 ( < breakpoints.lg )
 *
 * e.g.
 * ```
 * const size = {
 *     laptop: 48,
 *     mobile: 32,
 *     tablet: 36
 * }
 * ```
 *
 * @see Breakpoints
 */
export interface DeviceSize {
    laptop?: string | number
    mobile?: string | number
    tablet?: string | number
}

/**
 * +==================+
 * |      位置        |
 * +==================+
 * @param left 左边距 ( 数字或百分比 )
 * @param right 右边距
 * @param top 上边距
 * @param bottom 下边距
 */
export interface Position {
    left?: string | number | DeviceSize
    right?: string | number | DeviceSize
    top?: string | number | DeviceSize
    bottom?: string | number | DeviceSize
}

/**
 * +================================================+
 * |      请求配置 ( 继承 AxiosRequestConfig )       |
 * +================================================+
 * @param retry: 第 N 次重试请求
 * @param retryDelay: 重试请求的延迟时间 ( 单位: ms )
 * @param retryCount: 最大重试请求的次数 ( retry > retryCount 时, 停止 )
 */
export type RequestConfig = AxiosRequestConfig & {
    retry?: number
    retryDelay?: number
    retryCount?: 0
}

/**
 * @param code 结果码
 * @param message 结果信息
 */
export interface ResponseRet {
    code: string | number
    message: string
}

/**
 * +=============================+
 * |      接口响应默认结构        |
 * +=============================+
 * @param ret 结果信息与结果码
 * @param data 数据
 *
 * @see ResponseRet
 */
export interface ResponseData {
    ret: ResponseRet
    data: any
    total?: number
}

/**
 * +=============================+
 * |      Key-Value 键值对        |
 * +=============================+
 * @param key 键
 * @param value 值
 */
export interface KeyValue {
    key: string | number
    value: any
}

export type CanvasOperation = keyof Pick<CanvasRenderingContext2D, 'fill' | 'stroke' | 'clip'>

export const __METHODS__ = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'options',
    'head',
    'link',
    'unlink',
    'purge'
]
