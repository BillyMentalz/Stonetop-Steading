import { socket, addBoxTemplate } from 'root/document.js'

const locationAdd  = [
    'click',
    '.tabIcon',
    (parent, element, event) => {
        console.log( parent );
    }
];

const locationEdit = [
    'dblclick',
    '.location',
    /*
    (parent, element, event) => {
        if (element.querySelector('button')) return;
        const newEntry = document.importNode(addBoxTemplate,true);
        const info = element.__rowReference;
        if (!info) throw Error( "There is no row reference, please check again");
        const  editor = rowEnter(info) ;
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
    } */
    (parent, element, event) => {
        console.log(parent);
    }

]

const locationSelect = [
    'click',
    'div',
    (parent,element, event )=> {
        console.log(parent)
    }

]

export {
    locationSelect,
    locationEdit,
    locationAdd
}
