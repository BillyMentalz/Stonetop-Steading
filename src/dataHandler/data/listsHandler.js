import {listsRow} from 'root/injects/lists.js'
import {graphNode} from 'root/document.js'

const listsOperator = (row)=>{
    const parent = document.querySelector(`#${row.listName} ul`)
    const element = listsRow(row.listOrder , row.listText);
    parent.append(element);
    return element;
};

const listsUpdateOperator = (row)=> {
    const element = row.element;
    const newElement = listsRow(row.listOrder, row.listText);
    element.replaceWith(newElement);
    return newElement;
};

const listsDeleteOperator = (row) => {
    row.element.remove();
}

const listNode = new graphNode(
    'lists',
    ['listName', 'listOrder'],
    {},
    {},
    listsOperator,
    listsUpdateOperator,
    listsDeleteOperator
);

export { 
    listNode,
}
