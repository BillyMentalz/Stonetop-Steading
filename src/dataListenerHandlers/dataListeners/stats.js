import {socket,  isUpdatingFromServerState} from 'root/document.js'
const sidebarEvents = ['radio' , 'select-one', 'number', 'checkbox'];
const statChange = [
    'change',
    (element, event) => {
        if (isUpdatingFromServerState.check()) return; 
        const eType = event.target.type;
        if (sidebarEvents.includes(eType)) {
            socket.emit('update', {
            table: 'stats',
            statName: event.target.name,
            statType: event.target.type,
            statValue: (eType == 'checkbox') ? event.target.checked.toString() :  event.target.value
            });
        }
    }

];


export {
    statChange
}
