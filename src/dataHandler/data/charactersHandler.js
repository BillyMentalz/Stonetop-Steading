import { characters ,graphNode} from 'root/document.js'
import { homeNode } from './homesHandler.js'
import { characterRow, characterCard} from 'root/injects/characters.js'
const tableShown = ['characterName', 'characterOccupation', 'characterTraits']
const characterTable = characters.querySelector('#characterTable');
const modal = document.getElementById('modal');

const filterHomeValue = characters.querySelector('select[name="Home"]');

const characterCascadeRules = {
    up:{},
    down:{},
    additional: {
        'homeName': 'characterHome'
    }
}

const characterCreateOperator = (row )=>{
    const characterElement =  characterRow(row);
    if (filterHomeValue.value === row.characterHome || filterHomeValue.value === " ") characterTable.append(characterElement);
    return characterElement;
}

const characterUpdateOperator = (row)=> {
    const  characterElement = row.element;
    const newElement = characterRow(row);
    if(row.card) {
        row.card = characterCard(row);
        if (modal.firstChild) modal.removeChild(modal.firstChild);
        row.card.__rowReference = row;
        modal.append(row.card);
    }
    characterElement.replaceWith(newElement);
    return newElement;
}

const characterDeleteOperator = (row)=> {
    const  characterElement = row.element;
    characterElement.remove();
    if (row.card) {
        if (modal.firstChild ){
            if (modal.firstChild.__rowReference === row) {
                modal.removeChild(modal.firstChild);
            }
        } 
        row.card.remove();
        delete row.card;
    }
};

const characterNode = new graphNode(
    'characters',
    ['characterId'],
    homeNode,
    characterCascadeRules,
    characterCreateOperator,
    characterUpdateOperator,
    characterDeleteOperator,
    'characters'
)

export {
    characterNode
}
