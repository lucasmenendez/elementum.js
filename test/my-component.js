import './my-nd-component.js';

Elementum.attach("my-component", class extends Elementum {
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

            <my-nd-component data-test="${ this.data.counter }"></my-nd-component>
        `;
    }

    increaseCounter() {
        this.data.counter++;
    }

    decreaseCounter() {
        this.data.counter--;
    }

    rendered() {
        // this.watch('counter', console.log);
    }
});