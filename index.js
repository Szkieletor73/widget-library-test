import { WidgetLib } from "WidgetLib"

let x = new WidgetLib()

addEventListener("DOMContentLoaded", (event) => {
    x.init("#root", (response) => {
        console.log("Finished loading the widget tree!")
        console.log(response)
    })
})