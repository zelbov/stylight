

export const observeRenderOnce = (target: Node, options: MutationObserverInit = { childList: true })
: Promise<MutationRecord[]> => {

    return new Promise((resolve) => {

        const observer = new MutationObserver((records) => {

            observer.disconnect()
            resolve(records)
    
        })
    
        observer.observe(target, options)

    })

}

export const observeRendersDuring = (ms: number, target: Node)
: Promise<MutationRecord[]> => {

    return new Promise((resolve) => {

        const records: MutationRecord[] = [];

        const observer = new MutationObserver((updates) => {

            records.push(...updates)

        })

        setTimeout(() => {

            observer.disconnect()
            resolve(records)

        }, ms)

        observer.observe(target)
        
    })

}