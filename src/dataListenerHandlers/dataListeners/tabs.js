import { LinkedList  } from 'root/document.js'
import {} from 'root/injects/lists.js'
const tablists = new LinkedList();

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
    (parent, event) => {
        if (parent.style.width == "0%") {
            event.target.style.backgroundPosition  = "100px 50px"
            parent.style.width = "0%";
            parent.style.overflow = "hidden";
        }
        else {
            event.target.style.backgroundPosition  = "50px 50px"
            parent.style.width = "100%";
            parent.style.overflow = "visible";
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
    (parent, element, event)=> {
        tablists.popNode(element.__nodeRef);
        tablists.append(element);
        caltab()
        element.addEventListener ("mousemove", tabDrag)
    }
]

const tabSet = [
    'mouseup',
    '.tabs',
    (parent, element, event)=> {
        element.removeEventListener("mouseup", tabDrag)
    }
]


export {
    menuToggle,
    tabToggle,
    tabDrag,
    tabSet
}

