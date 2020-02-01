const _pathDel = '/';
const _pathIndex = /\[([0-9]+)\]/m;
const _commentHint = 'comment()';

class Path {
    static _childComments(node) {
        if (node.childNodes === null) return [];
        return [...node.childNodes].filter(child => child.nodeType === Document.COMMENT_NODE);
    }

    static _siblings(node) {
        if (node.parentNode === null) return [];

        return [...node.parentNode.childNodes].filter(sibling => {
            if (node.nodeType === sibling.nodeType) {
                return (node.nodeType === Document.ELEMENT_NODE) ?
                    node.tagName === sibling.tagName :
                    node.nodeType === Document.COMMENT_NODE;
            }

            return false;
        });
    }

    static getNodePath(node) {
        if (!node || (
            node.nodeType !== Document.ELEMENT_NODE &&
            node.nodeType !== Document.COMMENT_NODE
        )) return '';
        
        let path = (node.nodeType === Document.ELEMENT_NODE ?
            node.tagName : _commentHint
        ).toLowerCase();

        if (!node.id || node.id === '') {
            let siblings = Path._siblings(node);
            if (siblings.length > 1) path += `[${ siblings.indexOf(node) }]`;
        } else path += `#${ node.id }`;

        return `${ Path.getNodePath(node.parentNode) }${ _pathDel }${ path }`;
    }

    static findByPath(path, root) {
        let paths = path.split(_pathDel);
        paths.shift(); // Delete root path
        
        let res = root;
        paths.forEach(item => {
            if (res) {
                let index = 0;
                if (_pathIndex.test(item)) {
                    index = Array.from(item.matchAll(_pathIndex))[0][1];
                    item = item.replace(_pathIndex, '');
                }

                let parents = item.includes(_commentHint) ?
                    Path._childComments(res) : 
                    res.querySelectorAll(item);

                res = parents[index];
            }
        });

        return res;
    }
}

export default Path;