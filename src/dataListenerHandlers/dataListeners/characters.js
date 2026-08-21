import {socket , addBoxTemplate} from 'root/document.js'
import { characterEnter} from 'root/injects/lists.js'

const characterAdd  = [
    'click',
    '.tabIcon',
    (parent, element, event)=> {
    const result = {
        table:'characters',
        id: crypto.randomUUID(),
        home: `At World's End`,
        name: 'Add here...',
        pronouns: '(They/them)',
        occupation: 'New Occupation',
        info : 'New fellow...',
        traits: 'Friendly'
    }
    socket.emit('create', result);
    }
]

const characterEdit = [
    'dblclick',
    'li',
    (parent, element, event) => {
        if (element.querySelector('button')) return;
        const newEntry = document.importNode(addBoxTemplate,true);
        const info = element.__rowReference;
        if (!info) throw Error( "There is no row reference, please check again");
        const  editor = characterEnter(info) ;
        element.replaceWith(editor);
        editor.append(newEntry);
        editor.querySelector('button[name="Change"]').addEventListener('click', (e)=> {
            socket.emit( 'update', {
                table: 'lists',
                name: info.listName,
                order: info.listOrder, 
                text: editor.value
            })
        });
        editor.querySelector('button[name="Delete"]').addEventListener('click', (e)=> {
            if (!window.confirm("Delete Item? \n Item:" + newInput.dataset.original )) {
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



