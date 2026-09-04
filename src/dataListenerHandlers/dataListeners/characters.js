import {socket , characters} from 'root/document.js'
import {characterCard} from 'root/injects/characters.js'
const filterHomeValue = characters.querySelector('select[name="Home"]');
const sortValue = characters.querySelector('select[name="Sort"]');
const list = characters.querySelector('#characterTable')
const modal = document.getElementById('modal');
const characterSort = {
    "Created(Ascending)":   (a, b) => { return a.characterCreationDate.localeCompare(b.characterCreationDate);},
    "Created(Descending)":  (a, b) => { return - (a.characterCreationDate.localeCompare(b.characterCreationDate))},
    "Latest(Ascending)":    (a, b) => { return a.latestModified.localeCompare(b.latestModified)},
    "Latest(Descending)":   (a, b) => { return -(a.latestModified.localeCompare(b.latestModified))},
    "Name(Ascending)":      (a, b) => { return a.characterName.localeCompare(b.characterName)},
    "Name(Descending)":     (a, b) => { return -(a.characterName.localeCompare(b.characterName))}
}

function mockRandomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    // Set the version bit (4) and variant bit (8, 9, a, or b) to match RFC 4122 v4 specifications
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
const characterAdd  = [
    'click',
    '.tabIcon',
    (parent, element, event)=> {
        const result = {
            table:'characters',
            id: mockRandomUUID(),
            home: `${filterHomeValue.value !== " " ? filterHomeValue.value : "At World's End"}`,
            name: 'New Character',
            pronouns: 'They/them',
            profession: '???',
            info : 'Add more information here',
            traits: 'Add more information here'
        }
        socket.emit('create', result);
    }
]

const characterSelect = [
    'click',
    'tr',
    (parent, element, event) => {
        const info = element.__rowReference; 
        //if (!info.card) {
            info.card = characterCard(info);
            info.card.__rowReference = info;
        //}
        if (modal.firstChild) modal.removeChild(modal.firstChild);
        modal.append(info.card);
        modal.style.display = "block";
    }
]

const characterFilterAndSort = [
    'change',
    '.filterRow',
    (parent, element, event) => {
        const table = parent.__graphNodeRef.table;
        const filteredCharacters = [];
        let child = list.lastElementChild;
        while (child) {
            list.removeChild(child);
            child = list.lastElementChild;
        }
        for (const [key,row] of Object.entries(table)){
            if (filterHomeValue.value == " " || row.characterHome == filterHomeValue.value )  {
                filteredCharacters.push(row);
            }
        }
        const eventSort = (sortValue.value !== " ") ?  characterSort[sortValue.value]: characterSort["Created(Ascending)"];
        filteredCharacters.sort(eventSort);
        for ( const character of filteredCharacters) {
            list.append(character.element);
        }
    }
]

export {
    characterAdd,
    characterSelect,
    characterFilterAndSort,
}
