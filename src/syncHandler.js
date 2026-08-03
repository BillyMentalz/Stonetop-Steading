import { homesOperator, homesUpdateOperator, homesDeleteOperator} from './dataHandler/homesHandler.js';
import { statsOperator } from './dataHandler/statsHandler.js';
import { listsOperator, listsUpdateOperator, listsDeleteOperator} from './dataHandler/listsHandler.js';
/*
import { charactersSync } from './dataHandler/characterssHandler.js';
import { locationsSync } from './dataHandler/locationsHandler.js'; */
//import { markersOperator, markersUpdateOperator, markersDeleteOperator } from './dataHandler/markersHandler.js'; 
import {updateIndicate} from './animation.js';

const loadTable = {
   'homes': homesOperator,
   'stats': statsOperator,
   'lists': listsOperator
//    'characters': charactersSync, 
//   'locations': locationsSync,
//    'markers': markersSync 
}

const updateTable = {
    'homes': homesUpdateOperator,
    'stats': statsOperator,
    'lists': listsUpdateOperator, 
    //'characters': 
    //'locations': 
    //'markers': 
}

const deleteTable = {
    'homes': homesDeleteOperator,
    //'stats': statsOperator,
    'lists': listsDeleteOperator,
    // 'characters'
    // 'locations'
    // 'markers'
}

const loadOperator = (create) => {
    console.log(create);
    const [key, value] = Object.entries(create)[0];
    localStorage.setItem('time', value.latestModified);
    const sum = convertRow(convertTable[key], value);
    const log = JSON.parse(localStorage.getItem(key));
    const element = loadTable[key](sum.index, sum.row);
    log[sum.index] = sum.row;
    localStorage.setItem(key,JSON.stringify(log));
    updateIndicate(element);
    
}

const updateOperator = (update) => {
    const [key, value] = Object.entries(update)[0];
    localStorage.setItem('time', value.latestModified);
    const sum = convertRow(convertTable[key], value);
    const log = JSON.parse(localStorage.getItem(key));
    const element = updateTable[key](sum.index, sum.row);
    log[sum.index] = sum.row;
    localStorage.setItem(key,JSON.stringify(log));
    updateIndicate(element);
}


const convertTable = {
    'homes': ['homeName'],
    'stats': ['statName'],
    'lists': ['listName', 'listOrder'],
    'characters':['characterId'],
    'locations':['locationHome', 'locationSignifier'],
    'markers': ['markerHome', 'markerSignifier', 'markerOrder']
}

// Loads everything 
const loadTables = ()=> {
    for (const [key, value] of Object.entries(loadTable)){
        const payload = JSON.parse(localStorage.getItem(key)) || {};
        for (const [key1, value1] of Object.entries(payload)) {
            value(key1, value1);
        }
    }
}

// Sync functions
const convertRow  = ( identifiers , row) => {
    let pendings = [];
    const unique = identifiers.map((identifier)=>{
        const element = row[identifier];
        delete row[identifier];
        return element;
    })
    const index = unique.join('/%/')
    return { index, row};
}

const storeNewRows = (check) => {
    for (const [key, value] of Object.entries(check)){
        if (key == 'deleteRecords') {
            deleteOperation(value);
        }
        else if ( key == 'time')  {
            localStorage.setItem(key, value)
        }
        else {
            var current = JSON.parse(localStorage.getItem(key))||{};
            value.forEach(row => {
                const add = convertRow(convertTable[key], row); 
                const action =  current.hasOwnProperty(add.index);
                const element = action ? updateTable[key](add.index,add.row) : loadTable[key](add.index, add.row);
                updateIndicate(element);
                current[add.index] = add.row;
            });
            localStorage.setItem(key, JSON.stringify(current));
        }
    }
}
const deleteOperation = (deletion) => {
    deletion.forEach(del => {
        let store = null;
        let marks = null;
        switch(del.tableName) {
            case 'homes':
                localStorage.clear()
                location.reload();
                break;
            // case 'stats': break;
            case 'location':
                // Holy who wrote this rewrite this later;
                store = JSON.parse(localStorage.getItem('location')) || {};
                marks = JSON.parse(localStorage.getItem('markers')) || {} ;
                let newmarks = {};
                for (const [key, value] of Object.entries(marks)) {
                    if (!key.startsWith(del.deletedItem)) {
                        newmarks[key] = value;
                    }
                    else {
                        delete store[deletion.deletedItem];
                    }
                }
                location.setItem('markers', JSON.stringify(newmarks));
                location.setItem('location', JSON.stringify(store));
                break;
            default: 
                store = JSON.parse(localStorage.getItem(del.tableName)) || {};
                delete store[del.deletedItem];
                deleteTable[del.tableName](del.deletedItem);
                localStorage.setItem(del.tableName, JSON.stringify(store));
                break;
        }
    });
}

export {
    storeNewRows,
    loadTables,
    loadOperator,
    updateOperator,
    deleteOperation
    };
