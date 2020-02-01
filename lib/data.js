/**
 */
const _propDel = '.';

/**
 * Data class makes any object properties deeply observable and associates a 
 * callback to execute if the target object changes.
 * @ignore
 * @example
 * var observed = Data(data, (props, value, last) => {
 *  // Your code.
 * });
 */
class Data {
    /**
     * Creates a observable object based on the target object provided. If any
     * object property changes, the callback provided will be executed.
     * @param {Object} target - The original object to listen to.
     * @param {dataListener} callback - Callback function to call when target data changes.
     */
    constructor(target, callback) {
        return Data._observable(target, callback);
    }

    static parseProps(ref) {
        if (typeof ref === 'string') return ref.split(_propDel);
        return null;
    }

    static propsToString(props) {
        if (Array.isArray(props)) return props.join(_propDel);
        return null;
    }

    /**
     * Creates a Proxy with a recursive handler that creates more nested Proxy
     * if deep object properties are objects. 
     * @param {Object} target - The original object to listen to.
     * @param {dataListener} callback - Callback function to call when target data changes.
     * @returns {Proxy} Proxy handler.
     * @ignore
     */
    static _observable(target, callback) {
        let self = this;
        let handler = (parents = []) => {
            return {
                get(target, prop) {
                    let current = target[prop]
                    if (typeof current === 'object' && current !== null) {
                        return new Proxy(target[prop], handler([...parents, prop]))
                    }
    
                    return target[prop];
                },
                set(target, prop, value) {
                    let props = [...parents, prop];
                    let last = target[prop];

                    let res = Reflect.set(target, prop, value);
                    callback.call(self, { props, value, last });
                    return res;
                }
            }
        }

        return new Proxy(target, handler())        
    }

    /**
     * Returns the data object attributes deeply.
     * @param {Object} data - The original object to retrieve its attributes.
     * @returns {string[]} - Attributes name list. 
     * @ignore
     */
    static _props(data) {
        let getProps = obj => {
            let res = [];
            Object.keys(obj).forEach(attr => {
                res.push([attr]);

                if (typeof obj[attr] === 'object' && obj[attr] !== null) {
                    getProps(obj[attr]).forEach(props => {
                        res.push([attr, ...props]);
                    });
                }
            });

            return res;
        }
        return getProps(data);
    }

    /**
     * Checks if properties provided are incluede into data object properties.
     * @param {Object} data - The object to check provided properties.
     * @param {string[]} props - The properties to look for.
     * @returns {boolean} The result of the check.
     */
    static includes(data, props) {
        let included = false;
        Data._props(data).forEach(prop => {
            if (props.every(candidate => prop.includes(candidate))) {
                included = true;
                return;
            }
        });

        return included;
    }

    /**
     * If it exists, returns value from data provided based on props privided.
     * @param {Object} data - The object to get the referenced property
     * @param {string[]} props - The properties to look for.
     * @returns {*} Value of referenced prop if it exists.
     */
    static getNested(data, props) {
        if (Data.includes(data, props)) {
            let result = data;
            props.forEach(prop => result = result[prop]);
            return result;
        }

        return null;
    }
}

export default Data;