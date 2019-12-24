import Component from '../dist/component.esm.js';

Component.attach("test-component", class extends Component {
    data() {
        return {
            counter: 0,
            color: "purple",
            text: "Hey",
            sub: {
                counter: 0
            }
        }
    }

    styles() {
        return `
            h1 {
                font-size: 100px;
                font-family: sans-serif;
                font-weight: 400;
                color: ${this.data.color};
                text-align: center;
            }
        `;
    }

    template() {
        return `
            <h1>${ this.data.text }</h1>
            <button type="button" on:click="stopAnimation">Stop Me!</button>
            <button type="button" on:click="info">Get my data!</button>
        `;
    }

    startAnimation() {
        this.interval = setInterval(() => {
            this.data.text = this.data.sub.counter % 2 == 0 ? "Ho" : "Hey";
            this.data.color = this.data.sub.counter % 2 == 0 ? "green" : "purple";
            
            this.data.sub.counter++;
        }, 1500);
    }

    info() {
        console.log(this.data);
    }

    stopAnimation() {
        clearInterval(this.interval);
    }

    rendered() {
        this.startAnimation();
        this.watch('sub.counter', (target, value, last) => {
            console.log(target, value, last)
        })
    }
});