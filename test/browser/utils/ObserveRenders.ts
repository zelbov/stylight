

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

export const observeRendersDuring = (ms: number, target: Node, options: MutationObserverInit = { childList: true })
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

        observer.observe(target, options)
        
    })

}

const OBSERVE_UNTIL_TIMEOUT = 5_000;

export const observeRendersUntil = (target: Node, callback: (node: Node) => boolean, options: MutationObserverInit = { childList: true }) => {

    return new Promise<MutationRecord[]>((resolve, reject) => {

        let records: MutationRecord[] = [], resolved = false

        const match = () => {

            observer.disconnect()
            resolved = true
            setTimeout(() => resolve(records), 1)

        }

        const observer = new MutationObserver((updates) => {

            records.push(...updates)
            updates.map(u => {

                u.addedNodes.forEach(n => {
                    callback(n) ? match() : null
                })
                u.removedNodes.forEach(n => {
                    callback(n) ? match() : null
                })

            })

        })

        observer.observe(target, options)

        setTimeout(() =>
            !resolved ? reject(new Error('Timeout of '+OBSERVE_UNTIL_TIMEOUT+' reached while waiting until target node updates'))
            : null,
            OBSERVE_UNTIL_TIMEOUT
        )
        
    })

}