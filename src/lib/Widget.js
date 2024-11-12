import { v4 as uuid } from 'uuid'
import { xhrFetch } from 'Util'

export class Widget {

    constructor(target) {
        this.element = target
    }

    async init(callback = undefined) {
        // Before removing the attribute, save it's value as the template path to render
        let templatePath = this.element.attributes.widget.value

        // Remove the `widget` attribute, we no longer need it since we're going to have the widget itself here
        this.element.removeAttribute("widget")
        
        // Set a UUID for later identification and finer control, without having to keep a redudant list of widgets in memory
        this.id = uuid()
        this.element.setAttribute("widget-id", this.id)
        
        xhrFetch(`src/${templatePath}.html`).then(
            (response) => this.element.innerHTML = `${response}${this.element.innerHTML}`
        )

        if (callback) callback()
    }

    destroy() {
        
    }
}