import Data from './data';

const ValueType = {
    RAW: 'raw',
    REF: 'ref'
}

class Value {
    get value() {
        return this._value;
    }

    get ref() {
        return Data.propsToString(this._ref);
    }

    get isRef() {
        return this._type == ValueType.REF;
    }

    get isRaw() {
        return this._type == ValueType.RAW;
    }

    constructor(ref = null, value = null) {
        this._ref = (ref !== null) ? Data.parseProps(ref) : null;
        this._value = value;
        this._type = (this._ref !== null) ? ValueType.REF : ValueType.RAW;
    }

    equalProps(props) {
        if (this.isRaw) throw 'Current Value is not a reference.';

        if (Array.isArray(props)) return this.ref === Data.propsToString(props);
        else if (typeof props === 'string') return this.ref === props;

        throw 'Bad props provided. Props must be an array or a string.';
    }

    fromData(data) {
        if (this._type === ValueType.REF) return Data.getNested(data, this._ref);
        throw "No reference Value provided."
    }
}

export default Value;