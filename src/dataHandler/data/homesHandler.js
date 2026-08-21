import { maps , graphNode} from 'root/document.js'
import { locationNode } from './locationHandler.js'
import { newHome } from 'root/inject/homes.js'
const homesCreateOperator = (row )=>{
    const element = newHome(row);
    maps.appendChild(element);
    return element;
}

const homesUpdateOperator = (row)=> {
    const element = row.element;
    throw Error ('WHat!?');
    return element;
}

const homesDeleteOperator = (row)=> {
    row.element.remove();
}

const homeNode = graphNode(
    'homes',
    ['homeName'],
    [locationNode], 
    {},
    homesCreateOperator,
    homesUpdateOperator,
    homesDeleteOperator,
)

export {
    homeNode
}
