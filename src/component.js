import Data from './data';

/**
 * Components its a simple framework to work with vanilla WebComponents with a 
 * natural sintax.
 * @module Component
 */

const _eventPrefix = 'on:';

/** 
 * Component class extends a generic HTMLElement and adds some features like 
 * data binding or component lifecycle events. 
 */
class Component extends HTMLElement {
    /**
     * When a Component is initialized, the data binding process starts. 
     * The DOM render process will begin when the data binding ends.
     */
    constructor() {
        super();

        /** @private */
        this._watched = {}
        /** @private */
        this._watchData();
    }

    /**
     * Gets Component data and create a nested Proxy with it for be assigned as 
     * final Component data reference. That allows to listen changes over all 
     * Component data. When data content changes, {@link Component#_dataUpdated} 
     * is called.
     * @private
     */
    _watchData() {
        let data = this._callMethod('data');
        if (data) this.data = new Data(data, change => this._dataUpdated(change));
    }

    _dataUpdated(change) {
        let prop = change.props.join('.');

        if (Object.keys(this._watched).includes(prop)) {
            let f = this._watched[prop];
            f.call(this, prop, change.value, change.last);
        }

        this._render();
    }

    /**
     * Render function creates the shadowRoot, if not exists, set a empty body 
     * and attaches the template and styles provided by Component definition.
     * @private
     */
    _render() {
        this._initShadowRoot();
        this._renderStyles();
        this._renderBody();
        this._setEvents();
    }

    _initShadowRoot() {
        if (!this.shadowRoot) this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = "";
    }

    _renderStyles() {
        let styles = this._callMethod('styles');
        if (styles) {
            let style = document.createElement('style');
            style.innerHTML = styles;
            
            this.shadowRoot.appendChild(style);
        }
    }

    _renderBody() {
        let template = this._callMethod('template');
        if (template) {
            let body = document.createElement('body');
            body.innerHTML = template;

            this.shadowRoot.appendChild(body);
        }
    }

    _setEvents() {
        this._elemChilds().forEach(child => {
            this._eventsOf(child).forEach(it => {
                child.addEventListener(it.event, () => {
                    this._callMethod(it.callback);
                });
            });
        });
    }

    _elemChilds(parent = this.shadowRoot) {
        let childs = [parent];
        if (!parent.childNodes || parent.childNodes.length === 0) return childs;

        Array.from(parent.childNodes).forEach(child => {
            childs = [...childs, ...this._elemChilds(child)];
        });

        return childs;
    }

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
     * 
     * @private
     */
    _callMethod(name) {
        // TODO: Change to JS functions
        return typeof this[name] === 'function' ? this[name]() : null;
    }
    
    /**
     * Callback function for connected event. It fires user callback 'created', render function and fires user callback 'rendered', attaching host element.
     * @private
     */
    connectedCallback() {
        this._callMethod('created'); 
        this._render();
        this._callMethod('rendered'); 
    }
    
    /**
     * Callback function for disconnected event. It fires user callback 'deleted'.
     * @private
     */
    disconnectedCallback() {
        this._callMethod('destroyed');
    }

    /**
     * Callback function for disconnected event. It fires user callback 'deleted'.
     * @private
     */
    attributeChangedCallback(attr, old, current) {
        console.log(attr, old, current);
    }

    /**
     * Registers a change listener callback to a Component data prop provided.
     * @param {string} prop - Component data prop.
     * @param {function(string, *, *):void} callback 
     */
    watch(prop, callback) {
        let props = prop.split('.');
        if (!Data.includes(this.data, props)) {
            throw new Error(`Component data property '${prop}' can't be observed because it is not defined.`);
        }

        this._watched[prop] = callback;
    }

    /**
     * Registers in the HTML tag provided a new WebComponent defined by the 
     * class provided. The class provided must extends the {@link Component} class.
     * @param  {string} tag - The HTML tag to register the new component.
     * @param  {Object} elemClass - Custom class that extends {@link Component} class.
     */
    static attach(tag, elemClass) {
        if (!tag || tag === "") throw "component tag must be provided";

        window.customElements.define(tag, elemClass);
    }
}

export default Component;