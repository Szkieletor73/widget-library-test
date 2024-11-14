import Widget from "../lib/Widget.js";

export default class A extends Widget {
    template = `
    <style>
        .widget-a {
            padding: 6px 24px;
            margin: 8px;
            background: darkgreen;
            color: white;
            font-weight: bold;
            display: inline;

            animation-name: fade-in;
            animation-iteration-count: 1;
            animation-duration: 0.3s;
        }

        @keyframes fade-in {
            from { opacity: 0 }
            to { opacity: 1 }
        }
    </style>
    <div class="widget-a">This is A!</div>
    `

    preInit(options) {
        console.log(`Called "preInit" with the options ${options}`)
    }
    postInit(options) {
        console.log(`Called "postInit" with the options ${options}`)
    }
}