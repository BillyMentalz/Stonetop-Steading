import {graphNode } from '../document.js'
import { homesOperator, homesUpdateOperator, homesDeleteOperator} from './homesHandler.js';
import { statsOperator,statsUpdateOperator, statsDeleteOperator} from './statsHandler.js';
import { listsOperator, listsUpdateOperator, listsDeleteOperator} from './listsHandler.js';
import {  charactersOperator, charactersUpdateOperator, charactersDeleteOperator } from './charactersHandler.js';
import { locationsOperator , locationsUpdateOperator, locationsDeleteOperator } from './locationsHandler.js'; 
import { markersOperator, markersUpdateOperator, markersDeleteOperator } from './markersHandler.js'; 

const markerNode = graphNode('markers', ['markerHome', 'markerId', 'markerOrder'], [], markersOperator, markersUpdateOperator, markersDeleteOperator);
const locationNode = graphNode('locations', [['locationHome'], 'locationId'], [markerNode] , locationsOperator, locationsUpdateOperator, locationsDeleteOperator);
const characterNode = graphNode('characters', ['characterId'], [] , charactersOperator, charactersUpdateOperator, charactersDeleteOperator);
const listNode = graphNode('lists', [['listName'], 'listOrder'] ,[]  , listsOperator, listsUpdateOperator, listsDeleteOperator );
const statNode = graphNode('stats', ['statName'], [], statsOperator, statsOperator, statsOperator);
const homeNode = graphNode('homes', ['homeName'], [characterNode , locationNode ], homesOperator, homesUpdateOperator, homesDeleteOperator);
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



export {
    };
