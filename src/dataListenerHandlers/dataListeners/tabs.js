import { LinkedList  } from 'root/document.js'
import {} from 'root/injects/lists.js'
const tablists = new LinkedList();
const tabDragMap = new Map();

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
};

function drags(event) {
    let newleft = event.clientX;
    let newtop =  event.clientY;
    if (newleft < event.currentTarget.offsetWidth/2 ) newleft = event.currentTarget.offsetWidth/2;
    if (newtop < event.currentTarget.offsetHeight/2 ) newtop = event.currentTarget.offsetHeight/2;
    if (newleft > (window.innerWidth - event.currentTarget.offsetWidth/2)) newleft = window.innerWidth - event.currentTarget.offsetWidth/2;
    if (newtop > (window.innerWidth - event.currentTarget.offsetHeight/2)) newtop = window.innerHeight - event.currentTarget.offsetHeight/2;
    event.currentTarget.style.left = `${newleft}px`;
    event.currentTarget.style.top = `${newtop}px`;
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

const menuToggle = [
    'click',
    '#guide',
    (parent,element, event) => {
        const menuElement = parent.querySelector('#menu')
        if (menuElement.style.width == "100%") {
            event.target.style.backgroundPosition  = "100px 50px"
            menuElement.style.width = "0%";
            menuElement.style.overflow = "hidden";
        }
        else {
            event.target.style.backgroundPosition  = "50px 50px"
            menuElement.style.width = "100%";
            menuElement.style.overflow = "visible";
        }
    }
]

const tabToggle = [
    'click',
    '.openTab',
    (parent, element, event)=> {
        const tab = document.getElementById(element.dataset.toggle);
        if (!tab) return;
        displayToggle(tab)
    }
]

const tabDrag = [
    'mousedown',
    '.tabs',
    (parent, element, event) => {
        tablists.popNode(element.__nodeRef);
        tablists.append(element);
        caltab()
        const dragHandler = (event) => drags(event)
        element.addEventListener("mousemove", dragHandler)
        tabDragMap.set(element, dragHandler);
    }
]

const tabSet = [
    'mouseup',
    '.tabs',
    (parent, element, event)=> {
        for (const [key, value] of tabDragMap) {
            key.removeEventListener('mousemove', value);
        }
    }
]

const modalHide = [
    'click',
    (parent, event)=> {
        if (event.target == parent){
            parent.style.display = "";
        }
    }
]

export {
    menuToggle,
    tabToggle,
    tabDrag,
    tabSet,
    modalHide
}

