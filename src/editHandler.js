import {socket , addBox} from './document.js';

const listEdit = (element) => {
    const newEntryClone = document.querySelector("#addBoxTemplate");
    const newEntry = document.importNode(newEntryClone.content, true);
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
        element.lastElementChild.remove();
    });
    element.querySelector('button[name="Delete"]').addEventListener('click', (e)=> {
            if (!window.confirm("Delete Item? \n Item:" + newInput.dataset.original )) {
                revertEditing(newInput);
                element.lastElementChild.remove(); 
                return;
            }
            socket.emit( 'delete',  {
            table: 'lists',
            name: name,
            order: parseInt(order) 
        })
        element.lastElementChild.remove();
    });
}

const characterEditables = [
    '.characterHome',
    '.characterName',
    '.characterPronouns',
    '.characterOccupation',
    '.characterInfo',
    '.characterTraits']
const characterEdit = (element) => {
    if (!element.dataset.characterId ) return;
    const newEntryClone = document.querySelector("#addBoxTemplate");
    const newEntry = document.importNode(newEntryClone.content, true);
    const thing = element.children;
    for (const detail of characterEditables) {
        const exist = element.querySelector(detail);
        const newInput = document.createElement('textarea');
        const spanElement = exist.querySelector('span');
        newInput.dataset.original = spanElement.textContent;
        newInput.value = spanElement.textContent;
        spanElement.replaceWith(newInput);        
    }
    element.append(newEntry);
    element.querySelector('button[name="Change"]').addEventListener('click', (e)=> {
        socket.emit( 'update', {
            table: 'characters',
            id: element.dataset.characterId ,
            home: element.querySelector(`.characterHome textarea`).value,
            name: element.querySelector(`.characterName textarea`).value,
            pronouns: element.querySelector(`.characterPronouns textarea`).value,
            occupation:element.querySelector(`.characterOccupation textarea`).value,
            info : element.querySelector(`.characterInfo textarea`).value,
            traits: element.querySelector(`.characterTraits textarea`).value
        })
        newEntry.remove()
        clear(element);
    });
    element.querySelector('button[name="Delete"]').addEventListener('click', (e)=> {
        if (!window.confirm("Delete Character? \n Character:"   )) {
            revertEditing(element); 
            newEntry.remove(); 
            return;
        }
        socket.emit( 'delete',  {
        table: 'characters',
        id: element.dataset.characterId,
        })
        newEntry.remove(); 
        clear(element);
    });
}

const clear = (element) => {
    delete element.dataset.characterId ;
    for (const detail of characterEditables){
        const exist = element.querySelector(detail);
        const damned = exist.lastElementChild;
        const spanElement = document.createElement('span');
        damned.replaceWith(spanElement);
    }
}

const listRevert = (element)=> {
    let  spanElement  = document.createElement("span")
    spanElement.textContent = element.dataset.original;
    spanElement.dataset.field = 'listText' ;
    element.replaceWith(spanElement);
}

const characterRevert = (element)=> {
    for (const detail of characterEditables){
        const exist = element.querySelector(detail);
        const inputElement = exist.querySelector('textarea');
        const spanElement = document.createElement('span');
        spanElement.textContent = inputElement.dataset.original;
        inputElement.replaceWith(spanElement);
    }
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
            pronouns: '(They/them)',
            occupation: 'New Occupation',
            info : 'New fellow...',
            traits: 'Friendly'
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
    'listText': listRevert,
    'characters': characterRevert
}


const startEditing = (element, table)=> {
    edit[table](element);
}

const revertEditing = (element)=>{
    revert[element.dataset.field](element);
}

export {startEditing,
        revertEditing,
        formatAddTable};
