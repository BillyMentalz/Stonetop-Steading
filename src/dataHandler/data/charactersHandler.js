import { characters ,graphNode} from 'root/document.js'
import { characterRow} from 'root/injects/characters.js'
const tableShown = ['characterName', 'characterOccupation', 'characterTraits']
const characterTable = characters.querySelector('#characterTable');

const characterCreateOperator = (row )=>{
    const characterElement =  characterRow(row);
    characterTable.append(characterElement);
    return characterElement;
}

const characterUpdateOperator = (row)=> {
    const  characterElement = row.element;
    const newElement = characterRow(row);
    characterElement.replaceWith(newElement);
    return newElement;
}

const characterDeleteOperator = (row)=> {
    const  characterElement = row.element;
    characterElement.remove();
};

const characterNode = new graphNode(
    'characters',
    ['characterId'],
    [],
    {},
    characterCreateOperator,
    characterUpdateOperator,
    characterDeleteOperator
)

export {
    characterNode
}
