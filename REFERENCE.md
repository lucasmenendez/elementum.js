## API Reference

### Table of Contents

-   [Elementum][1]
    -   [Properties][2]
    -   [document][3]
    -   [host][4]
    -   [children][5]
    -   [\_parseAttrTag][6]
        -   [Parameters][7]
    -   [created][8]
        -   [Examples][9]
    -   [rendered][10]
        -   [Examples][11]
    -   [destroyed][12]
        -   [Examples][13]
    -   [data][14]
        -   [Examples][15]
    -   [template][16]
        -   [Examples][17]
    -   [style][18]
        -   [Examples][19]
    -   [watch][20]
        -   [Parameters][21]
    -   [watchData][22]
        -   [Parameters][23]
        -   [Examples][24]
    -   [watchAttr][25]
        -   [Parameters][26]
        -   [Examples][27]
    -   [attach][28]
        -   [Parameters][29]
        -   [Examples][30]
-   [watcher][31]
    -   [Parameters][32]

## Elementum

**Extends HTMLElement**

Elementum class extends a generic HTMLElement and adds some features like 
data binding or component lifecycle events.

### Properties

-   `data` **[Object][33]** Contains the component data defined by user.

### document

Current element document.

Type: HTMLDocument

### host

Host element node.

Type: [HTMLElement][34]

### children

Current element Elementum children.

Type: [Array][35]&lt;[Elementum][36]>

### \_parseAttrTag

The function checks if attribute provided contains a reference to parent 
data to get from it the value. If that is not the case, return raw value.
If attribute provided does not exist, raise an error.
Then casts the value to its defined type. If the type provided is not 
supported, raise an error.

#### Parameters

-   `name` **any** Attribute name
-   `type` **any** Defined attribute type

### created

Elementum live-cycle method called when the component is initialized. 
Must be overwritten.

#### Examples

```javascript
class MainComponent extends Elementum {
     created() { 
         // Your code here
     }
 });
```

### rendered

Elementum live-cycle method called when the component is rendered into 
the parent component or re-rendered after data change. Must be 
overwritten.

#### Examples

```javascript
class MainComponent extends Elementum {
     rendered() { 
         // Your code here
     }
 });
```

### destroyed

Elementum live-cycle method called when the component is deleted from the 
parent component. Must be overwritten.

#### Examples

```javascript
class MainComponent extends Elementum {
     destroyed() { 
         // Your code here
     }
 });
```

### data

Returns values for the observable component data. Used to defines initial 
value of data component. Must be overwritten.

#### Examples

```javascript
class MainComponent extends Elementum {
     data() { 
         return {
             text: "world"
         }
     }
 });
```

Returns **[Object][33]** Observable data initial value.

### template

Returns the definition of component template. Used to define the 
component HTML template. Reactive to changes in the component data.
Must be overwritten.

#### Examples

```javascript
class MainComponent extends Elementum {
     template() { 
         return `<h1>Hello ${ this.data.text }!</h1>`;
     }
 });
```

Returns **[string][37]** Observable data initial value.

### style

Returns the definition of component style. Used to define the 
component CSS style. Reactive to changes in the component data.

#### Examples

```javascript
class MainComponent extends Elementum {
     style() { 
         return `h1 { color: red; }`;
     }
 });
```

Returns **[string][37]** Observable data initial value.

### watch

-   **See: [watchData][38]**

Register a change handler to the current component data property by 
parameter provided.

#### Parameters

-   `prop` **[string][37]** Elementum data prop.
-   `handler` **[watcher][39]** Handler function to call when watched data changes

**Meta**

-   **deprecated**: since version 0.2.0


### watchData

Register a change handler to the current component data property by 
parameter provided.

#### Parameters

-   `prop` **[string][37]** Elementum data prop.
-   `handler` **[watcher][39]** Handler function to call when watched data changes

#### Examples

```javascript
class MainComponent extends Elementum {
     data() {
         return {
             text: "world"
         }
     }
     rendered() {
         this.watchData("text", console.log); // prints: prop, value, last
     }
 }
```

### watchAttr

Register a change handler to the current component attribute by 
parameter provided.

#### Parameters

-   `attr` **[string][37]** Elementum attribute name.
-   `handler` **[watcher][39]** Handler function to call when watched data changes

#### Examples

```javascript
class ParentComponent extends Elementum {
     data() {
         return { 
             counter: 100
         } 
     }

     template() {
         return `<my-counter id="child-counter" :value="counter"/>`
     }
     rendered() {
         this.document.querySelector("#child-counter")
             .watchAttr("value", console.log); // prints: prop, value, last
     }
 }

 class CounterComponent extends Elementum {
     template() {
         return `
             <button on:click="increaseCounter">${ this.attrs.value }</button>
         `
     }
     
     increaseCounter() {
         this.attrs.value++;
     }
 }
```

### attach

Registers in the HTML tag provided a new WebComponent defined by the 
class provided. The class provided must extends the [Elementum][1] class.

#### Parameters

-   `tag` **[string][37]** The HTML tag to register the new component.
-   `definition` **[Elementum][36]** Custom class that extends [Elementum][1] class.

#### Examples

```javascript
class MainComponent extends Elementum { 
     // ...
 }

 Elementum.attach("main-component", MainComponent);
```

## watcher

The callback function to execute when observed data changes.

Type: [Function][40]

### Parameters

-   `prop` **[string][37]** Breadcrumb of target property updated.
-   `value` **any** The new value of the property updated.
-   `last` **any** The old value of the property updated.

[1]: #elementum

[2]: #properties

[3]: #document

[4]: #host

[5]: #children

[6]: #_parseattrtag

[7]: #parameters

[8]: #created

[9]: #examples

[10]: #rendered

[11]: #examples-1

[12]: #destroyed

[13]: #examples-2

[14]: #data

[15]: #examples-3

[16]: #template

[17]: #examples-4

[18]: #style

[19]: #examples-5

[20]: #watch

[21]: #parameters-1

[22]: #watchdata

[23]: #parameters-2

[24]: #examples-6

[25]: #watchattr

[26]: #parameters-3

[27]: #examples-7

[28]: #attach

[29]: #parameters-4

[30]: #examples-8

[31]: #watcher

[32]: #parameters-5

[33]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[34]: https://developer.mozilla.org/docs/Web/HTML/Element

[35]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[36]: #elementum

[37]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[38]: watchData

[39]: #watcher

[40]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
