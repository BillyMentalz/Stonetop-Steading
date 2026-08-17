import {characterRow } from 'root/inject/characters.js' 
import {graphNode} from 'root/document.js'
import {markerNode } from './markersHandler.js'
const locationCreateOperator = (row )=>{
    if (false) return;  // Placeholder code 
    const element = characterRow(row);
    parent.append(element);
    return element;
};

const locationsUpdateOperator = (row)=> {
    if (false) return; 
    const locationElement = row.element;
    const newElement = characterRow(row);
    locationElement.replaceWith(newElement);
    row.element = newElement;
    return row.element; 
};

const locationDeleteOperator = (row) => {
    row.element.remove();
}

const locationNode = graphNode(
    'location',
    ['locationName', 'locationId'],
    [markerNode],
    {},
    locationCreateOperator,
    locationsUpdateOperator,
    locationDeleteOperator
)
export {
    locationNode 
}
