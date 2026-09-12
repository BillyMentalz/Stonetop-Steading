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

function drags(event, offsetX, offsetY) {
    let newleft = event.pageX - offsetX;
    let newtop =  event.pageY - offsetY;
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


const menuToggle = (element, event) => {
        const menuElement = event.currentTarget.querySelector('#menu')
        if (menuElement.style.width == "100%") {
            event.target.style.backgroundPosition  = "100px 50px"
            menuElement.style.width = "1%";
            menuElement.style.overflow = "hidden";
        }
        else {
            event.target.style.backgroundPosition  = "50px 50px"
            menuElement.style.width = "100%";
        }
    }


const tabToggle = (element, event)=> {
        const tab = document.getElementById(element.dataset.toggle);
        if (!tab) return;
        displayToggle(tab)
    }

const tabDrag = [
    'mousedown',
    '.tabs',
    (parent, element, event) => {
        tablists.popNode(element.__nodeRef);
        tablists.append(element);
        caltab()
        const offsetX = event.clientX - element.offsetLeft;
        const offsetY = event.clientY - element.offsetTop;
        const dragHandler = (moveEvent) => drags(moveEvent, offsetX, offsetY)
        element.addEventListener("mousemove", dragHandler)
        const cleanup = ()=> {
            element.removeEventListener('mousemove', dragHandler);
            document.removeEventListener('mouseup', cleanup);
        }
        document.addEventListener('mouseup', cleanup);
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
const menuCard = {
    'click': { 
        'MenuToggle': menuToggle,
        'TabToggle': tabToggle
    }
}
export {
    menuCard,
    tabDrag,
    modalHide
}

