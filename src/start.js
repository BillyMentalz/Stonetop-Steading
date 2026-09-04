import {storeNewRows, dataHandlers , graphNodeList , saveData } from './dataHandler/syncHandler.js'
import { dataListenerHandler} from './dataListenerHandlers/dataListenerHandler.js'
import { isUpdatingFromServerState} from './document.js'
import { socket } from './document.js'
//import { dataEntryPointPreparation} from './entryPoints/entryPoints.js'
//
// Start Loading them first. Remember to add pre-loading for 
// evenutally add more 
dataHandlers();
dataListenerHandler();

// the socket on 
socket.on('connect', () => {
    let check = localStorage.getItem('time') || 0;
    socket.emit('checkSync', check);
});
socket.on('create', (create)=> {
    graphNodeList[create.table].createRow(create.result);
});
socket.on('update', (update)=> {
    isUpdatingFromServerState.stepUp();
    console.log(update.table);
    graphNodeList[update.table].updateRow(update.result);
    isUpdatingFromServerState.stepDown();
});
socket.on('delete', (deleted)=> {
    graphNodeList[deleted.tableName].deleteRow(deleted.deletedItem);
});
socket.on('checkSync', (check)=>{
    storeNewRows(check);
});

document.addEventListener('visibilitychange', ()=> {
    if (document.visibilityState === 'hidden') {
        console.log("Ending session, saving data locally")
        saveData()
    }
})




