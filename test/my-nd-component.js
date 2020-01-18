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
            <h2>${ this.data.text }</h2>
            <button type="button" on:click="decreaseCounter">Decrease!</button>
        `;
    }

    rendered() { console.log("rendered"); }
    created() { console.log("created"); }
    destroyed() { console.log("destroyed"); }

    decreaseCounter() {
        this.attrs.counter--;
    }
});