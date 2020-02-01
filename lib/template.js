import Node from "./node";
import Value from "./value";

const _slotIndexHint = 'index';
const _slotMarkGenerator = '<!--slot(index)-->';

class Template {
    static _encodeMark(index) {
        return _slotMarkGenerator.replace(_slotIndexHint, index);
    }

    get slots() {
        let temp = [...this._slots.raw];
        temp.push(...this._slots.refs);
        return temp;
    }

    constructor(strings, data) {
        this._template = document.createElement('template');
        this._strings = [...strings.raw];
        this._children = [];
        this._nodes = [];
        this._slots = {
            refs: [],
            raw: []
        };
        this._data = data.map(slot => {
            return slot instanceof Value ? slot : new Value(null, slot);
        });

        this._buildTemplate();
    }

    _buildTemplate() {
        this._markTemplate();
        
        this._getTemplateChildren();
        this._getTemplateNodes();
        this._getTemplateSlots();
    }

    _markTemplate() {
        let temp = '';
        this._strings.forEach((p, i) => {
            let mark = this._data[i] ? Template._encodeMark(i) : '';
            temp += p + mark; 
        });

        this._template.innerHTML = temp;
    }

    _getTemplateChildren() {
        let temp = Array.from(this._template.content.querySelectorAll('*'));
        temp.forEach(child => {
            let res = [child];
            child.childNodes.forEach(node => {
                if (node.nodeType === Document.COMMENT_NODE) res.push(node);
            });

            this._children.push(...res);
        });
    }

    _getTemplateNodes() {
        let dataSlots = 0;
        this._children.forEach(child => {
            let node = new Node(child);
            if (node.hasFields) {
                dataSlots += node.fields.size;
                this._nodes.push(node);
            }
        });

        if (this._data.length !== dataSlots) 
            throw 'Bad template parsing. The number of data slots mismatches with the number of data values provided.';
    }

    _getTemplateSlots() {
        this._nodes.forEach(node => {
            node.fields.forEach((_, index) => {
                let value = this._data[index];
                let slot = { index, node, value };

                if (value.isRef) this._slots.refs.push(slot);
                else this._slots.raw.push(slot);
            });
        });
    }

    _getSlotValue(slot, data) {
        return (slot.value.isRef) ? slot.value.fromData(data) : slot.value.value;
    }

    update(container, ref, value) {
        let toUpdate = [];
        this._slots.refs.forEach(slot => {
            if (slot.value.equalProps(ref)) {
                slot.node.setFieldValue(slot.index, value);
                if (!toUpdate.includes(slot.node)) toUpdate.push(slot.node);
            }
        });

        toUpdate.forEach(node => node.render(container));
    }

    render(container, data) {
        container.innerHTML += this._template.innerHTML;

        this.slots.forEach(slot => {
            let value = this._getSlotValue(slot, data);
            slot.node.setFieldValue(slot.index, value);
        });

        this._nodes.forEach(node => node.render(container));
    }
}

export default Template;