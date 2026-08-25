import { maps , graphNode} from 'root/document.js'
import { locationNode } from './locationsHandler.js'
import { newHome, newSelectionHome } from 'root/injects/homes.js'
const homesCreateOperator = (row )=>{
    const elements = document.querySelectorAll(`[data-entrypoint="homes"]`);
    elements.forEach(thing => {
        let element = null;
        if (thing.tagName == "SELECT"){
            element = newSelectionHome(row);
        } 
        else if (thing.tagName == "DATALIST") {
            element = newSelectionHome(row);
        }
        else if (thing.tagName == "UL"){
            element = newHome(row);
        }
        
        thing.appendChild(element);
    })
    return elements.item(0);
}

const homesUpdateOperator = (row)=> {
    const element = row.element;
    throw Error ('WHat!?');
    return element;
}

const homesDeleteOperator = (row)=> {
    const things = document.querySelectorAll(`[data-entrypoint="homes"]`);
    things.forEach(thing => {
        let element = null;
        if (thing.tagName == "SELECT"){
            element = thing.querySelector(`option[value="${row.homeName}"]`)
        } 
        else if (thing.tagName == "DATALIST") {
            element = thing.querySelector(`option[value="${row.homeName}"]`)
        }
        else if (thing.tagName == "UL"){
            element = thing.querySelector(`li[value="${row.homeName}"]`)
        }
        if (element) element.remove();
    })
    row.element.remove();
};

const homeNode = new graphNode(
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
