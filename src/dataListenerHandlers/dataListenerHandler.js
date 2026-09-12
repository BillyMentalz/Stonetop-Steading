import { homeForm } from './dataListeners/homes.js'
import { statChange } from './dataListeners/stats.js'
import { listCard } from './dataListeners/lists.js'
import { characterList} from './dataListeners/characters.js'
import { characterForm} from './dataListeners/characterCard.js';
import { locationAdd, locationEdit, locationSelect} from './dataListeners/locations.js'
import { markerAdd, markerEdit , markerSelect, mapDrag, mapSet  } from './dataListeners/markers.js'
import { menuCard, tabDrag,  modalHide } from './dataListeners/tabs.js'

const EventListenerRegistry = {
    'statChange': 		(parent)=> GenericEventFactory( parent, ...statChange),
    'homeForm':         (parent)=> EventContainerFactory(parent, homeForm),
    'listCard': 		(parent)=> EventContainerFactory(parent, listCard),
    'characterCard':    (parent)=> EventContainerFactory(parent, characterForm),
    'characterList':    (parent)=> EventContainerFactory(parent, characterList),
    'locationAdd': 		(parent)=> ContainerEventFactory(parent, ...locationAdd),
    'locationEdit': 	(parent)=> ContainerEventFactory(parent,... locationEdit),
    'locationSelect': 	(parent)=> ContainerEventFactory(parent, ...locationSelect),
    'markerAdd': 		(parent)=> ContainerEventFactory(parent, ...markerAdd),
    'markerEdit': 		(parent)=> ContainerEventFactory(parent,... markerEdit),
    'markerSelect': 	(parent)=> ContainerEventFactory(parent, ...markerSelect),
    'mapDrag': 			(parent)=> ContainerEventFactory(parent, ...mapDrag),
    'mapSet': 			(parent)=> ContainerEventFactory(parent, ...mapSet),
    'menuCard': 		(parent)=> EventContainerFactory(parent, menuCard),
    'tabDrag': 		    (parent)=> ContainerEventFactory(parent, ...tabDrag),
    'modalHide':        (parent)=> GenericEventFactory(parent, ...modalHide),
};

function ContainerEventFactory(parent, mEvent , selector , handler) {
    parent.addEventListener(mEvent , (e)=> {
        const element = e.target.closest(selector);
        if (!element) return;
        handler(parent, element, e);
    });
};

function GenericEventFactory( element, rEvent, handler) {
    element.addEventListener(rEvent, (e)=> {
        handler(element,e);
    })
}

function EventContainerFactory(element, container) {
    for (const [eventName, actions] of Object.entries(container)) {
        element.addEventListener(eventName , (e)=> {
            const button = e.target.closest(`[data-${eventName}]`); 
            if (!button ) return;
            const handler = actions[button.dataset[eventName]];
            if (!handler) { console.log(`action ${button.dataset[eventName]} doesn't exist! Please add`); return;}
            handler(button, e);
        })
    }
}

const dataListenerHandler = ()=> {
    const entryPoints = document.querySelectorAll('[data-listener]')    
    entryPoints.forEach(entryPoint => {
        const eventListeners = entryPoint.dataset.listener.split(' ');
        eventListeners.forEach(eventListener => {
            EventListenerRegistry[eventListener](entryPoint);
        })
    })
}

export {
    dataListenerHandler
}


