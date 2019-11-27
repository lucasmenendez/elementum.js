/**
 * @class Component
 * Represents Component object with its shadowRoot.
 * @property  {string} template - The HTML template for the new component.
 * @property  {Object} actions - User functions to use into the new component.
 * @property  {Object} events - User callbacks for events (created, rendered & deleted).
 */
class Component extends HTMLElement {
    /**
     * @constructor
     * @param  {string} template - The HTML template for the new component.
     * @param  {Object} [actions] - events - Common events callbacks (connected, disconnected & attributesChanged).
     * @param  {Object} [events] - User callbacks for events (created, rendered & deleted).
     * @param  {Function} [events.created] - User callback to fire when the new component is created.
     * @param  {Function} [events.rendered] - User callback to fire when the new component is rendered.
     * @param  {Function} [events.deleted] - User callback to fire when the new component is deleted.
     */
    constructor(template, actions, events) {
        super();

        this.template = template;
        this.actions = actions;
        this.events = events;
    }

    /**
     * Host element getter function.
     * @returns  {HTMLElement} The host element where current component is attached.
     */
    get host() {
        return this;
    }

    /**
     * Render function creates the shadowRoot, if not exists, and attaches the template.
     */
    render() {
        if (!this.shadowRoot) this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.template;
    }
    
    /**
     * Callback function for connected event. It fires user callback 'created', render function and fires user callback 'rendered', attaching host element.
     */
    connectedCallback() {
        this.events.created(this.host); 
        this.render();
        this.events.rendered(this.host);
    }
    
    /**
     * Callback function for disconnected event. It fires user callback 'deleted'.
     */
    disconnectedCallback() {
        this.events.deleted(this.host);
    }
    
    /**
     * 
     * @param  {Object} options - Set of configurations to initialize a new component.
     * @param  {string} options.tag - The new component HTML tag name.
     * @param  {Object} [options.actions] - User functions to use into the new component.
     * @param  {Function} [option.created] - User callback to fire when the new component is created.
     * @param  {Function} [option.rendered] - User callback to fire when the new component is rendered.
     * @param  {Function} [option.deleted] - User callback to fire when the new component is deleted.
     */
    static create({
        tag,
        template,
        actions = {},
        created = () => {}, 
        rendered = () => {},
        deleted = () => {}
    }) {
        if (!tag || tag === "") throw "component tag must be provided";
        if (!template || template === "") throw "component template must be provided";

        window.customElements.define(tag, class extends Component {
            constructor() { 
                super(
                    template,
                    actions, 
                    { created, rendered, deleted }
                ); 
            }

            connectedCallback() { super.connectedCallback(); }
            disconnectedCallback() { super.disconnectedCallback(); }
            attributesChangedCallback(a, o, v) { super.attributesChangedCallback(a, o, v); }
        });
    }
}

export default Component;