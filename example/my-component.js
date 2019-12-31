import Component from '../dist/component.esm.js';

import './my-nd-component.js';

Component.attach("my-component", class extends Component {
    data() {
        return {
            counter: 0
        }
    }

    styles() {
        return `
            h1 {
                font-family: sans-serif;
                font-size: 50px;
            }
        `;
    }

    template() {
        return `
            <h1>${ this.data.counter }</h1>
            <button type="button" on:click="increaseCounter">Increase!</button>
            <button type="button" on:click="decreaseCounter">Decrease!</button>

            ${ this.data.counter % 2 == 0 ? "<my-nd-component></my-nd-component>" : ""}
        `;
    }

    increaseCounter() {
        this.data.counter++;
    }

    decreaseCounter() {
        this.data.counter--;
    }

    rendered() {
        this.watch('counter', console.log);
    }
});