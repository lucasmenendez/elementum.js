class Component extends HTMLElement {
    constructor(template = "", actions, events) {
        super();

        this.template = template;
        this.actions = actions;
        this.events = events;
    }

    get host() {
        return this;
    }

    render() {        
        if (!this.shadowRoot) this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.template;
    }

    connectedCallback() { 
        this.render();
        this.events.before(this); 
    }

    disconnectedCallback() { this.events.after(); }
    attributesChangedCallback(a, o, v) { this.events.deleted(a, o, v); }

    static create({
        tag,
        template,
        actions = {},
        before = () => {}, 
        after = () => {},
        deleted = () => {}
    }) {
        if (!tag || tag === "") throw "component tag must be provided";

        window.customElements.define(tag, class extends Component {
            constructor() { 
                super(
                    template,
                    actions, 
                    { before, after, deleted }
                ); 
            }
            connectedCallback() { super.connectedCallback(); }
            disconnectedCallback() { super.disconnectedCallback(); }
            attributesChangedCallback(a, o, v) { super.disconnectedCallback(a, o, v); }
        });
    }
}

export default Component;