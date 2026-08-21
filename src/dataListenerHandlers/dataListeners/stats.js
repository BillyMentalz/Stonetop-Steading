import {socket,  isUpdatingFromServer} from 'root/document.js'
const sidebarEvents = ['radio' , 'select-one', 'number', 'checkbox'];
const statChange = (event) => {
    if(isUpdatingFromServer > 0 )return;
    const eType = event.target.type;
    if (sidebarEvents.includes(eType)) {
        socket.emit('update', {
        table: 'stats',
        name: event.target.name,
        type: event.target.type,
        value: (eType == 'checkbox') ? event.target.checked.toString() :  event.target.value
        });
    }
}

