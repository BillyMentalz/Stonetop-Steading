import {characterRow } from 'root/inject/characters.js' 
import {graphNode} from 'root/document.js'
import {markerNode } from './markersHandler.js'
const locationCreateOperator = (row )=>{
    const element = characterRow(row);

    if (true) parent.append(element); // Placeholder element. Please add when needed. The location element depends on some shtuff
    return element;
};

const locationsUpdateOperator = (row)=> {
    const locationElement = row.element;
    const newElement = characterRow(row);
    if (true) locationElement.replaceWith(newElement);
    return newElement; 
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
