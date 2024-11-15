export default class WidgetLib {
    constructor() {
    }

    /**
     * Dynamically imports the widget
     * @param {string} templatePath 
     * @returns Promise resolving into the imported file.
     */
    resolver(templatePath) {
        return import(`../${templatePath}.js`)
    }

    /**
     * Simple helper function to parse element IDs.
     * Takes a string, representing the ID of a node, or an HTMLElement, and always returns HTMLElement
     */
    parseTarget(element) {
        if (typeof(element) == 'string') {
            return document.getElementById(element.replace("#",""))
        } else {
            return element
        }
    }

    /**
     * Initializes rendering of widgets, using the `target` as the root parent, and recursively iterating through it's children.
     * @param {HTMLElement | string} target - HTMLElement of the root parent, or string representing it's ID
     * @param {function} callback - a callback function to execute when done
     */
    async init(target, callback = undefined, resolver) {
        const pending = []
        resolver = resolver || this.resolver
        target = this.parseTarget(target)

        // Widgets in this implementation do not contain any props that can be affected by parent or child components.
        // This means that initializing in a specific order is not necessary.
        const widgetList = target.querySelectorAll("[widget]")

        for (const el of target.attributes.widget ? [target, ...widgetList] : widgetList) {
            if (!el.widget) {
                const templatePath = el.attributes.widget.value
                const resolverPromise = resolver(templatePath)
                pending.push(resolverPromise)

                resolverPromise.then(
                    (imported) => {
                        const widget = new imported.default(el)
                        el.widget = widget
                        widget.preInit()

                        const initPromise = widget.init()
                        pending.push(initPromise)

                        initPromise.then(
                            (success) => [
                                widget.postInit()
                            ]
                        )
                    }
                )
            }
        }

        // Wait for every promise to resolve or reject, then callback
        Promise.allSettled(pending).then(
            (results) => {
                callback && callback(results)
            }
        )
    }

    /**
     * Destroys all widgets descending from the given parent node.
     * @param {HTMLElement | string} target - HTMLElement of the root parent, or string representing it's ID
     */
    destroy(target, callback = undefined) {
        const deletedList = []
        target = this.parseTarget(target)

        const widgetList = target.querySelectorAll("[widget]")

        for (const el of target.attributes.widget ? [target, ...widgetList] : widgetList) {
            const widget = el.widget
            if (widget && !widget.isDestroyed && widget.isReady) {
                try {
                    widget.destroy()
                    if (widget.isDestroyed) {
                        deletedList.push(widget.id)
                        // Ensures the widget is properly destroyed before removing it's instance from the HTMLElement
                        delete el.widget
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        }
        callback && callback(deletedList)
    }
}