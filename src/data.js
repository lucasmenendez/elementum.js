class Data {
    constructor(target, callback) {
        return Data._observable(target, callback);
    }

    /**
     * Returns a Proxy handler.
     * @param {string[]} [parents=] - Nested parents property names array.
     * @returns {object} Proxy handler.
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

                    callback.call(self, { props, value, last });
                    return Reflect.set(target, prop, value);
                }
            }
        }

        return new Proxy(target, handler())        
    }

    /**
     * Return Component data property names deeply. 
     * Use format 'level1.leve12.[...]'.
     * @returns {string[]} Props with format defined array. 
     */
    static _props(data) {
        let getProps = (obj) => {
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
}

export default Data;