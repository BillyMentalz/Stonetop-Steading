import {storeNewRows, loadTables ,loadOperator, updateOperator, deleteOperation } from './syncHandler.js'
import { startEditing } from './editHandler.js';
const socket = io();
const templates = document.getElementById('templates')
const sidebar = document.getElementById("sidebar");
const guide = document.getElementById("guide");

let isUpdatingFromServer = 0;

var buffer = {};

//Notifying function

// CREATING ELEMENTS THAT CAN BE DRAGGED
const space = document.querySelector("#town");
let draggables = document.querySelectorAll(".indicators");
function drags(event) {
    let boundaries =  space.getBoundingClientRect();
    let newleft = ((event.clientX - event.currentTarget.offsetWidth/2) - boundaries.left)/space.offsetWidth*100;
    let newtop = ((event.clientY - event.currentTarget.offsetHeight/2) - boundaries.top)/space.offsetHeight*100;
    if (newleft < -5) newleft = -5;
    if (newleft > 97.5) newleft = 97.5;
    if (newtop < -5) newtop = -5;
    if (newtop >95) newtop = 95;
    event.currentTarget.style.left = `${newleft}%`;
    event.currentTarget.style.top = `${newtop}%`;
} 

draggables.forEach((element) => {
    element.addEventListener("mousedown", ()=> {
        element.addEventListener("mousemove", drags)
    })   
    element.addEventListener("mouseup", ()=> {
        element.removeEventListener("mousemove",drags);
        socket.emit('markerChange', {
            id: element.id,
            left: element.style.left,
            top: element.style.top
        })
    })
});
// DYNAMIC MENU ELEMENTS 
//
const guidebook = document.querySelector('#guide');
const menu = document.querySelector('#menu');
var menuToggle = false;
guidebook.addEventListener("click" , (e)=> {
    if (menuToggle){
        e.target.style.backgroundPosition  = "100px 50px"
        menu.style.width = "0%";
        menu.style.overflow = "hidden";
        menuToggle = false;
    }
    else {
        e.target.style.backgroundPosition  = "50px 50px"
        menu.style.width = "100%";
        menu.style.overflow = "visible";
        menuToggle = true;
    }
})




// CHANGE  MANAGEMENT
const sidebarEvents = ['radio' , 'select-one', 'number'];
sidebar.addEventListener('change', (event) => {
    if(isUpdatingFromServer > 0 )return;
    const eType = event.target.type;
    if (sidebarEvents.includes(eType)) {
        socket.emit('update', {
        table: 'stats',
        name: event.target.name,
        type: event.target.type,
        value: event.target.value
        });
    }
    else if (eType == 'checkbox'){
        console.log(event.target.checked.toString())
        socket.emit('update', {
            table:'stats',
            name: event.target.name,
            type: event.target.type,
            value: event.target.checked.toString()
        })
    }
});

document.addEventListener('dblclick', (e)=> {
    const editable = e.target.closest('[data-editable]');
    if (!editable) return;
    startEditing(socket, editable, editable.dataset.editable);
    });
/*message = "Delete list item?\nItem:" + event.target.textContent;
        if (confirm(message)){
            socket.emit('textChange' , {
                changeType: 'Delete',
                id:event.target.id, 
                text: "" 
            })
            event.target.remove();
        } */


// the socket on 
loadTables()

socket.on('connect', () => {
    let check = localStorage.getItem('time') || 0;
    socket.emit('checkSync', check);
});
socket.on('create', (create)=> {
    isUpdatingFromServer++;
    loadOperator(create);
    isUpdatingFromServer--;
});
socket.on('update', (update)=> {
    isUpdatingFromServer++;
    updateOperator(update);
    isUpdatingFromServer--;
})
socket.on('delete', (deleted)=> {
    isUpdatingFromServer++;
    console.log(deleted);
    deleteOperation([deleted]);
    isUpdatingFromServer--;
})
socket.on('checkSync', (check)=>{
    storeNewRows(check);
})

/*
    e.target.style.background-position =  50px 50px; 
    const bars = e.target.querySelectorAll("h2");
    bars.forEach(element => {
        element.target.style.width = 10rem;
    });
    */
