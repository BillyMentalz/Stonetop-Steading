import { markerElement } from 'root/injects/markers.js' 
import { locationNode } from './locationsHandler.js'
import {graphNode} from 'root/document.js'

const markerCreateOperator = (row )=>{
    const element = markerElement(row);
    if (true) parent.append(element); // Placeholder element. Please add when needed. The marker element depends on some shtuff
    return element;
};

const markersUpdateOperator = (row)=> {
    const markerElement = row.element;
    const newElement = markerElement(row);
    if (true) markerElement.replaceWith(newElement);
    return newElement; 
};

const markerDeleteOperator = (row) => {
    row.element.remove();
}
const onDelete = {
    action:'Cascade'
}
const markerNode = new graphNode(
    'markers',
    ['markerName', 'markerId', 'markerOrder', 'markerSignifier'],
    [],
    onDelete,
    markerCreateOperator,
    markersUpdateOperator,
    markerDeleteOperator
)
export {
    markerNode 
}
