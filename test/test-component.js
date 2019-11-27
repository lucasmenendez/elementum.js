import Component from '../dist/component.esm.js';

Component.create("test-component", class extends Component.Element{
    inject() {
        return {
            counter: 0,
            color: "purple",
            text: "Hey"
        }
    }

    styles() {
        return `
            * {
                margin: 0; 
                padding: 0;
                box-sizing: border-box;
            }

            h1 {
                position: absolute;
                top: 50%; 
                left: 50%;
                transform: translate(-50%, -50%);

                font-size: 100px;
                font-family: sans-serif;
                font-weight: 400;
                color: ${this.data.color};
                text-align: center;
            }
        `;
    }

    template() {
        return `<h1>${this.data.text}</h1>`;
    }

    startAnimation() {
        setInterval(() => {
            this.data.text = this.data.counter % 2 == 0 ? "Ho" : "Hey";
            this.data.color = this.data.counter % 2 == 0 ? "red" : "purple";
            
            this.data.counter++;
        }, 1500);
    }

    rendered() {
        this.startAnimation();
    }
});