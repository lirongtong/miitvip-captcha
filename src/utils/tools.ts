class MiTools {
    /**
     * Whether it is a mobile phone.
     * @returns {boolean}
     */
    isMobile(): boolean {
        const agent = navigator.userAgent,
            agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
        let mobile = false
        for (let i = 0, len = agents.length; i < len; i++) {
            if (agent.indexOf(agents[i]) > 0) {
                mobile = true
                break
            }
        }
        return mobile
    }
    
    /**
     * Whether it is a number.
     * @param number
     */
    isNumber(number: any): boolean {
        return typeof number === 'number' && isFinite(number)
    }

    /**
     * Unit conversion.
     * @param value 
     */
    pxToRem(value: number) {
        return Math.round(value / 16 * 100) / 100
    }

    /**
     * Generate a random number within the specified range.
     * @param start
     * @param end
     * @returns {number}
     */
    randomNumberInRange(start: number, end: number): number {
        return Math.round(Math.random() * (end - start) + start)
    }

    /**
     * Event binding.
     * @param element
     * @param event
     * @param listener
     * @param useCapture
     */
    on(
        element: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (
            this: HTMLDivElement,
            evt: HTMLElementEventMap[keyof HTMLElementEventMap]
        ) => any,
        useCapture = false
    ) {
        if (!!document.addEventListener) {
            if (element && event && listener) element.addEventListener(event, listener, useCapture)
        } else {
            if (element && event && listener) (element as any).attachEvent(`on${event}`, listener)
        }
    }

    /**
     * Event unbind.
     * @param element
     * @param event
     * @param listener
     * @param useCapture
     */
    off(
        element: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (
            this: HTMLDivElement,
            evt: HTMLElementEventMap[keyof HTMLElementEventMap]
        ) => any,
        useCapture = false
    ) {
        if (!!document.addEventListener) {
            if (element && event && listener)
                element.removeEventListener(event, listener, useCapture)
        } else {
            if (element && event && listener) (element as any).detachEvent(`on${event}`, listener)
        }
    }
}

export default new MiTools()