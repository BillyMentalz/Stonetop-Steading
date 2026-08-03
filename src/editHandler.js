import {socket } from './document.js';

const listEdit = (element) => {
    let newInput = document.createElement('input');
    let spanElement = element.querySelector('[data-field]');
    newInput.type = "text";
    newInput.value = spanElement.textContent;
    newInput.dataset.original = spanElement.textContent;
    newInput.id = element.id; 
    newInput.dataset.field = 'listText';
    spanElement.replaceWith(newInput);        
}

const listRevert = (element)=> {
    let  spanElement  = document.createElement("span")
    spanElement.textContent = element.dataset.original;
    spanElement.dataset.field = 'listText' ;
    element.replaceWith(spanElement);
}

const listAdd = (element) => {
    socket.emit('create')
}

const edit = {
    'lists': listEdit
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

const addEditing = (element)=> {
    // Last Edit 
}

export {startEditing,
        revertEditing};
