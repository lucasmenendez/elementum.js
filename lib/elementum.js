import Data from './data';
import Value from './value';
import Template from './template';

/**
 * @constant {string} _eventPrefix - Text prefix to identify DOM events over 
 * child elements.
 * @ignore
 */
const _eventPrefix = 'on:';

/**
 * @constant {function} _supportedTypes - Supported attributes types.
 * @ignore
 */
const _supportedTypes = [ Number, String, Boolean, Array, Object ];

/** 
 * Elementum class extends a generic HTMLElement and adds some features like 
 * data binding or component lifecycle events. 
 * @class Elementum
 * @extends HTMLElement
 * @property {Object} data - Contains the component data defined by user.
 */
class Elementum extends HTMLElement {
    static get attrs() { }

    static get observedAttributes() {
        if (!this.attrs) return [];

        return Object.keys(this.attrs).map(attr => {
            let type = this.attrs[attr];
            if (!_supportedTypes.includes(type)) {
                let supported = _supportedTypes.map(type => type.name);
                throw `The type ${ type } is not supported, only ${ supported }`;
            }

            return attr;
        });
    }

    /**
     * Current element document.
     * @type {HTMLDocument}
     */
    get document() { return this.shadowRoot }

    /**
     * Host element node.
     * @type {HTMLElement}
     */
    get host() { return this.getRootNode().host }

