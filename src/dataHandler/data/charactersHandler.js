import { characters ,graphNode} from 'root/document.js'
import { charRow} from 'root/inject/characters.js'
const tableShown = ['characterName', 'characterOccupation', 'characterTraits']
const characterTable = characters.querySelector('#characterTable');

const characterCreateOperator = (row )=>{
    const characterElement =  charRow(row);
    characterTable.append(characterElement);
    return characterElement;
}

const characterUpdateOperator = (row)=> {
    const  characterElement = row.element;
    const newElement = charRow(row);
    characterElement.replaceWith(newElement);
    return newElement;
}

const characterDeleteOperator = (row)=> {
    const  characterElement = row.element;
    characterElement.remove();
};

const characterNode = graphNode(
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
