import {characterRow } from 'root/injects/characters.js' 
import {graphNode} from 'root/document.js'
import { markerNode } from './markersHandler.js'

const parent = document.querySelector('#locationSelector');
const filteredList = parent.querySelector('ul');
const filter = document.querySelector('select');
const locationCreateOperator = (row )=>{
    const element = characterRow(row);
    if (true) parent.append(element);
    return element;
};

const locationsUpdateOperator = (row)=> {
    const locationElement = row.element;
    const newElement = characterRow(row);
    locationElement.replaceWith(newElement);
    return newElement; 
};

const locationDeleteOperator = (row) => {
    row.element.remove();
}


const onDelete = {
    action:'Cascade'
}

const locationNode = new graphNode(
    'location',
    ['locationName', 'locationId'],
    [markerNode],
    onDelete,
    locationCreateOperator,
    locationsUpdateOperator,
    locationDeleteOperator
)
export {
    locationNode 
}
