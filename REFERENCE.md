# elementum.js API Reference

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
        -   [Examples][17]
    -   [attach][18]
        -   [Parameters][19]
        -   [Examples][20]
-   [dataWatcher][21]
    -   [Parameters][22]

## Elementum

**Extends HTMLElement**

Elementum class extends a generic HTMLElement and adds some features like 
data binding or component lifecycle events.

### Properties

-   `data` **[Object][23]** Contains the component data defined by user.

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

Returns **[Object][23]** Observable data initial value.

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

Returns **[string][24]** Observable data initial value.

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

Returns **[string][24]** Observable data initial value.

### watch

Register a change handler to the current component data property by 
parameter provided.

#### Parameters

-   `prop` **[string][24]** Elementum data prop.
-   `handler` **[dataWatcher][25]** Handler function to call when watched data changes

#### Examples

```javascript
class MainComponent extends Elementum {
     data() {
         return {
             text: "world"
         }
     }
     rendered() {
         this.watch("text", console.log); // prints: prop, value, last
     }
 }
```

### attach

Registers in the HTML tag provided a new WebComponent defined by the 
class provided. The class provided must extends the [Elementum][1] class.

#### Parameters

-   `tag` **[string][24]** The HTML tag to register the new component.
-   `definition` **[Elementum][26]** Custom class that extends [Elementum][1] class.

#### Examples

```javascript
class MainComponent extends Elementum { 
     // ...
 }

 Elementum.attach("main-component", MainComponent);
```

## dataWatcher

The callback function to execute when observed data changes.

Type: [Function][27]

### Parameters

-   `prop` **[string][24]** Breadcrumb of target property updated.
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

[17]: #examples-6

[18]: #attach

[19]: #parameters-1

[20]: #examples-7

[21]: #datawatcher

[22]: #parameters-2

[23]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[24]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[25]: #datawatcher

[26]: #elementum

[27]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
