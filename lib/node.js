import Path from './path';

const NodeTypes = {
    ATTRIBUTE: 'attr',
    INTERPOLATION: 'interpolation',
    EMPTY: 'empty'
};

const _attrRe = /\s(\S+)\=[\"\']<!--slot\(([0-9]+)\)-->[\"\']/gm;
const _interRe = /slot\(([0-9]+)\)/gm;
const _protectedAttrs = [ "id" ];

class Node {
    get hasFields() {
        return this._type != NodeTypes.EMPTY && this.fields.size !== 0;
    }

    get isAttr() {
        return this._type == NodeTypes.ATTRIBUTE;
    }

    get isInterpolation() {
        return this._type == NodeTypes.INTERPOLATION;
    }

    constructor(node) {
        this.path = Path.getNodePath(node);
        this.fields = new Map();
        
        this._node = node;
        this._outer = this._node.outerHTML;
        this._type = this._getType();

        this._init();
    }

    _init() {
        if (this.isAttr) this._parseAttr();
        else if (this.isInterpolation) this._parseInter();
    }

    _getType() {
        let type = NodeTypes.EMPTY;
        if (this._node.nodeType === Document.COMMENT_NODE) {
            if (_interRe.test(this._node.data)) type = NodeTypes.INTERPOLATION;
            _interRe.lastIndex = 0;
        } else if (this._node.nodeType === Document.ELEMENT_NODE) {
            if (_attrRe.test(this._outer)) type = NodeTypes.ATTRIBUTE;
            _attrRe.lastIndex = 0;
        }

        return type;
    }

    _parseAttr() {
        let res = Array.from(this._outer.matchAll(_attrRe));
        _attrRe.lastIndex = 0;

        res.forEach(group => {
            let attr = group[1];
            let index = parseInt(group[2]);
            if (_protectedAttrs.includes(attr))
                throw `Node attribute '${ attr }' ('${ this.path }') can not be dynamic`;

            this.fields.set(index, { attr, value: null });
        });
    }

    _parseInter() {
        let res = Array.from(this._node.data.matchAll(_interRe));
        _interRe.lastIndex = 0;

        res.forEach(group => {
            let index = parseInt(group[1]);
            let nextElem = Path.getNodePath(this._node.nextElementSibling) || null;
            this.fields.set(index, { nextElem, value: null});
        });
    }

    setFieldValue(index, value) {
        let temp = this.fields.get(index);
        temp.value = value;
        this.fields.set(index, temp);
    }

    render(container) {
        let elem = Path.findByPath(this.path, container);
        
        if (this.isAttr) this._renderAttr(elem);
        else if (this.isInterpolation) this._renderInter(elem);
    }

    _renderAttr(elem) {
        this.fields.forEach(field => {
            elem.setAttribute(field.attr, field.value);
        });
    }

    _renderInter(elem) {
        let field = Array.from(this.fields.values())[0];
        let temp = document.createElement("div");
        temp.innerHTML = field.value;

        let next = field.nextElem ? Path.findByPath(field.nextElem, elem.getRootNode()) : null;
        this._clearInter(elem, next);
        
        Array.from(temp.childNodes).forEach(child => {
            if (next) elem.parentNode.insertBefore(child, next);
            else elem.parentNode.insertBefore(child, elem.nextSibling);
        });
    }

    _clearInter(elem, nextElem) {
        let end = nextElem;
        let next = elem.nextSibling;

        while (next && !next.isEqualNode(end)) {
            let _next = next.nextSibling;
            elem.parentNode.removeChild(next);
            next = _next;
        }
    }
}

export default Node;