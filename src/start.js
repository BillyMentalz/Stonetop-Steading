import {storeNewRows, dataHandlers , graphNodeList } from './dataHandler/syncHandler.js'
import { dataListenerHandler} from './dataListenerHandlers/dataListenerHandler.js'
import { dataEntryPointHandler} from './data'
import {socket } from './document.js'
// Start Loading them first. Remember to add pre-loading for 
dataHandlers();
dataEntryPointHandler();
dataListenerHandler();

var isUpdatingFromServer = 0;

// CHANGE  MANAGEMENT
// the socket on 
socket.on('connect', () => {
    let check = localStorage.getItem('time') || 0;
    socket.emit('checkSync', check);
});
socket.on('create', (create)=> {
    isUpdatingFromServer++;
    graphNodeList[create.table].createRow(create.result);
    isUpdatingFromServer--;
});
socket.on('update', (update)=> {
    isUpdatingFromServer++;
    graphNodeList[update.table].updateRow(update.result);
    isUpdatingFromServer--;
});
socket.on('delete', (deleted)=> {
    isUpdatingFromServer++;
    graphNodeList[deleted.tableName].deleteRow(deleted.deletedItem);
    isUpdatingFromServer--;
});
socket.on('checkSync', (check)=>{
    storeNewRows(check);
});






