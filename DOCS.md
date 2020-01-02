# elementum.js Documentation

### Table of contents

-   [Installation][1]
-   [How to use][2]
    -   [Import your component][3]
    -   [Define your own component][4]
    -   [Use your component][5]
    -   [Listen for events][6]
-   [Full example][7]

## Installation
```bash
    npm install elementumjs
```

## How to use

### Import elementum.js

#### As ES6 module

```javascript
    import Elementum from 'elementumjs'
```

#### As JavaScript file

```html
    <script src="node_modules/elementumjs/dist/component.umd.js"></script>
```

#### Node module syntax
```javascript
    var Elementum = require('elementumjs');
```

### Define your own component

#### Definition methods

| | Name | Functionality |
|:---:|:----:|:----|
| ![data](assets/data.png) | data | The component observable data initial definition. It will be accessible for further methods of the component. |
| ![template](assets/template.png) | template | HTML template definition for the component. |
| ![style](assets/style.png) | style | Component style definition. |

##### Example
```javascript
    Elementum.attach("my-component", class extends Elementum {
        data() { 
            return {
                your: "data",
                here: true
            }
        }

        template() { 
            return `<h1>Your ${this.your} here</h1>`;
        }

        style() { 
            return `h1 { color: ${ this.here ? "red" : "blue" } }`;
        }
    });
```

#### Components life-cycle
| | Name | Event fired description |
|:---:|:----:|:----|
| ![created](assets/created.png) | created | The component has been instantiated. |
| ![rendered](assets/rendered.png) | rendered | The component has been rendered aftear creation or any data modification. |
| ![destroyed](assets/destroyed.png) | destoyed | The component has been destroyed from the parent. |

##### Example
```javascript
    Elementum.attach("my-component", class extends Elementum {
        created() { /** Your code here */ }
        rendered() { /** Your code here */ }
        destroyed() { /** Your code here */ }
    });
```

### Use your component

#### Main component

Import the component into the HTML and use it there.
```html
    <html>  
        <!-- ... -->
        <body>
            <my-component></my-component>
            <!-- ... -->
            <script type="module" src="./my-component.js"></script>
        </body>
    </html>
```

#### Nested components

Import the component into the parent component definition (or into the HTML file). Use it in the parent template.
```javascript
    import './my-nd-component.js';

    Elementum.attach("my-component", class extends Elementum {
        // ...
        template() {
            return `
                ...
                <my-nd-component></my-nd-component>
            `;
        }
        // ...
    }
```

### Listen for events

#### Data changes

The data defined in the component declaration are observable using `watch` function:
```javascript
    Elementum.attach("my-component", class extends Elementum {
        data() { 
            return {
                my: {
                    nested: {
                        text: "Hello World"
                    }
                }
            }
        }

        template() { 
            return `<h1>${this.data.my.nested.text}</h1>`;
        }

        rendered() { 
            this.watch('my.nested.text', console.log); // prints "my.nested.text", "Bye bye!", "Hello World"

            setTimeout(() => {
                this.data.my.nested.text = "Bye bye!";
            }, 3000 );
        } 
    });
```

#### DOM events

The `EventListener`'s over DOM elements must be defined in `template()` response in the following format:

| Default Prefix | Event Type ([read more](https://en.wikipedia.org/wiki/DOM_events)) | Definded listener |
|:----:|:----:|:----:|
| `on` | `click` | `btnListener` |

Example:
```javascript
    Elementum.attach("my-component", class extends Elementum {
        data() {
            return {
                counter: 0
            }
        }

        template() {
            return `
                <h1>${ this.data.counter }</h1>
                <button type="button" on:click="increaseCounter">Increase!</button>
            `;
        }

        increaseCounter() {
            this.data.counter++;
        }

        decreaseCounter() {
            this.data.counter--;
        }
    });
```

## Full example
- `index.html`

```html
    <my-component></my-component>
    <script type="module" src="my-component.js"></script>
```

- `my-component.js`

```javascript
    import Elementum from 'elementumjs'

    import './my-nd-elementum.js';

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

                <my-nd-component></my-nd-component>
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
```

- `my-nd-elementum.js`

```javascript
    import Elementum from 'elementumjs'

    Elementum.attach("my-nd-component", class extends Elementum {
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
                <h2>${ this.data.text }</h1>
            `;
        }
    });
```

[1]: #installation

[2]: #how-to-use

[3]: #import-componentjs

[4]: #define-your-own-component

[5]: #use-your-component

[6]: #listen-for-events

[7]: #example
