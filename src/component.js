class Component extends HTMLElement {
    constructor(template = "", currentScript, actions, events) {
        super();

        this.parentDocument = currentScript.ownerDocument;

        this.templateSelector = template == "" ? "template" : `template${template}`;
        this.actions = actions;
        this.events = events;
    }

    render() {
        let template = this.parentDocument.querySelector(this.templateSelector);
        let element = template.content.cloneNode(true);
        
        this.attachShadow({mode: 'open'});
	    this.shadowRoot.appendChild(element);
    }

    connectedCallback() { 
        this.render();
        this.events.before(); 
    }

    disconnectedCallback() { this.events.after(); }
    attributesChangedCallback(a, o, v) { this.events.deleted(a, o, v); }

    static load(uri) {
        return fetch(uri).then(raw => raw.text());
    }

    static init({
        template,
        actions = {},
        before = () => {}, 
        after = () => {},
        deleted = () => {}
    }) {
        if (!tag || tag === "") throw "component tag must be provided";

        const currentScript = document.currentScript;
        window.customElements.define(tag, class extends Component {
            constructor() { 
                super(
                    template,
                    currentScript, 
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