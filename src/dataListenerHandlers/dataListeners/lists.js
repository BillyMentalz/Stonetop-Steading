import {socket , addBoxTemplate} from 'root/document.js'
import { rowEnter} from 'root/injects/lists.js'

const listAdd  = (element, event)=> {
    const result = {
        table:'lists',
        listName: event.currentTarget.id,
        listText: 'Etc....'
    }
    socket.emit('create', result);
}

const listEdit = (element, event) => {
    if (element.querySelector('button')) return;
    const newEntry = document.importNode(addBoxTemplate.content,true);
    const info = element.__rowReference;
    if (!info) throw Error( "There is no row reference, please check again");
    const  editor = rowEnter(info) ;
    element.replaceWith(editor);
    info.element = editor;
    editor.__rowReference = info;
    editor.append(newEntry);
}

const listChange = (element, event) => {
    const editor = event.target.closest('li');
    const newText = editor.querySelector('textarea').value;
    const info = editor.__rowReference;
    socket.emit( 'update', {
        table: 'lists',
        listName: info.listName,
        listOrder: info.listOrder, 
        listText: newText
    })
}

const listDelete = (element, event) => {
    const info = event.target.closest('li').__rowReference;
    if (!window.confirm("Delete Item? \n Item:" + info.listText )) {
            return;
        }
    socket.emit( 'delete',  {
        table: 'lists',
        listName: info.listName,
        listOrder: info.listOrder
    })
}

const listCard = {
    'click': {
        'Add': listAdd,
        'Change': listChange,
        'Delete': listDelete
    },
    'dblclick': {
        'Edit': listEdit
    }
}

export {
    listCard
}
