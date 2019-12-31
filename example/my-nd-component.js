import Elementum from '../dist/elementum.esm.js';

Elementum.attach("my-nd-component", class extends Elementum {
    data() {
        return {
            text: "Hello from nested!"
        }
    }

    styles() {
        return `
            h2 {
                font-family: sans-serif;
                font-size: 25px;
            }
        `;
    }

    template() {
        return `
            <h2>${ this.data.text }</h1>
        `;
    }

    destroyed() {
        console.log("bye!");
    }
});