import Widget from "../lib/Widget.js";

export default class B extends Widget {
    template = `
    <style>
        .widget-b {
            padding: 6px 24px;
            margin: 8px;
            background: paleturquoise;
            font-weight: bold;
            display: inline;
        }
    </style>
    <div class="widget-b">This is B!</div>
    `
}