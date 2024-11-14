import X from "WidgetLib"

let x = new X()

addEventListener("DOMContentLoaded", (event) => {
    const initBtns = document.getElementsByClassName("btn-init")
    for (const btn of initBtns) {
        btn.addEventListener("click", function() {
            x.init(btn.parentNode.parentNode, (response) => {
                console.log("Finished loading the widget tree!")
                console.log(response)
            })
        })
    }
    
    
    const destroyBtns = document.getElementsByClassName("btn-destroy")
    for (const btn of destroyBtns) {
        btn.addEventListener("click", function() {
            x.destroy(btn.parentNode.parentNode, (response) => {
                console.log("Finished destroying the widget tree!")
                console.log(response)
            })
        })
    }
    
})