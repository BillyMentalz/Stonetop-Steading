import {socket, addBoxTemplate} from 'root/document.js'
var indicatorDragMap = new Map();
function drags(box , event) {// This is for sharable indicators
    let boundaries =  box.getBoundingClientRect();
    let newleft = ((event.clientX - event.currentTarget.offsetWidth/2) - boundaries.left)/box.offsetWidth*100;
    let newtop = ((event.clientY - event.currentTarget.offsetHeight/2) - boundaries.top)/box.offsetHeight*100;
    if (newleft < -5) newleft = -5;
    if (newleft > 97.5) newleft = 97.5;
    if (newtop < -5) newtop = -5;
    if (newtop > 95) newtop = 95;
    event.currentTarget.style.left = `${newleft}%`;
    event.currentTarget.style.top = `${newtop}%`;
}; 

const mapDrag = [
    'mousedown',
    '.draggable',
    (parent, element, event) => {
        const dragHandler = (e) => drags(parent, e)
        element.addEventListener("mousemove", dragHandler)
        indicatorDragMap.set(element, dragHandler)
    }
]

const mapSet = [
    'mouseup',
    '.draggable',
    (parent, element, event) => {
        for ( const [key, value] of indicatorDragMap) {
            key.removeEventListener('mousemove', value);
            const info = key.__rowReference;
            socket.emit('update', {
                table:'markers',
                home: info.markerHome,
                id: info.markerId, 
                order: info.markerOrder,
                markerSignifier: info.markerSignifier,
                x: key.style.left,
                y: key.style.top
                }
            )
            indicatorDragMap.delete(key);
        }
    }
]

const markerAdd = [
    'click',
    '.tabIcon',
    (parent, element, event)=> {
    socket.emit('create', {
                table:'markers',
                markHome: "temp",
                markerId: "temp",
                markerOrder: "Temp",
                markerSignifier: "A",
                markerX: "50",
                markerY: "50"
        }
    )}
]

const markerEdit = [
    'dblclick',
    '.meaningless',
    (parent,element, event) => {
        console.log("Tihihih");
    }

]

const markerSelect = [
    'dblclick',
    '.unmeaning',
    (parent, element, event) => {
        console.log("htihigheiogeij")
    }

]


export {
    mapDrag,
    mapSet,
    markerAdd,
    markerEdit,
    markerSelect
}
