import { Widget } from "Widget"

export class WidgetLib {
    constructor() {
    }

    /**
     * Initializes rendering of widgets, using the `target` as the root parent, and recursively iterating through it's children.
     * @param {HTMLElement} target - element to initiate the rendering from
     * @param {function} callback - a callback function to execute when done
     */
    async init(target, callback = undefined) {
        return new Promise((resolve, reject) => {
            this.parseChildren(target).then(
                () => {
                    if (target.attributes.widget){
                        const widget = new Widget(element)
                        widget.init()
                    }
                }
            )

        })
    }

    destroy(target) {}

    async parseChildren(target) {
        return new Promise((resolve, reject) => {
            for (const element of target.children) {
                if (element.children.length) {
                    this.parseChildren(element).then(
                        (response) => {
                            console.log(response)
                        }
                    )
                }

                if (element.attributes.widget){
                    const widget = new Widget(element)
                    widget.init()
                    resolve("yay")
                } else {
                    resolve("nope")
                }
            }
        })
    }
}