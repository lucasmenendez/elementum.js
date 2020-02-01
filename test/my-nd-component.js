import { Elementum, html } from '../dist/elementum.esm.js'

class Child extends Elementum {
    static get attrs() {
        return {
            counter: Number
        }
    }

    template() {
        return html`
            <button type="button" on:click="decreaseCounter">Decrease!</button>
        `;
    }

    rendered() {
        this.watchAttr('counter', console.log);
    }

    decreaseCounter() {
        this.attrs.counter--;
    }
}

Elementum.attach("my-nd-component", Child);