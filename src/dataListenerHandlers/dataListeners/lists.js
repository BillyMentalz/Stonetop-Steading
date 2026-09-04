import {socket , addBoxTemplate} from 'root/document.js'
import { rowEnter} from 'root/injects/lists.js'

const listAdd  = [
    'click',
    '.tabIcon',
    (parent, element, event)=> {
    const last = parent.querySelector('ul').lastElementChild;
    const num = last ? parseInt(last.dataset.index) + 1: 1 ;
    const result = {
        table:'lists',
        name: parent.id,
        order: parseInt(num),
        text: 'Etc....'
    }
    socket.emit('create', result);
}
]

const listEdit = [
    'dblclick',
    'li',
    (parent, element, event) => {
        if (element.querySelector('button')) return;
        const newEntry = document.importNode(addBoxTemplate.content,true);
        const info = element.__rowReference;
        if (!info) throw Error( "There is no row reference, please check again");
        const  editor = rowEnter(info) ;
        element.replaceWith(editor);
        info.element = editor;
        editor.append(newEntry);
        editor.querySelector('button[name="Change"]').addEventListener('click', (e)=> {
            const newText = editor.querySelector('textarea').value;
            socket.emit( 'update', {
                table: 'lists',
                name: info.listName,
                order: info.listOrder, 
                text: newText
            })
        });
        editor.querySelector('button[name="Delete"]').addEventListener('click', (e)=> {
            if (!window.confirm("Delete Item? \n Item:" + info.listText )) {
                editor.replaceWith(info.element);
                return;
            }
            socket.emit( 'delete',  {
            table: 'lists',
            name: info.listName,
            order: info.listOrder
        })
        });
    }

]


export {
    listAdd,
    listEdit
}

