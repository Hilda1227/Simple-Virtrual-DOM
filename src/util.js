var _ = {
    isArray (obj) {
        if(Array.isArray) return Array.isArray(obj);
        return toString.call(obj) === '[object Array]';
    },
    isString (obj) {
        return typeof obj === 'string';
    },
    setAttr (node, key, value) {
        switch (key) {
            case 'style': {
                for(let key in value){
                    node.style[key] = value[key];
                }
                break;
            }
            case 'value': {
                var tagName = node.tagName || '';
                tagName = tagName.toLowerCase();
                if (tagName === 'input' || tagName === 'textarea' ){
                    node.value = value;
                } else {
                    node.setAttribute(key, value);
                }
                break;
            }
            default: {
                node.setAttribute(key, value)
                break;
            }
        }
      }
      
};

module.exports = _;
