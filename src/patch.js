const _ = require('./util');
const { REPLACE, REORDER, TEXT, PROPS } = require('./diff').patch;

function patch (oldTree, patches) {
    let walker = {index: 0};
    dfsWalk (oldTree, walker, patches)
}

function dfsWalk (oldNode, walker, patches) {
    if(patches[walker.index]) {
        applyPatch(oldNode, patches[walker.index]);
    }

    let len = oldNode.childNodes ? oldNode.childNodes.length : 0;
    for(let i = 0; i < len; i++) {
        let child = oldNode.childNodes[i];
        walker.index++;
        dfsWalk(child, walker, patches);
    }
}

function applyPatch (oldNode, currentPatches) {
    currentPatches.forEach(function(patchItem, index) {
        switch (patchItem.type) {
            case REPLACE: {
                let newNode = typeof patchItem.node === 'string' 
                    ? document.createTextNode(patchItem.node)
                    : patchItem.node.render();
                oldNode.parentNode.replaceChild(newNode, oldNode);
                break;     
            }
            case REORDER: {
                reorderChildren(oldNode, patchItem.moves);
                break;
            }
            case TEXT: {
                oldNode.textContent = patchItem.content;
                break;
            }
            case PROPS: {
                setProps(oldNode, patchItem.props);
                break;
            }
            default: {
                throw new Error('Unknown patch type')
            }
        }
    });
}

function reorderChildren (node, moves) {
    let nodeList = node.childNodes;
    moves.forEach(function (move) {
        if(move.type === 0) {
            console.log('node',node)
            node.removeChild(nodeList[move.index])
        } else if (move.type === 1) {
            let insertNode = typeof move.item === 'string'
                ? document.createTextNode(move.item) 
                : move.item.render();
            node.insertBefore(insertNode, nodeList[move.index]);
        }
    })
}

function setProps (oldNode, props) {
    for(let key in props) {
        _.setAttr(oldNode, key, props[key])
    }
}

module.exports = patch;