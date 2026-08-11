import { homesOperator, homesUpdateOperator, homesDeleteOperator} from './dataHandler/homesHandler.js';
import { statsOperator } from './dataHandler/statsHandler.js';
import { listsOperator, listsUpdateOperator, listsDeleteOperator} from './dataHandler/listsHandler.js';
import {  charactersOperator, charactersUpdateOperator, charactersDeleteOperator } from './dataHandler/charactersHandler.js';
/*
import { locationsSync } from './dataHandler/locationsHandler.js'; */
//import { markersOperator, markersUpdateOperator, markersDeleteOperator } from './dataHandler/markersHandler.js'; 
import {updateIndicate} from './animation.js';

class graphNode {
    constructor(name , identifiers, children, createOperator, updateOperator, deleteOperator ) {
        this.name = name;
        this.identifiers = identifiers; 
        this.table = {};
        this.children = children;
        this.createOperator = createOperator;
        this.updateOperator = updateOperator;
        this.deleteOperator = deleteOperator;
    }
    convertRow (row) {
        const formattedRow = this.identifiers.map((item)=> {
            const element = row[item];
            delete row[item];
            return element;
        }) 
        const index = formattedRow.join('/%/');
        return{index, row}
    };
    createRow(value) { // Remember to add wrappers on Deparsing and Time 
        const formattedRow = this.convertRow(value);
        const element = this.createOperator(formattedRow.index, formattedRow.row);
        this.table[formattedRow.index] = formattedRow.row;
        updateIndicate(element);    
    }
    updateRow(value) {
        const formattedRow = this.convertRow(value);
        const element = this.updateOperator(formattedRow.index, formattedRow.row);
        this.table[formattedRow.index] = formattedRow.row;
        updateIndicate(element);
        for (const thing of this.cascade) {
            thing.updateCascade(formattedRow.index, formattedRow.row)
        }
    };
    updateCascade(id, row){
        for ( const [key, value] of Object.entries(this.table)) {
            if (key.startsWith(id)) {
                for( const [subkey, subvalue] of Object.entries(row)){
                    value[subkey] = row[subkey]; /// This is VERY incomplete
                }
                const element = this.updateOperator({index:key , row:value});
                updateIndicate(element);
            }
        }
    };
    deleteRow(deletedItem) {
        delete this.table[deletedItem];
        this.deleteOperator(deletedItem);
        for ( const thing of this.cascade ){
            thing.deleteCascade(deletedItem);
        }
        
    };
    deleteCascade(id){
        for ( const [key, value] of Object.entries(this.table)){
            if (key.startsWith(id)) {
                this.deleteRow(key);
            }
        }
    };
    
}

const markerNode = graphNode('markers', ['markerHome', 'markerId', 'markerOrder'], {}, markersOperator, markersUpdateOperator, markersDeleteOperator);
const locationNode = graphNode('locations', ['locationHome', 'locationId'], {markerNode} , locationsOperator, locationsUpdateOperator, locationsDeleteOperator);
const characterNode = graphNode('characters', ['characterId'], {} , charactersOperator, charactersUpdateOperator, charactersDeleteOperator);
const listNode = graphNode('lists', ['listName', 'listOrder'] , {} , listsOperator, listsUpdateOperator, listsDeleteOperator );
const statNode = graphNode('stats', ['statName'], {}, statsOperator, statsOperator, statsOperator);
const homeNode = graphNode('homes', ['homeName'], {characterNode , locationNode }, homesOperator, homesUpdateOperator, homesDeleteOperator);


const classLoadTable = {
    'homes':  homeNode,
    'stats': statNode,
    'lists': listNode, 
    'characters': characterNode, 
    'locations': locationNode,
    'markers': markerNode
}

const classLoadTables = ()=> {
    for (const [key, operator] of Object.entries(classLoadTable)) {
        const payload = JSON.parse(localStorage.getItem(key)) || {};
        operator.table = payload;
        for (const [id, row] of Object.entries(payload)) {
            operator.createOperator(id, row);
        }
    }
}

const storeNewRowsByClass = (check) => {
    for (const [key, value] of Object.entries(check)) {
        if (key == 'deleteRecords') {
            deleteOperation(value);
        }
        else if (key == 'time') {
            localStorage.setItem(key,value);
        }
        else {
            
        }
    }
}

const loadTable = {
   'homes': homesOperator,
   'stats': statsOperator,
   'lists': listsOperator,
   'characters': charactersOperator, 
//   'locations': locationsSync,
//    'markers': markersSync 
}

const updateTable = {
    'homes': homesUpdateOperator,
    'stats': statsOperator,
    'lists': listsUpdateOperator, 
    'characters': charactersUpdateOperator, 
    //'locations': 
    //'markers': 
}

const deleteTable = {
    'homes': homesDeleteOperator,
    //'stats': statsOperator,
    'lists': listsDeleteOperator,
    'characters': charactersDeleteOperator,
    // 'locations'
    // 'markers'
}

const loadOperator = (create) => {
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
    console.log(update);
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
        localStorage.setItem('time', del.deletedAt);
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
