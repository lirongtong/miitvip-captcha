declare module '*.png'
declare module '*.svg'
declare module '*.tiff'
declare module '*.webp'
declare module '*.bmp'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.mp4'

declare module '*.module.less' {
    const classes: { [key: string]: string }
    export default classes
}
