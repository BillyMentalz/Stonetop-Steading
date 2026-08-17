var indicatorDragMap = new Map();

const eventFactory = [
    (parent, handling ) =>  {
        parent.addEventListener(handling.event , (e)=> {
            const element = e.target.closest(handling.selector);
            if (!element) return;
            handling.funk(element, e);
        })
    },
    (parent, mEvent, selector, handler)=> {
    parent.addEventListener(mEvent, (e)=> {
        const element = e.target.closest(selector);
        if(!element) return;
        handler(parent, element, e);
    })
}

]

function motherEventFactory(parent, mEvent , selector , handler) =>  {
    parent.addEventListener(mEvent , (e)=> {
        const element = e.target.closest(selector);
        if (!element) return;
        handler(element, e);
    })
}

function eventWithParentFactory(parent, mEvent, selector, handler) {
    parent.addEventListener(mEvent, (e)=> {
        const element = e.target.closest(selector);
        if(!element) return;
        handler(parent, element, e);
    })
}

function eventWithParentFactory(parent, mEvent, selector, handler) {
    parent.addEventListener(mEvent, (e)=> {
        const element = e.target.closest(selector);
        if(!element) return;
        handler(element);
    })
}


function individualAddAll(parent) {

}

const allDataContainers = document.querySelectorAll('[data-container]')
const mostEvents = {
    'homes':[],
    'stats':[],
    'lists':[],
    'characters':[],
    'locations':[],
    'markers': [
        {
            function:'defaultFactory',
            event:'mousedown',
            eventlet:'.draggable',
            function: (draggable,e)=> {
                let dragHandler = (e) => drags(constants.map ,e);
                draggable.addEventListener('mousemove', dragHandler)
                indicatorDragMap.set(draggable, dragHandler);
            }
        },
        {
            function:'defaultFactory',
            event:'mouseup',
            eventlet:'.draggable',
        }],
}



const attachAllListeners = () => {
    allDataContainers.forEach(dataContainer=> {
        dataContainer.dataset.container
    });
}
