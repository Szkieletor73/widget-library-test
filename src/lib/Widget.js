import { v4 as uuid } from 'uuid'
import { xhrFetch } from 'Util'

/**
 * Base class for widgets.
 * Has to be extended by a subclass with a string `template`.
 * By default, contains no content slot. Any content of the element that was replaced with the widget will be rendered as a sibling.
 */
export class Widget {
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
        this.element = target

        this.bindHandlers()
    }

    async init(done = undefined) {
        return new Promise((resolve, reject) => {
            // Set a UUID for later identification and finer control, without having to keep a redudant list of widgets in memory
            this.id = uuid()
            this.element.setAttribute("widget-id", this.id)
    
            // this.element.innerHTML = `${this.element.innerHTML}`
            this.element.insertAdjacentHTML("afterbegin", this.template)

            if (done) done()
            resolve(this.id)
        })
    }

    destroy() {
        try {
            this.element.removeAttribute("widget-id")
            this.state.destroyed = true
        } catch (e) {
            console.error(e)
        }
    }

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

    get isDestroyed() {
        return this.state.destroyed
    }

    /**
     * @param {boolean} state
     */
    set destroyed(state) {
        this.state.destroyed = state
    }

    get isLoading() {
        return this.state.loading
    }
    /**
     * @param {boolean} state
     */
    set loading(state) {
        this.state.loading = state
    }
    
    get isFinished() {
        return this.state.finished
    }
    /**
     * @param {boolean} state
     */
    set finished(state) {
        this.state.finished = state
    }
}