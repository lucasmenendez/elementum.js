## API Reference

### Table of Contents

-   [Elementum][1]
    -   [Properties][2]
    -   [created][3]
        -   [Examples][4]
    -   [rendered][5]
        -   [Examples][6]
    -   [destroyed][7]
        -   [Examples][8]
    -   [data][9]
        -   [Examples][10]
    -   [template][11]
        -   [Examples][12]
    -   [style][13]
        -   [Examples][14]
    -   [watch][15]
        -   [Parameters][16]
    -   [watchData][17]
        -   [Parameters][18]
        -   [Examples][19]
    -   [watchAttr][20]
        -   [Parameters][21]
        -   [Examples][22]
    -   [attach][23]
        -   [Parameters][24]
        -   [Examples][25]
-   [watcher][26]
    -   [Parameters][27]

## Elementum

**Extends HTMLElement**

Elementum class extends a generic HTMLElement and adds some features like 
data binding or component lifecycle events.

### Properties

-   `data` **[Object][28]** Contains the component data defined by user.

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

Returns **[Object][28]** Observable data initial value.

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

Returns **[string][29]** Observable data initial value.

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

Returns **[string][29]** Observable data initial value.

### watch

-   **See: [watchData][30]**

Register a change handler to the current component data property by 
parameter provided.

#### Parameters

-   `prop` **[string][29]** Elementum data prop.
-   `handler` **[watcher][31]** Handler function to call when watched data changes

**Meta**

-   **deprecated**: since version 0.2.0


### watchData

Register a change handler to the current component data property by 
parameter provided.

#### Parameters

-   `prop` **[string][29]** Elementum data prop.
-   `handler` **[watcher][31]** Handler function to call when watched data changes

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

-   `attr` **[string][29]** Elementum attribute name.
-   `handler` **[watcher][31]** Handler function to call when watched data changes

#### Examples

```javascript
class ChildComponent extends Elementum {
     static get observedAttributes() {
         return [ "data-test" ];
     }

     template() {
         return `<h1>${ this.attrs['data-test'] }</h1>`
     }
     rendered() {
         this.watchAttr("data-test", console.log); // prints: prop, value, last
     }
 }
```

### attach

Registers in the HTML tag provided a new WebComponent defined by the 
class provided. The class provided must extends the [Elementum][1] class.

#### Parameters

-   `tag` **[string][29]** The HTML tag to register the new component.
-   `definition` **[Elementum][32]** Custom class that extends [Elementum][1] class.

#### Examples

```javascript
class MainComponent extends Elementum { 
     // ...
 }

 Elementum.attach("main-component", MainComponent);
```

## watcher

The callback function to execute when observed data changes.

Type: [Function][33]

### Parameters

-   `prop` **[string][29]** Breadcrumb of target property updated.
-   `value` **any** The new value of the property updated.
-   `last` **any** The old value of the property updated.

[1]: #elementum

[2]: #properties

[3]: #created

[4]: #examples

[5]: #rendered

[6]: #examples-1

[7]: #destroyed

[8]: #examples-2

[9]: #data

[10]: #examples-3

[11]: #template

[12]: #examples-4

[13]: #style

[14]: #examples-5

[15]: #watch

[16]: #parameters

[17]: #watchdata

[18]: #parameters-1

[19]: #examples-6

[20]: #watchattr

[21]: #parameters-2

[22]: #examples-7

[23]: #attach

[24]: #parameters-3

[25]: #examples-8

[26]: #watcher

[27]: #parameters-4

[28]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[29]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[30]: watchData

[31]: #watcher

[32]: #elementum

[33]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
