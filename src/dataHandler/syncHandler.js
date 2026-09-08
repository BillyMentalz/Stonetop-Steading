import { markerNode } from './data/markersHandler.js'; 
import { statNode } from './data/statsHandler.js'
import { listNode } from './data/listsHandler.js'
import { characterNode  } from './data/charactersHandler.js';
import { locationNode } from './data/locationsHandler.js'; 
import { homeNode } from './data/homesHandler.js'
import { makeIndex } from 'root/document.js'

const graphNodeList = {
    'homes':  homeNode,
    'markers': markerNode,
    'characters': characterNode, 
    'locations': locationNode,
    'stats': statNode,
    'lists': listNode, 
};

const dataHandlers = ()=> {
    for (const [key, operator] of Object.entries(graphNodeList)) {
        const payload = JSON.parse(localStorage.getItem(key)) || {};
        operator.table = payload;
        for (const [id, row] of Object.entries(payload)) {
            const element = operator.createRow(row); 
            element.__rowReference = row;
            row.element = element;
        }
    }
}

const storeNewRows = (check) => {
    for (const [key, value] of Object.entries(check)) {
        if (key == 'deleteRecords') {
            for (const row of value) {
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
                const index  = makeIndex(operator.identifiers,row);
                if(operator.table[index] !== undefined) {
                    const final = {
                    prev: {},
                    next: {}
                    };
                    for (const [key, value] of Object.entries(row)) {
                        if (operator.table[index][key] !== value) {
                            final.prev[key] = operator.table[index][key];
                            final.next[key] = value;
                        }
                    }
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
    for (const [key, operator] of Object.entries(graphNodeList)) {
        const obj = {};
        for (const [index, row] of Object.entries(operator.table)){
            const newRow = {};
            for ( const [item, value] of Object.entries(row)) {
                if ( typeof value !== "object" || value === null) {
                    newRow[item] = value;
                }
            }
            obj[index] = newRow;
        }
        localStorage.setItem(key, JSON.stringify(obj));
    }
}

export {
    dataHandlers,
    storeNewRows,
    graphNodeList,
    saveData
};
