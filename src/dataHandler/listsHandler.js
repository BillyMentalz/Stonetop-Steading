import {listsRow} from 'root/inject/lists.js'
import {graphNode} from 'root/document.js'
const listsOperator = (row )=>{
    const parent = document.querySelector(`ul#${row.listName}`)
    const element = listsRow(row.listOrder , row.listText);
    parent.append(element);
    return element;
};

const listsUpdateOperator = (row)=> {
    const element = row.element;
    const newelement = listsRow(row.listOrder, row.listText);
    element.replaceWith(newelement);
    row.element = newelement;
    return row.element;
};

const listsDeleteOperator = (row) => {
    row.element.remove();
}

const listNode = graphNode(
    'lists',
    ['listName', 'listOrder'],
    [],
    {},
    listsOperator,
    listsUpdateOperator,
    listsDeleteOperator
);

export { 
    listNode,
}
