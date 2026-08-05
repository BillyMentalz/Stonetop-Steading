import {socket , addBox} from './document.js';

const listEdit = (element) => {
    const newEntry = addBox.cloneNode(true);
    newEntry.style.display = "flex";
    let newInput = document.createElement('textarea');
    let spanElement = element.querySelector('[data-field]');
    newInput.value = spanElement.textContent;
    newInput.dataset.original = spanElement.textContent;
    newInput.id = element.id; 
    newInput.dataset.field = 'listText';
    spanElement.replaceWith(newInput);        
    element.append(newEntry);
    const lId = newInput.id.split('/%/') ;
    const name = lId[0];
    const order = lId[1];
    element.querySelector('button[name="Change"]').addEventListener('click', (e)=> {
        socket.emit( 'update', {
            table: 'lists',
            name: name,
            order: order, 
            text: newInput.value
        })
        newEntry.remove()
    });
    element.querySelector('button[name="Delete"]').addEventListener('click', (e)=> {
            if (!window.confirm("Delete Item? \n Item:" + newInput.dataset.original )) {
                revertEditing(newInput);
                newEntry.remove(); 
                return;
            }
            socket.emit( 'delete',  {
            table: 'lists',
            name: name,
            order: parseInt(order) 
        })
        newEntry.remove(); 
    });
}

const characterEdit = (element) => {}

const listRevert = (element)=> {
    let  spanElement  = document.createElement("span")
    spanElement.textContent = element.dataset.original;
    spanElement.dataset.field = 'listText' ;
    element.replaceWith(spanElement);
}

const formatAddTable = {
    'lists': (element)=> {
        const last = element.lastElementChild;
        const num = last ? parseInt(last.dataset.index) + 1: 1 ;
        return {
            table:'lists',
            name: element.id,
            order: parseInt(num),
            text: 'Etc....'
        }
    },
    'characters': (element)=> { 
        return {
            table: 'characters',
            id: crypto.randomUUID(),
            home: `At World's End`,
            name: 'Add here...',
            pronouns: '',
            occupation: '',
            info : 'New fellow...',
            traits: ''
        }
    },
    'locations': (element) => {
        const last = element.lastElementChild;
        let sig = null;
        if (last) {
            sig = last.querySelector('.signifier').textContent;
            sig = String.fromCharCode(sig.charCodeAt(0) +1);
        }
        else {
            sig = 'A';
        }
        return {
            table: 'locations', 
            home: element.id ,
            signifier: sig, 
            name: '', 
            text: ''
        }
    }
}

const edit = {
    'lists': listEdit,
    'characters': characterEdit
}

const revert = {
    'listText': listRevert
}


const startEditing = ( element, table)=> {
    edit[table](element);
}

const revertEditing = (element)=>{
    revert[element.dataset.field](element);
}

export {startEditing,
        revertEditing,
        formatAddTable};
