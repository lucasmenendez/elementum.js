import './my-nd-component.js';

Elementum.attach("my-component", class extends Elementum {
    data() {
        return {
            counter: 0,
            childData: {
                counter: 0
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
            <h1>${ this.data.childData.counter }</h1>
            <button type="button" on:click="increaseCounter">Increase!</button>
            <my-nd-component id="test" :counter="childData.counter"></my-nd-component>
        `;
    }

    increaseCounter() {
        this.data.childData.counter++;
    }


    rendered() {
        this.document.querySelector("#test").watchAttr('counter', (prop, val, _) => {
            this.data.childData.counter = val;
        });
    }
});