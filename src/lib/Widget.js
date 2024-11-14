import { v4 as uuid } from 'uuid'

export class WidgetDestroyed extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
    }
}

/**
 * Base class for widgets.
 * Has to be extended by a subclass with a string `template`.
 * Contains no content slot. Any content of the element that was replaced with the widget will be rendered as a sibling.
 */
export default class Widget {
    template = undefined
    state = {
        destroyed: false,
        loading: false,
        ready: false
    }

    constructor(target) {
        if (this.constructor == Widget) {
            throw new Error("Can't instantiate a Widget class directly. Extend it first.");
        }
        this.target = target

        this.bindHandlers()
    }

    /**
     * Initializes the widget instance by rendering it's template into the DOM,
     * and applying it's pre- and post-init logic.
     * @returns a Promise that resolves into the widget ID string, or rejects into an error.
     */
    async init() {
        return new Promise((resolve, reject) => {
            this.loading = true
            this.ready = false
            this.destroyed = false
            // Set a UUID for later identification and finer control,
            // without having to keep a list of active widgets elsewhere
            this.id = this.id || uuid() // In case init is called again, we don't regenerate the uuid. Shouldn't happen, but it's a micro-optimization that doesn't hurt us in the long run anyway.


            try {
                // We create a <template> from the given HTML string
                const templateEl = document.createElement("template")
                templateEl.innerHTML = this.template
                // We then clone the template into the DOM
                const clone = templateEl.content.cloneNode(true)
                // We apply `widget-id` attribute to every top-level node of the template
                // This will allow us to keep track of what belongs to the widget template,
                // and what is content that existed there before
                for (const child of clone.children) {
                    child.setAttribute("widget-id", this.id)
                }
                // Finally insert the clone into DOM
                this.target.prepend(clone)
            } catch (e) {
                reject(e)
            }

            // Check if this widget was destroyed asynchronously, by another initialization process, before resolving.
            if (this.isDestroyed) {
                reject(WidgetDestroyed("This widget was destroyed during initialization."))
            }
            this.loading = false
            this.ready = true
            resolve(this.id)
        })
    }

    destroy() {
        try {
            const widgetElements = this.target.querySelectorAll(`[widget-id='${this.id}']`)
            
            for (const el of widgetElements) {
                el.remove()
            }
        } catch (e) {
            console.error(e)
            return;
        }
        this.destroyed = true
    }

    // We want to document that these methods exist and are called from elsewhere,
    // but they don't have to be implemented in a widget.
    preInit(options = undefined) {}

    postInit(options = undefined) {}

    /**
     * Bind any properties from inheriting classes ending with "Handler" to `this`
     */
    bindHandlers() {
        Object.getOwnPropertyNames(this).forEach((prop) => {
            if (prop.endsWith("Handler")) {
                this[prop] = this[prop].bind(this)
            }
        })
    }


    /**
     * @param {boolean} state
     */
    set destroyed(state) {
        if (state) {
            this.target.classList.add("widget-destroyed")
        } else {
            this.target.classList.remove("widget-destroyed")
        }
        this.state.destroyed = state
    }
    get isDestroyed() {
        return this.state.destroyed
    }

    /**
     * @param {boolean} state
     */
    set loading(state) {
        if (state) {
            this.target.classList.add("widget-loading")
        } else {
            this.target.classList.remove("widget-loading")
        }
        this.state.loading = state
    }
    get isLoading() {
        return this.state.loading
    }
    
    /**
     * @param {boolean} state
     */
    set ready(state) {
        if (state) {
            this.target.classList.add("widget-ready")
        } else {
            this.target.classList.remove("widget-ready")
        }
        this.state.ready = state
    }
    get isReady() {
        return this.state.ready
    }
}