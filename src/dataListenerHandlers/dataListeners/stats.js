import {socket,  isUpdatingFromServerState} from 'root/document.js'
const sidebarEvents = ['radio' , 'select-one', 'number', 'checkbox'];
const statChange = [
    'change',
    (element, event) => {
        if (isUpdatingFromServerState.check()) return; 
        const eType = event.target.type;
        if (sidebarEvents.include(eType)) {
            socket.emit('update', {
            table: 'stats',
            name: event.target.name,
            type: event.target.type,
            value: (eType == 'checkbox') ? event.target.checked.toString() :  event.target.value
            });
        }
    }

];


export {
    statChange
}
