export class WidgetLib {
    constructor(resolver = undefined) {
        this.resolver = resolver
    }

    /**
     * Initializes rendering of widgets, using the `target` as the root parent, and recursively iterating through it's children.
     * @param {HTMLElement | string} target - HTMLElement of the root parent, or string representing it's ID
     * @param {function} callback - a callback function to execute when done
     */
    async init(target, callback = undefined) {
        if (typeof target === "string") {
            target = document.getElementById(target.replace("#", ""))
        }
        
        this.parseNode(target).then(
            (resolved) => {
                if (callback) callback(resolved)
            },
            (rejected) => {
                if (callback) callback(rejected)
            }
        )
    }

    destroy(target) {}

    async parseNode(target) {
        return new Promise((resolve, reject) => {
            let pending = []
    
            for (const child of target.children) {
                pending.push(this.parseNode(child))
            }
    
            Promise.allSettled(pending).then(
                (resolved) => {
                    console.log(resolved)
                    if (target.attributes.widget) {
                        this.loadWidget(target).then(
                            (resolved) => resolve(resolved),
                            (rejected) => reject(rejected)
                        )
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    async loadWidget(target) {
        return new Promise((resolve, reject) => {
            const template = target.attributes.widget.value

            if (this.resolver === undefined) {
                // Default to dynamic import
                import(template).then(
                    (imported) => {
                        const widget = new imported.default(target)
                        widget.init().then()
                    },
                    (error) => reject(error)
                )
            } else {
                if (this.resolver instanceof Function) {
                    // Use custom resolver function
                    resolve(this.resolver(template))
                } else {
                    reject(new Error("Resolver is not callable."))
                }
            }
        })
    }
}