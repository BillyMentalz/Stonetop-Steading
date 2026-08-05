import { characters } from '../document.js'
const tableShown = ['characterName', 'characterOccupation', 'characterTraits']
const characterTable = characters.querySelector('#characterTable');
const charactersOperator = (key, value )=>{
    let  characterElement = document.createElement("tr");
    characterElement.dataset.id = key;
    for ( const [head, data] of Object.entries(value)) {
        const tabdata = document.createElement("td");
        tabdata.dataset.head = head;
        tabdata.textContent = data;
        tabdata.style.display = tableShown.includes(head) ? 'flex': 'none';
        characterElement.append(tabdata);
    }
    characterTable.append(characterElement);
    return characterElement;
}

const charactersUpdateOperator = (key, value)=> {
    const  characterElement = document.querySelector(`[data-id="${key}"]`);
    for ( const [head, data] of Object.entries(value)) {
        const tabdata = characterElement.querySelector(`[data-head="${head}"]`);
        tabdata.textContent = data;
    };
    return characterElement;
}

const charactersDeleteOperator = (key)=> {
    const  characterElement = document.querySelector(`[data-id="${key}"]`);
    characterElement.remove();
}

export {
    charactersOperator,
    charactersUpdateOperator,
    charactersDeleteOperator
}
