import { WidgetLib } from "WidgetLib"

let x = new WidgetLib()

addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("btn-initroot").addEventListener("click", function() {
        x.init("#root", (response) => {
            console.log("Finished loading the widget tree!")
            console.log(response)
            console.log("Active widgets:")
            console.log(x.getActiveWidgets())
        })
    })
    
    document.getElementById("btn-destroyroot").addEventListener("click", function() {
        x.destroy("#root", (response) => {
            console.log("Finished destroying the widget tree!")
            console.log(response)
            console.log("Active widgets:")
            console.log(x.getActiveWidgets())
        })
    })
    
})