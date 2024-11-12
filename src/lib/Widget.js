import { v4 as uuid } from 'uuid'
import { xhrFetch } from 'Util'

/**
 * Base class for widgets.
 * Has to be extended by a subclass with a string `template`.
 * By default, contains no content slot. Any content of the element that was replaced with the widget will be rendered as a sibling.
 */
export class Widget {
    template = undefined

    constructor(target) {
        if (this.constructor == Widget) {
            throw new Error("Can't instantiate a Widget class directly. Extend it with a component class instead.");
        }

        this.element = target
    }

    async init(done = undefined) {
        // Set a UUID for later identification and finer control, without having to keep a redudant list of widgets in memory
        this.id = uuid()
        this.element.setAttribute("widget-id", this.id)

        console.log(this.constructor)
        console.log(this.element.parentNode)
        this.element.outerHTML = `${this.template}${this.element.innerHTML}`

        if (done) done()
    }

    destroy() {
    }
}