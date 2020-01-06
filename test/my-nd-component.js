Elementum.attach("my-nd-component", class extends Elementum {
    static get observedAttributes() {
        return ["data-test"];
    }

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

    created() {

    }

    template() {
        return `
            <h2>${ this.data.text }</h1>
        `;
    }

    rendered() {
        this.watchAttr('data-test', console.log);
    }
});