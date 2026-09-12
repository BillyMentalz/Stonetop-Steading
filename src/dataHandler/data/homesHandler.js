import { maps , graphNode} from 'root/document.js'
import { locationNode } from './locationsHandler.js'
import { characterNode } from './charactersHandler.js'
import { newHome, newSelectionHome, homeCard} from 'root/injects/homes.js'
const homeCardLocation = document.querySelector('#extra');
const homeTab = document.getElementById('worldMaps');
const worldMap = homeTab.querySelector('ul');

const store = {};

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
        let newElement = null;
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
    if (row.card ) {
        row.card = homeCard(row);
        row.card.__rowReference = row;
        if ( homeTab.dataset.selected == row.homeId) {
            homeCardLocation.removeChild(homeCardLocation.firstChild);
            homeCardLocation.append(row.card);

        }
    }
    row.element.replaceWith(newHomeElement);
    return newHomeElement;
}

const homesDeleteOperator = (row)=> {
    const removal = row.element.__selectionReference
    removal.forEach(element => { element.remove()});
    if (row.card ) {
        if ( homeTab.dataset.selected == row.homeId) {
            homeCardLocation.removeChild(homeCardLocation.firstChild);
            homeTab.classList.remove("expanded");
            homeTab.dataset.selected = "noneAtTheMoment"
        }
    }
    row.element.remove();
};

const onDelete = {
    action:'Cascade'
}

const homeNode = new graphNode(
    'homes',
    ['homeId'],
    [locationNode, characterNode],
    onDelete,
    homesCreateOperator,
    homesUpdateOperator,
    homesDeleteOperator,
    'worldMaps'
)

const getHomeName = (id)=> { return homeNode.table[id].homeName; }
const getHomeId = (name) => { 
    for (const [key, row] of Object.entries(homeNode.table)) {
        if (row.homeName == name) {
            return key;
        }
    }
    throw Error(`This home does not exist! Home: ${name}`)
}

export {
    homeNode,
    getHomeName,
    getHomeId
}
