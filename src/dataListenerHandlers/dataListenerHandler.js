import { homeAdd, homeDelete} from './dataListeners/homes.js'
import { statChange } from './dataListeners/stats.js'
import { listAdd, listEdit } from './dataListeners/lists.js'
import { characterAdd, characterEdit, characterSelect, characterFilterAndSort} from './dataListeners/characters.js'
import { locationAdd, locationEdit, locationSelect} from './dataListeners/locations.js'
import { markerAdd, markerEdit , markerSelect, mapDrag, mapSet  } from './dataListeners/markers.js'
import { tabToggle, menuToggle, tabDrag, tabSet } from './dataListeners/tabs.js'

const EventListenerRegistry = {
    'homeAdd':          (parent)=> ContainerEventFactory(parent, ...homeAdd),
    'homeDelete':       (parent)=> ContainerEventFactory(parent, ...homeDelete),
    'statChange': 		(parent)=> GenericEventFactory( parent, ...statChange),
    'listAdd': 			(parent)=> ContainerEventFactory(parent, ...listAdd),
    'listEdit': 		(parent)=> ContainerEventFactory(parent, ...listEdit),
    'characterAdd': 	(parent)=> ContainerEventFactory(parent, ...characterAdd),
    'characterEdit': 	(parent)=> ContainerEventFactory(parent, ...characterEdit),
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
    'menuToggle': 		(parent)=> GenericEventFactory(parent, ...menuToggle),
    'tabDrag': 		    (parent)=> ContainerEventFactory(parent, ...tabDrag),
    'tabSet': 		    (parent)=> ContainerEventFactory(parent, ...tabSet),
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
/*
const addListeners = (element)=> {
    const thing = element.dataset.listener.split(' ') 
    thing.forEach( thinglet => {
        EventListenerRegistry[thing](element);
        element.addEventListener(thinglet.event, (e)=> thinglet.operator)
    })
}
*/
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


