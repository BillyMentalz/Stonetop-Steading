import {graphNode } from '../document.js'
import { markerNode } from './markersHandler.js'; 
import { statNode } from './data/statsHandler.js'
import { listNode } from './data/listsHandler.js'
import { characterNode  } from './charactersHandler.js';
import { locationNode } from './locationsHandler.js'; 
import { homeNode } from './data/homesHandler.js'

const graphNodeList = {
    'homes':  homeNode,
    'markers': markerNode,
    'characters': characterNode, 
    'locations': locationNode,
    'stats': statNode,
    'lists': listNode, 
}

const classLoadTables = ()=> {
    for (const [key, operator] of Object.entries(graphNodeList)) {
        const payload = JSON.parse(localStorage.getItem(key)) || {};
        operator.table = payload;
        for (const [id, row] of Object.entries(payload)) {
            operator.createOperator(id, row); 
        }
    }
}

const storeNewRows = (check) => {
    for (const [key, value] in Object.entries(check)) {
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
            for ( const row in value) {
                const index  = operator.makeIndex(row);
                if(operator.table !== null) {
                    operator.updateRow(row);
                }
                else {
                    operator.createRow(row);
                }
            }
        }
    }
}



export {
    classLoadTables
    storeNewRows
    graphNodeList
};
