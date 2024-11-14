import Widget from "Widget";

export default class C extends Widget {
    template = `
    <style>
        .widget-c {
            padding: 6px 24px;
            margin: 8px;
            background: darksalmon;
            color: #222;
            font-weight: bold;
            display: inline;
        }
    </style>
    <div class="widget-c">This is C!</div>
    `
}