    /**
     * When a Elementum is initialized, the data binding process starts. 
     * The DOM render process will begin when the data binding ends.
     */
    constructor() {
        super();

        this._dataWatched = {};
        this._attrsWatched = {};
        this._attrsTypes = {};
        this._initData();
        this._initAttrs();
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
     * Creates Elementum observable data, that allows to listen changes over all 
     * data properties. When data content changes, {@link Elementum#_dataHandler} 
     * is called.
     * @ignore
     */
    _initData() {
        let data = this._callMethod('data');
        if (data) this.data = new Data(data, change => {
            let ref = Data.propsToString(change.props);
            this._template.update(this.shadowRoot, ref, change.value);
            
            this._dataHandler(change);
        });
    }

    /**
     * Creates Elementum observable attributes, that allows to listen changes 
     * over all of them. For each defined attributed, 
     * {@link Elementum#_parseAttrTag} returns correct value to set initially. 
     * When attributes content changes, {@link Elementum#_attrHandler} is called.
     * @ignore
     */
    _initAttrs() {
        if (this.constructor.hasOwnProperty('attrs'))
            this._attrsTypes = Object.assign({}, this.constructor.attrs);

        let attrs = {};
        Object.keys(this._attrsTypes).forEach(name => attrs[name] = null);

        this.attrs = new Data(attrs, change => this._attrHandler(change));
    }

    /**
     * Receives the component data change and propagates it to the assigned 
     * watcher if it exists.
     * @param {object} change - Change registered over component data
     * @param {string[]} change.props - List of attributes tree to top
     * @param {*} change.value - New value
     * @param {*} change.last - Old value
     * @ignore
     */
    _dataHandler(change) {
        let ref = Data.propsToString(change.props);
        if (Object.keys(this._dataWatched).includes(ref)) {
            let f = this._dataWatched[ref];
            f.call(this, ref, change.value, change.last);
        }
    }

    /**
     * Receives the component attribute change and propagates it to the assigned 
     * watcher if it exists.
     * @param {object} change - Change registered over component data
     * @param {string[]} change.props - List of attributes tree to top
     * @param {*} change.value - New value
     * @param {*} change.last - Old value
     * @ignore
     */
    _attrHandler(change) {
        let ref = Data.propsToString(change.props);
        if (Object.keys(this._attrsWatched).includes(ref)) {
            let f = this._attrsWatched[ref];
            f.call(this, ref, change.value, change.last);
        }
    }

    /**
     * @todo Standar API to watch attributes changes like data.
     * @ignore
     */
    attributeChangedCallback(attr, old, value) {
        if (old === value) return;

        let type = this._attrsTypes[attr];
        let typedValue = this._parseAttr(type, value);
        this.attrs[attr] = typedValue;
    }

    _parseAttr(type, value) {
        // TODO
        return type(value);
    }

    /**
     * Callback function for connected event. It runs {@link Elementum#created} 
     * method and init the render cycle.
     * @ignore
     */
    connectedCallback() {
        this.created(); 
        this._render();
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

        this.rendered();
    }

    /**
     * Creates, if not exists, and clears current `shadowRoot`.
     * @ignore
     */
    _initShadowRoot() {
        if (!this.shadowRoot) this.attachShadow({mode: 'open'});
    }

    /**
     * Get computed body from the component definition if it exists, and append 
     * it to the current shadowRoot.
     * @ignore
     */
    _renderBody() {
        let template = this._callMethod('template');
        if (!template instanceof Template) 
            throw "Use 'html' string literal tag for your templates to make them reactive.";

        this._template = template;
        this._template.render(this.shadowRoot, this.data);
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

            let current = this.shadowRoot.querySelector("style");
            if (current) current.innerHTML = style.innerHTML;
            else this.shadowRoot.appendChild(style);
        }
    }

    /**
     * Iterate over all child elements in the current shadowRoot and set 
     * listeners to each one, if it has any listener assigned.
     * @ignore
     */
    _setEvents() {
        let childElements = this.shadowRoot.querySelectorAll("*");
        childElements.forEach(child => {
            this._eventsOf(child).forEach(it => {
                child.addEventListener(it.event, e => {
                    this._callMethod(it.callback, e);
                });
            });
        });
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
     * Callback function for disconnected event. It runs 
     * {@link Elementum#destroyed} method.
     * @ignore
     */
    disconnectedCallback() {
        this.destroyed();
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
     *          return html`<h1>Hello ${ ref`text` }!</h1>`;
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
     * @deprecated since version 0.2.0
     * @see {@link watchData}
     * @param {string} prop - Elementum data prop.
     * @param {watcher} handler - Handler function to call when watched data changes 
     */
    watch(prop, handler) {
        this.watchData(prop, handler);
    }

    /**
     * Register a change handler to the current component data property by 
     * parameter provided.
     * @param {string} prop - Elementum data prop.
     * @param {watcher} handler - Handler function to call when watched data changes 
     * @example 
     *  class MainComponent extends Elementum {
     *      data() {
     *          return {
     *              text: "world"
     *          }
     *      }
     *      rendered() {
     *          this.watchData("text", console.log); // prints: prop, value, last
     *      }
     *  }
     */
    watchData(ref, handler) {
        let props = Data.parseProps(ref);
        if (!Data.includes(this.data, props)) {
            throw new Error(`Elementum data property '${prop}' can't be observed because it is not defined.`);
        }

        this._dataWatched[prop] = handler;
    }

    /**
     * Register a change handler to the current component attribute by 
     * parameter provided.
     * @param {string} attr - Elementum attribute name.
     * @param {watcher} handler - Handler function to call when watched data changes 
     * @example 
     *  class ParentComponent extends Elementum {
     *      data() {
     *          return { 
     *              counter: 100
     *          } 
     *      }
     * 
     *      template() {
     *          return html`
     *              <h1>${ data`counter` }</h1>
     *              <increase-button id="child-btn" value="${ data`counter` }"/>
     *          `;
     *      }
     *      rendered() {
     *          this.document.querySelector("#child-btn").watchAttr("value", (prop, value) => {
     *              this.data.counter = value; // Updates value from child
     *          });
     *      }
     *  }
     * 
     *  class IncreaseButtonComponent extends Elementum {
     *      template() {
     *          return html`<button on:click="increaseCounter">increase</button>`;
     *      }
     *      
     *      increaseCounter() {
     *          this.attrs.value++;
     *      }
     *  }
     */
    watchAttr(attr, handler) {
        if (!Data.includes(this.attrs, [attr])) {
            throw new Error(`Elementum data property '${attr}' can't be observed because it is not defined.`);
        }

        this._attrsWatched[attr] = handler;
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
     * @callback watcher
     * @param {string} prop - Breadcrumb of target property updated.
     * @param {*} value - The new value of the property updated.
     * @param {*} last - The old value of the property updated.
     */
}

// export default Elementum;
export const html = (strings, ...values) => new Template(strings, values);
export const data = (ref) => new Value(ref[0]);
export { Elementum };