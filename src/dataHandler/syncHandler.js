import { markerNode } from './data/markersHandler.js'; 
import { statNode } from './data/statsHandler.js'
import { listNode } from './data/listsHandler.js'
import { characterNode  } from './data/charactersHandler.js';
import { locationNode } from './data/locationsHandler.js'; 
import { homeNode } from './data/homesHandler.js'

const graphNodeList = {
    'homes':  homeNode,
    'markers': markerNode,
    'characters': characterNode, 
    'locations': locationNode,
    'stats': statNode,
    'lists': listNode, 
}

const dataHandlers = ()=> {
    for (const [key, operator] of Object.entries(graphNodeList)) {
        const payload = JSON.parse(localStorage.getItem(key)) || {};
        operator.table = payload;
        for (const [id, row] of Object.entries(payload)) {
            operator.createOperator(id, row); 
        }
    }
}

const storeNewRows = (check) => {
    console.log(check)
    for (const [key, value] of Object.entries(check)) {
        console.log(key)
        console.log(value)
        if (key == 'deleteRecords') {
            for (const row in Object.entries(value)) {
                const operator = graphNodeList[row.tableName];
                operator.deleteRow(row.deletedItem);
            }
        }
        else if (key == 'time') {
            localStorage.setItem(key,value);
        }
        else {
            const operator = graphNodeList[key];
            for ( const row of value) {
                const index  = operator.makeIndex(row);
                console.log(index);
                if(operator.table[index] !== undefined) {
                    console.log(operator.table[index]);
                    operator.updateRow(row);
                }
                else {
                    operator.createRow(row);
                }
            }
        }
    }
}

const saveData  = ()=> {
    if (localStorage.getItem('test') == "true") return;
    for (const [key, operator] of Object.entries(graphNodeList)) {
        localStorage.setItem(key, JSON.stringify(operator.table));
    }
}

export {
    dataHandlers,
    storeNewRows,
    graphNodeList,
    saveData
};
