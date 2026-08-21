import { markerElement } from 'root/inject/markers.js' 
import {graphNode} from 'root/document.js'
const markerCreateOperator = (row )=>{
    const element = markerElement(row);
    if (true) parent.append(element); // Placeholder element. Please add when needed. The marker element depends on some shtuff
    return element;
};

const markersUpdateOperator = (row)=> {
    const markerElement = row.element;
    const newElement = characterRow(row);
    if (true) markerElement.replaceWith(newElement);
    return newElement; 
};

const markerDeleteOperator = (row) => {
    row.element.remove();
}

const markerNode = graphNode(
    'markers',
    ['markerName', 'markerId', 'markerOrder', 'markerSignifier'],
    [],
    {},
    markerCreateOperator,
    markersUpdateOperator,
    markerDeleteOperator
)
export {
    markerNode 
}
