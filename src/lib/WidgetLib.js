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
     * @param {function} callback - a callback function to execute when done. Optional.
     * @param {function} resolver - custom resolver function for finding the proper widget class. Optional.
     * @param {object} options - options to pass to widgets.
     */
    async init(target, callback = undefined, options, resolver) {
        resolver = resolver || this.resolver
        options = options || {
            preInit: {},
            postInit: {}
        }
        target = this.parseTarget(target)

        this.#processNode(target, options, resolver).then(
            (resolved) => {
                callback && callback(resolved)
            }
        )
    }

    /**
     * Private helper function for recursing. Handles widget tree initialization logic.
     */
    #processNode(target, options, resolver) {
        return new Promise((resolve, reject) => {
            if (target.attributes.widget && !target.widget) {
                const templatePath = target.attributes?.widget?.value

                resolver(templatePath).then(
                    (imported) => {
                        const widget = new imported.default(target)
                        target.widget = widget
                        widget.preInit(options.preInit)
                        
                        return widget.init()
                    }
                ).then(
                    (initialized) => {
                        target.widget.postInit(options.postInit)

                        if (target.children.length) {
                            const childrenPromises = Array.prototype.slice.call(target.children).map(child => this.#processNode(child, options, resolver))
                            Promise.allSettled(childrenPromises).then(
                                (childrenSettled) => {
                                    resolve([target.widget.id, ...childrenSettled])
                                }
                            )
                        }  else {
                            resolve(target.widget.id)
                        }
                    }
                )
            } else {
                if (target.children.length) {
                    const childrenPromises = Array.prototype.slice.call(target.children).map(child => this.#processNode(child, options, resolver))
                    Promise.allSettled(childrenPromises).then(
                        (childrenSettled) => {
                            resolve(childrenSettled)
                        }
                    )
                } else {
                    resolve()
                }
            }

           
        })
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