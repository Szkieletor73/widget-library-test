import Widget from "Widget";

export default class A extends Widget {
    template = `<div>This is A!</div>`

    preInit(options) {
        console.log(`Called "preInit" with the options ${options}`)
    }
    postInit(options) {
        console.log(`Called "postInit" with the options ${options}`)
    }
}