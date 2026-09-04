import { homeAdd, homeDelete} from './dataListeners/homes.js'
import { statChange } from './dataListeners/stats.js'
import { listAdd, listEdit } from './dataListeners/lists.js'
import { characterAdd,  characterSelect, characterFilterAndSort} from './dataListeners/characters.js'
import { characterFormClicker, characterFormChanger} from './dataListeners/characterCard.js';
import { locationAdd, locationEdit, locationSelect} from './dataListeners/locations.js'
import { markerAdd, markerEdit , markerSelect, mapDrag, mapSet  } from './dataListeners/markers.js'
import { tabToggle, menuToggle, tabDrag, tabSet, modalHide } from './dataListeners/tabs.js'

const EventListenerRegistry = {
    'homeAdd':          (parent)=> ContainerEventFactory(parent, ...homeAdd),
    'homeDelete':       (parent)=> ContainerEventFactory(parent, ...homeDelete),
    'statChange': 		(parent)=> GenericEventFactory( parent, ...statChange),
    'listAdd': 			(parent)=> ContainerEventFactory(parent, ...listAdd),
    'listEdit': 		(parent)=> ContainerEventFactory(parent, ...listEdit),
    'characterCard':    (parent)=> ClickContainerFactory(parent, characterFormClicker),
    'characterChange':  (parent)=> ClickContainerFactory(parent, characterFormChanger),
    'characterAdd': 	(parent)=> ContainerEventFactory(parent, ...characterAdd),
    'characterSelect': 	(parent)=> ContainerEventFactory(parent, ...characterSelect),
    'characterArrange': (parent)=> ContainerEventFactory(parent, ...characterFilterAndSort),
    'locationAdd': 		(parent)=> ContainerEventFactory(parent, ...locationAdd),
    'locationEdit': 	(parent)=> ContainerEventFactory(parent,... locationEdit),
    'locationSelect': 	(parent)=> ContainerEventFactory(parent, ...locationSelect),
    'markerAdd': 		(parent)=> ContainerEventFactory(parent, ...markerAdd),
    'markerEdit': 		(parent)=> ContainerEventFactory(parent,... markerEdit),
    'markerSelect': 	(parent)=> ContainerEventFactory(parent, ...markerSelect),
    'mapDrag': 			(parent)=> ContainerEventFactory(parent, ...mapDrag),
    'mapSet': 			(parent)=> ContainerEventFactory(parent, ...mapSet),
    'tabToggle': 		(parent)=> ContainerEventFactory(parent, ...tabToggle),
    'menuToggle': 		(parent)=> ContainerEventFactory(parent, ...menuToggle),
    'tabDrag': 		    (parent)=> ContainerEventFactory(parent, ...tabDrag),
    'tabSet': 		    (parent)=> ContainerEventFactory(parent, ...tabSet),
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

function ClickContainerFactory( element, clicker) {
    const {eventName, actions} = clicker; 
    element.addEventListener(eventName , (e)=> {
        console.log(eventName);
        const button = e.target.closest('[data-action]');
        console.log(button);
        if (!button ) return;
        const handler = actions[button.dataset.action];
        if (!handler) { console.log(`action ${button.dataset.action} doesn't exist! Please add`); return;}
        handler(element, button, e);
    })
    
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


