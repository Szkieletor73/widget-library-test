export class WidgetLib {
    constructor(resolver = undefined) {
        this.resolver = resolver
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
                    if (target.attributes.widget && !target.attributes["widget-id"]){
                        this.loadWidget(target)
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

                if (element.attributes.widget && !element.attributes["widget-id"]){
                    this.loadWidget(element)
                }
            }
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
                        resolve(widget.init())
                    }
                )
            } else {
                // Use custom resolver function
                resolve(this.resolver(template))
            }
        })
    }
}