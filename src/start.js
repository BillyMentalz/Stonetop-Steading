import {storeNewRows, loadTables ,loadOperator, updateOperator, deleteOperation } from './syncHandler.js'
import { startEditing, revertEditing,formatAddTable } from './editHandler.js';
import * as constants from './document.js';
const sidebarEvents = ['radio' , 'select-one', 'number', 'checkbox'];
const tablists = new constants.LinkedList();
var isUpdatingFromServer = 0;
var indicatorDragMap = new Map();
var guideBookToggle = false;

function motherEventFactory(parent, mEvent , selector , handler) {
    parent.addEventListener(mEvent , (e)=> {
        const element = e.target.closest(selector);
        if (!element) return;
        handler(element, e);
    })
}
//Notifying function
// CREATING ELEMENTS THAT CAN BE DRAGGED

motherEventFactory(constants.map, 'mousedown', '.draggable', (draggable, e)=> {
    let dragHandler = (e) => drags(constants.map ,e)  ;
    draggable.addEventListener('mousemove', dragHandler)
    indicatorDragMap.set(draggable, dragHandler);
})
motherEventFactory(constants.map, 'mouseup', '.draggable', (draggable, event)=> {
    for ( const [key, value] of indicatorDragMap){
        key.removeEventListener('mousemove', value);
        indicatorDragMap.delete(key);
    }
}) 
motherEventFactory(document, 'mousedown', '.tabs', (draggable, event)=> {
    tablists.popNode(draggable.__nodeRef);
    tablists.append(draggable);
    caltab();
    draggable.addEventListener ("mousemove", tabDrag)
})
motherEventFactory(document, 'mouseup', '.tabs', (draggable, event)=> {
    draggable.removeEventListener ("mousemove", tabDrag)
})

motherEventFactory(constants.characters, 'click',  'tr' , (row, event)=> {
    if ( constants.characterInfo.querySelector("button")) return;
    constants.characterInfo.dataset.characterId = row.dataset.id;
    const thing = row.children;
    for ( let i = 0; i < thing.length ; i++) {
        const exist = thing.item(i);
        const lister = constants.characterInfo.querySelector(`.${exist.dataset.head}`);
        if (lister) {
            lister.innerHTML = '';
            const spanElement = document.createElement('span');
            spanElement.textContent = exist.textContent;
            lister.append(spanElement);
        }
    }
})

function drags(box , event) {// This is for sharable indicators
    let boundaries =  box.getBoundingClientRect();
    let newleft = ((event.clientX - event.currentTarget.offsetWidth/2) - boundaries.left)/box.offsetWidth*100;
    let newtop = ((event.clientY - event.currentTarget.offsetHeight/2) - boundaries.top)/box.offsetHeight*100;
    if (newleft < -5) newleft = -5;
    if (newleft > 97.5) newleft = 97.5;
    if (newtop < -5) newtop = -5;
    if (newtop >95) newtop = 95;
    event.currentTarget.style.left = `${newleft}%`;
    event.currentTarget.style.top = `${newtop}%`;
} 

function tabDrag(event) { // This is for independent indicators 
    let newleft = event.clientX ;
    let newtop = event.clientY;
    if (newleft < event.currentTarget.offsetWidth/2) newleft = event.currentTarget.offsetWidth/2;
    if (newtop < event.currentTarget.offsetHeight/2) newtop = event.currentTarget.offsetHeight/2;
    if (newleft > (window.innerWidth - event.currentTarget.offsetWidth/2)) newleft = window.innerWidth - event.currentTarget.offsetWidth/2;
    if (newtop > (window.innerHeight - event.currentTarget.offsetHeight/2)) newtop = window.innerHeight - event.currentTarget.offsetHeight/2;
    event.currentTarget.style.left = `${newleft}px`
    event.currentTarget.style.top = `${newtop}px`
};

// DYNAMIC MENU ELEMENTS 
//
constants.guidebook.addEventListener("click" , (e)=> {
    if (guideBookToggle){
        e.target.style.backgroundPosition  = "100px 50px"
        constants.menu.style.width = "0%";
        constants.menu.style.overflow = "hidden";
        guideBookToggle = false;
    }
    else {
        e.target.style.backgroundPosition  = "50px 50px"
        constants.menu.style.width = "100%";
        constants.menu.style.overflow = "visible";
        guideBookToggle = true;
    }
})
// CHANGE  MANAGEMENT

const statChange = (event) => {
    if(isUpdatingFromServer > 0 )return;
    const eType = event.target.type;
    if (sidebarEvents.includes(eType)) {
        constants.socket.emit('update', {
        table: 'stats',
        name: event.target.name,
        type: event.target.type,
        value: (eType == 'checkbox') ? event.target.checked.toString() :  event.target.value
        });
    }
}
constants.sidebar.addEventListener('change', statChange);
constants.assets.addEventListener('change', statChange);

motherEventFactory(constants.menu, 'click', '.openTab', (input, event)=> {
    const tab = document.getElementById(input.dataset.toggle);
    if (!tab) return;
    displayToggle(tab);

});
const entryAdd  = (input, event)=> {
    const contain = input.closest('.Contain');
    console.log(contain)
    const addItem = contain.querySelector(`#${contain.dataset.contain}`);
    const result = formatAddTable[addItem.dataset.tabletype](addItem);
    constants.socket.emit('create', result);
}

motherEventFactory(constants.sidebar ,'click', '.tabIcon', entryAdd )
motherEventFactory(constants.assets ,'click', '.tabIcon', entryAdd )
motherEventFactory(constants.characters ,'click', '.tabIcon', entryAdd )
function displayToggle(element) {
    if(!element) return;
    if (element.style.display == ''){ // '' is equivalent to display none. Browser defines none as an empty string, at least that's what I think it does.
        element.style.display = 'flex';
        tablists.append(element);
        caltab()
    }
    else {
        element.style.display = ''
        tablists.popNode(element.__nodeRef.element);
    }
}
function caltab () {
    let temp = tablists.head;
    let count = 10;
    while (temp != null){
        temp.element.style.zIndex = count;
        count+=1;
        temp = temp.next;
    }
};

motherEventFactory(document, 'dblclick' ,'[data-editable]', (editable,event ) => {
    // You know there is a bug here. Fix before deployment
    startEditing(editable, editable.dataset.editable);
})
// the constants.socket on 
constants.socket.on('connect', () => {
    let check = localStorage.getItem('time') || 0;
    constants.socket.emit('checkSync', check);
});
constants.socket.on('create', (create)=> {
    isUpdatingFromServer++;
    loadOperator(create);
    isUpdatingFromServer--;
});
constants.socket.on('update', (update)=> {
    isUpdatingFromServer++;
    updateOperator(update);
    isUpdatingFromServer--;
});
constants.socket.on('delete', (deleted)=> {
    isUpdatingFromServer++;
    deleteOperation([deleted]);
    isUpdatingFromServer--;
});
constants.socket.on('checkSync', (check)=>{
    storeNewRows(check);
});

loadTables()
