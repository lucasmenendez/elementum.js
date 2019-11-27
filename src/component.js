/**
 * @class Component
 * Represents Component object with its shadowRoot.
 * @property  {string} template - The HTML template for the new component.
 * @property  {Object} actions - User functions to use into the new component.
 * @property  {Object} events - User callbacks for events (created, rendered & deleted).
 */
class Element extends HTMLElement {
    constructor() {
        super();

        let data = this.__invoke('inject');
        if (data) {
            this.__data = data;
            this.__proxy = new Proxy(this.__data, {
                set: (target, prop, val) => {
                    target[prop] = val;
                    this.__render();
                    return true;
                }
            })
        }
    }

    get data() {
        return this.__proxy;
    }

    set data(val) {
        this.__data = val;
        this.__render(); 
    }

    /**
     * Render function creates the shadowRoot, if not exists, and attaches the template.
     */
    __render() {
        if (!this.shadowRoot) this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = "";

        let styles = this.__invoke('styles');
        if (styles) {
            let style = document.createElement('style');
            style.innerHTML = styles;
            
            this.shadowRoot.appendChild(style);
        }

        let template = this.__invoke('template');
        if (template) {
            let body = document.createElement('body');
            body.innerHTML = template;

            this.shadowRoot.appendChild(body.firstChild);
        }
    }

    /**
     * 
     */
    __invoke(name) {
        return typeof this[name] === 'function' ? this[name]() : null;
    }
    
    /**
     * Callback function for connected event. It fires user callback 'created', render function and fires user callback 'rendered', attaching host element.
     */
    connectedCallback() {
        this.__invoke('created'); 
        this.__render();
        this.__invoke('rendered'); 
    }
    
    /**
     * Callback function for disconnected event. It fires user callback 'deleted'.
     */
    disconnectedCallback() {
        this.__invoke('rendered');
    }

    attributeChangedCallback(attr, old, current) {
        console.log(attr, old, current);
    }
}

/**
 * 
 * @param  {string} tag - The new component HTML tag name.
 * @param  {Object} element - User functions to use into the new component.
 */
function create(tag, element) {
    if (!tag || tag === "") throw "component tag must be provided";

    window.customElements.define(tag, element);
}

export default {
    Element,
    create
};