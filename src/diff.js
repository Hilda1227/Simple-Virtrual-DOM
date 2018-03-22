const { isString } = require('./util.js');
const listDiff = require('list-diff2');
// 两个树的完全的 diff 算法是一个时间复杂度为 O(n^3) 的问题。但是在前端当中，很少会跨越层级地移动DOM元素。所以 Virtual DOM 只会对同一个层级的元素进行对比,
// div只会和同一层级的div对比，第二层级的只会跟第二层级对比。这样算法复杂度就可以达到 O(n)

// 在实际的代码中，会对新旧两棵树进行一个深度优先的遍历，这样每个节点都会有一个唯一的标记,在深度优先遍历的时候，
// 每遍历到一个节点就把该节点和新的的树进行对比。如果有差异的话就记录到一个对象里面。

// 差异类型
const REPLACE = 0, REORDER = 1, PROPS = 2, TEXT = 3;
const patch = {
    REPLACE,
    REORDER,
    PROPS,
    TEXT,
}

function diff (oldTree, newTree) {
    var patches = {}, index = 0;
    dfsWalk(oldTree, newTree, patches, index);
    return patches;
}

function dfsWalk (oldNode, newNode, patches, index) {
    var currentPatch = [];

    if(newNode === null){
        // 真实的节点将被删除，所以这里什么也不用做
    } 
    // 文本节点
    else if(isString(newNode) && isString(oldNode)) {
        if(oldNode !== newNode) {
            currentPatch.push({type: patch.TEXT, content: newNode});
        }
    }
    // 节点相同，节点props改变
    else if(
        oldNode.tagName === newNode.tagName &&
        oldNode.key === newNode.key
    ) {
        let propsPatches = diffProps(oldNode.props, newNode.props);
        if(propsPatches) {
            currentPatch.push({type: patch.PROPS, props: propsPatches});
        }
        // diff子节点
        diffChildren(
            oldNode.children,
            newNode.children,
            index,
            patches,
            currentPatch
          )
    }
    // 节点将被替换
    else {
        currentPatch.push({type: patch.REPLACE, node: newNode})
    }

    if(currentPatch.length) {
        patches[index] = currentPatch;
    }
}


function diffProps (oldProps, newProps) {
    let propsPatches = {};
    for(key in oldProps) {
        if(oldProps[key] !== newProps[key]){
            propsPatches[key] = newProps[key]
        }
    }
    // 找出将要被改变的属性
    for(key in newProps) {
        if(!oldProps.hasOwnProperty(key)) {
            propsPatches[key] = newProps[key];
        }
    }
    // 新添加的属性
    if(Object.keys(propsPatches).length === 0) {
        return null;
    }
    return propsPatches;
}

function diffChildren (oldChildren, newChildren, parentIndex, patches, currentPatch) {
    // 此处如果列表里的元素没有key属性，则返回的结果里moves为空数组，无法表示列表顺序的变更
    // 那么后面的依次深度遍历单个元素时，除非对应位置的元素tagName仍然相同，否则会直接被判定为
    // 节点被替换，则需要删除旧元素，构建并插入新元素，开销会较大，此为react和vue里面列表需得加上key属性的原因
    var diffs = listDiff(oldChildren, newChildren, 'key');
    if(diffs.moves.length) {
        // 把列表的变动情况push到父元素的patch中
        currentPatch.push({ type: patch.REORDER, moves: diffs.moves});
    }
    let currentIndex = parentIndex,
        leftNode = null;
        // 依次diff新旧列表的对应节点
    oldChildren.forEach(function(oldChild, index) {
        currentIndex = leftNode 
        ? currentIndex + leftNode.count + 1
        : currentIndex + 1;
        dfsWalk(oldChild, newChildren[index], patches, currentIndex);
        leftNode = oldChild;
    });
}

// 知道了新旧的顺序，求最小的插入、删除操作（移动可以看成是删除和插入操作的结合）。
// 这个问题抽象出来其实是字符串的最小编辑距离问题（Edition Distance），最常见的解决算法是通过动态规划求解，
// 时间复杂度为 O(M * N)。
// 但是我们并不需要真的达到最小的操作，我们只需要优化一些比较常见的移动情况，牺牲一定DOM操作，
// 让算法时间复杂度达到线性的（O(max(M, N))。

// var ul1 = [
//     vm('li', {key: '1'}, ['hahahah']),
//     vm('li', {key: '2'}, ['hahahah']),
//     vm('li', {key: '3'}, ['hahahah'])
// ]
// var ul2 = [
//     vm('li', {key: '4'}, ['hahahah']),
//     vm('li', {key: '1'}, ['hahahah']),
//     vm('li', {key: '3'}, ['hahahah'])
// ]
// console.log(listDiff(ul1, ul2));
// {
//     children: [
//         {tagName: "li", props: {key: "1"}, children: Array(1), key: "1", count: 0},
//         null,
//         {tagName: "li", props: {key: "3"}, children: Array(1), key: "3", count: 0}
//     ],
//     moves: [
//         {index: 1, type: 0},
//         {index: 0, item: Element, type: 1}
//     ]
// }

module.exports = {
    diff,
    patch
}