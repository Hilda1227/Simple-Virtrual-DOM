const { isArray, setAttr } = require('./util.js');

function Element (tagName, props, children) {
    if(isArray(props)) {
        children = props;
        props = {};
    }
    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props ? props.key : void 0;

    let count = 0;
    for(let i = 0; i < this.children.length; i++){
        if(children[i] instanceof Element) {
            count = children[i].count + 1;
        }
        else {
            children[i] = '' + children;
            count++;
        }
    }
    this.count = count;
}

Element.prototype.render = function () {
    let {tagName, props, children} = this;
    let el = document.createElement(tagName);

    for( key in props ) {
        setAttr(el, key, props[key])
    }

    if(isArray(children)){
        children.forEach(function(element) {
            let child = element instanceof Element
                ? element.render()
                : document.createTextNode(element);
            el.appendChild(child);
        }, this);
    }
    return el;
}

module.exports = function vm (tagName, props, children) {
    return new Element(tagName, props, children);
}