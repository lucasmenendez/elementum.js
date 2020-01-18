Elementum.attach("my-nd-component", class extends Elementum {
    attrs() {
        return {
            counter: Object
        }
    }

    template() {
        return `
            <button type="button" on:click="decreaseCounter">Decrease!</button>
        `;
    }

    decreaseCounter() {
        this.attrs.counter.current--;
    }
});