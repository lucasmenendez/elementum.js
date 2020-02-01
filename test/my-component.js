import { Elementum, html, data } from '../dist/elementum.esm.js'

import './my-nd-component.js';

Elementum.attach("my-component", class extends Elementum {
    data() {
        return {
            subtitle: "This is my own counter",
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
        return html`
            <!-- Aqui no pasa nada porque no tiene el formato bueno, the good format -->
            <div>
                <div>
                    <div>
                        ${ data`subtitle` }
                        <span>separator</span>
                        ${ [0,1,2,3,4].map(() => `<li>${ this.data.counter.current }</li>`).join('') }
                    </div>
                </div>
            </div>
            <header id="my-header" class="${ data`counter.current` }" clas2s="${ this.data.counter.current + 1 }">
                <h1>${ data`counter.current` }</h1>
                <div id="parent" class="node">
                    <div id="child">
                        <p class="paragraph1">${ data`subtitle` }</p>
                        <p class="paragraph2">${ data`subtitle` }</p>
                    </div>        
                </div>

                <div id="parent3" class="node">
                    <div id="child">
                        <p class="paragraph1">${ data`subtitle` }</p>
                        <p class="paragraph2">${ data`subtitle` }</p>
                    </div>        
                </div>

                <div id="parent2" class="node"></div>
                ${ data`subtitle` }
            </header>
            <button type="button" on:click="increaseCounter">Increase!</button>
            <my-nd-component id="test" counter="${ data`counter.current` }" />
        `;
    }

    increaseCounter() {
        this.data.counter.current++;
    }

    rendered() {
        this.document.querySelector("#test").watchAttr('counter', (attr, value) => {
            this.data.counter.current = value;
        });
    }
});