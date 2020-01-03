import Data from './data';

/**
 * @constant {string} _eventPrefix - Text prefix to identify DOM events over 
 * child elements.
 * @ignore
 */
const _eventPrefix = 'on:';

/** 
 * Elementum class extends a generic HTMLElement and adds some features like 
 * data binding or component lifecycle events. 
 * @class Elementum
 * @extends HTMLElement
 * @property {Object} data - Contains the component data defined by user.
 */
class Elementum extends HTMLElement {
  
    /**
     * When a Elementum is initialized, the data binding process starts. 
     * The DOM render process will begin when the data binding ends.
     */
    constructor() {
        super();

        this._watched = {}
        this._initData();
    }

    /**
     * Creates Elementum observable data, that allows to listen changes over all 
     * data properties. When data content changes, {@link Elementum#_dataHandler} 
     * is called.
     * @ignore
     */
    _initData() {
        let data = this.data();
        if (data) this.data = new Data(data, change => this._dataHandler(change));
    }

    /**
     * Receives the component data changes and propagates them to the assigned 
     * watcher if it exists.
     * @param {object} change - Change registered over component data
     * @param {string[]} change.props - List of attributes tree to top
     * @param {*} change.value - New value
     * @param {*} change.last - Old value
     * @ignore
     */
    _dataHandler(change) {
        this._render();

        let prop = change.props.join('.');
        if (Object.keys(this._watched).includes(prop)) {
            let f = this._watched[prop];
            f.call(this, prop, change.value, change.last);
        }
    }

    /**
     * Render function creates the shadowRoot, if not exists, set a empty body 
     * and attaches the template and styles provided by Elementum definition.
     * @ignore
     */
    _render() {
        this._initShadowRoot();
        this._renderBody();
        this._renderStyles();
        this._setEvents();
    }

    /**
     * Creates, if not exists, and clears current `shadowRoot`.
     * @ignore
     */
    _initShadowRoot() {
        if (!this.shadowRoot) this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = "";
    }

    /**
     * Get computed styles from the component definition if it exists, and 
     * append it to the current shadowRoot.
     * @ignore
     */
    _renderStyles() {
        let styles = this._callMethod('styles');
        if (styles) {
            let style = document.createElement('style');
            style.innerHTML = styles;
            
            this.shadowRoot.appendChild(style);
        }
    }

    /**
     * Get computed body from the component definition if it exists, and append 
     * it to the current shadowRoot.
     * @ignore
     */
    _renderBody() {
        let template = this._callMethod('template');
        if (template) {
            this.shadowRoot.innerHTML = template;
        }
    }

    /**
     * Iterate over all child elements in the current shadowRoot and set 
     * listeners to each one, if it has any listener assigned.
     * @ignore
     */
    _setEvents() {
        this._elemChilds().forEach(child => {
            this._eventsOf(child).forEach(it => {
                child.addEventListener(it.event, e => {
                    this._callMethod(it.callback, e);
                });
            });
        });
    }

    /**
     * Returns all child nodes of element provided into a plain array.
     * @param {HTMLElement} [parent=this.shadowRoot] - Parent node to look for childs.
     * @returns {HTMLElement[]} - Plain array with child elements
     * @ignore
     */
    _elemChilds(parent = this.shadowRoot) {
        let childs = [parent];
        if (!parent.childNodes || parent.childNodes.length === 0) return childs;

        Array.from(parent.childNodes).forEach(child => {
            childs = [...childs, ...this._elemChilds(child)];
        });

        return childs;
    }

    /**
     * Extracts all DOM events custom defined for the node provided. The 
     * listeners must start with prefix provided.
     * @param {HTMLElement} node - Element to look for events.
     * @param {string} [prefix=_eventPrefix] - Prefix that defines listeners.
     * @returns {Object[]} - List of event and callback pairs.
     * @ignore
     */
    _eventsOf(node, prefix = _eventPrefix) {
        if (!node.attributes || node.attributes.length === 0) return [];

        return Array.from(node.attributes)
            .filter(attr => attr.name.startsWith(prefix))
            .map(attr => {
                return {
                    event: attr.name.replace(prefix, ''),
                    callback: attr.value
                }
            });
    }

