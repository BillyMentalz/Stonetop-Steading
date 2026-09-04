import { maps , graphNode} from 'root/document.js'
import { locationNode } from './locationsHandler.js'
import { newHome, newSelectionHome } from 'root/injects/homes.js'

const store = {};
const worldMap = document.querySelector('#worldMaps ul');

const createSelection = (row) => {
    const parents = document.querySelectorAll(`[data-entrypoint="homes"]`);
    let homeStore = []
    parents.forEach(parent => {
        let element = null;
        if (parent.tagName == "DATALIST") {
            element = newSelectionHome(row);
        }
        else if (parent.tagName == "SELECT"){
            element = newSelectionHome(row);
        }
        parent.appendChild(element);
        homeStore.push(element);
    })
    return homeStore;
}

const updateSelection = (homeStore, row)=> {
    let newHomeStore = []
    homeStore.forEach(element => {
        let newElement  = null;
        if (element.tagName !== 'OPTION') return;
        newElement = newSelectionHome(row);
        element.replaceWith(newElement);
        newHomeStore.push(newElement);
    })
    return newHomeStore;
}

const homesCreateOperator = (row )=>{
    const homeElement = newHome(row);
    homeElement.__selectionReference = createSelection(row) ;
    worldMap.appendChild(homeElement);
    return homeElement;
}

const homesUpdateOperator = (row)=> {
    const newHomeElement = newHome(row);
    newHomeElement.__selectionReference = updateSelection(row.element.__selectionReference, row);
    row.element.replaceWith(newHomeElement);
    return newHomeElement;
}

const homesDeleteOperator = (row)=> {
    const removal = row.element.__selectionReference
    removal.forEach(element => { element.remove()});
    row.element.remove();
};

const homeNode = new graphNode(
    'homes',
    ['homeName'],
    {},
    {},
    homesCreateOperator,
    homesUpdateOperator,
    homesDeleteOperator,
)

export {
    homeNode
}
