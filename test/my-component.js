import './my-nd-component.js';

Elementum.attach("my-component", class extends Elementum {
    data() {
        return {
            counter: {
                current: 0,
                max: 10
            }
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
            <h1>${ this.data.counter.current }</h1>
            <button type="button" on:click="increaseCounter">Increase!</button>
            <my-nd-component id="test" :counter="counter" />
        `;
    }

    increaseCounter() {
        this.data.counter.current++;
    }

    rendered() {
        this.document.querySelector("#test").watchAttr('counter', (prop, val, _) => {
            this.data.counter.current = val.current;
        });
    }
});