    /**
     * Calls to a method of the current instance safely.
     * @param {string} name - The name of method to call
     * @param {Object[]} args - Arguments to call the method requested
     * @returns {*} - Result of method call
     * @ignore
     */
    _callMethod(name, ...args) {
        if (typeof this[name] !== 'function') return null;
        return this[name].call(this, args);
    }
    
    /**
     * Callback function for connected event. It runs {@link Elementum#created} 
     * method, render function and runs {@link Elementum#rendered} method, 
     * attaching host element.
     * @ignore
     */
    connectedCallback() {
        this.created(); 
        this._render();
        this.rendered(); 
    }
    
    /**
     * Callback function for disconnected event. It runs 
     * {@link Elementum#destroyed} method.
     * @ignore
     */
    disconnectedCallback() {
        this.destroyed();
    }

    /**
     * @todo Standar API to watch attributes changes like data.
     * @ignore
     */
    attributeChangedCallback(attr, old, current) {
        console.log(attr, old, current);
    }

    /**
     * Elementum live-cycle method called when the component is initialized. 
     * Must be overwritten.
     * @override
     * @example
     *  class MainComponent extends Elementum {
     *      created() { 
     *          // Your code here
     *      }
     *  });
     */
    created() {}

    /**
     * Elementum live-cycle method called when the component is rendered into 
     * the parent component or re-rendered after data change. Must be 
     * overwritten.
     * @override
     * @example
     *  class MainComponent extends Elementum {
     *      rendered() { 
     *          // Your code here
     *      }
     *  });
     */
    rendered() {}

    /**
     * Elementum live-cycle method called when the component is deleted from the 
     * parent component. Must be overwritten.
     * @override
     * @example
     *  class MainComponent extends Elementum {
     *      destroyed() { 
     *          // Your code here
     *      }
     *  });
     */
    destroyed() {}

    /**
     * Returns values for the observable component data. Used to defines initial 
     * value of data component. Must be overwritten.
     * @override
     * @returns {Object} Observable data initial value.
     * @example
     *  class MainComponent extends Elementum {
     *      data() { 
     *          return {
     *              text: "world"
     *          }
     *      }
     *  });
     */
    data() { return {} }

    /**
     * Returns the definition of component template. Used to define the 
     * component HTML template. Reactive to changes in the component data.
     * Must be overwritten.
     * @override
     * @returns {string} Observable data initial value.
     * @example
     *  class MainComponent extends Elementum {
     *      template() { 
     *          return `<h1>Hello ${ this.data.text }!</h1>`;
     *      }
     *  });
     */
    template() { return "" }

    /**
     * Returns the definition of component style. Used to define the 
     * component CSS style. Reactive to changes in the component data.
     * @override
     * @returns {string} Observable data initial value.
     * @example
     *  class MainComponent extends Elementum {
     *      style() { 
     *          return `h1 { color: red; }`;
     *      }
     *  });
     */
    style() { return "" }

    /**
     * Register a change handler to the current component data property by 
     * parameter provided.
     * @param {string} prop - Elementum data prop.
     * @param {dataWatcher} handler - Handler function to call when watched data changes 
     * @example 
     *  class MainComponent extends Elementum {
     *      data() {
     *          return {
     *              text: "world"
     *          }
     *      }
     *      rendered() {
     *          this.watch("text", console.log); // prints: prop, value, last
     *      }
     *  }
     */
    watch(prop, handler) {
        let props = prop.split('.');
        if (!Data.includes(this.data, props)) {
            throw new Error(`Elementum data property '${prop}' can't be observed because it is not defined.`);
        }

        this._watched[prop] = handler;
    }

    /**
     * Registers in the HTML tag provided a new WebComponent defined by the 
     * class provided. The class provided must extends the {@link Elementum} class.
     * @param  {string} tag - The HTML tag to register the new component.
     * @param  {Elementum} definition - Custom class that extends {@link Elementum} class.
     * @example
     *  class MainComponent extends Elementum { 
     *      // ...
     *  }
     * 
     *  Elementum.attach("main-component", MainComponent);
     */
    static attach(tag, definition) {
        if (!tag || tag === "") throw "component tag must be provided";

        window.customElements.define(tag, definition);
    }

    /**
     * The callback function to execute when observed data changes.
     * @callback dataWatcher
     * @param {string} prop - Breadcrumb of target property updated.
     * @param {*} value - The new value of the property updated.
     * @param {*} last - The old value of the property updated.
     */
}

export default Elementum;