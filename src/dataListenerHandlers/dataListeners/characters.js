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


const characterAdd  = (element, event)=> {
        const result = {
            table:'characters',
            characterHome: `${filterHomeValue.value !== "null" ? filterHomeValue.value : 1 }`,
            characterName: 'New Character',
            characterPronouns: 'They/them',
            characterProfession: '???',
            characterInfo : 'Add more information here',
            characterTraits: 'Add more information here'
        }
        socket.emit('create', result);
    }

const characterSelect = (element, event) => {
        const info = element.__rowReference; 
        info.card = characterCard(info);
        info.card.__rowReference = info;
        if (modal.firstChild) modal.removeChild(modal.firstChild);
        modal.append(info.card);
        modal.style.display = "block";
    }


const characterFilterAndSort = (element, event) => {
        const table = event.currentTarget.__graphNodeRef.table;
        const filteredCharacters = [];
        let child = list.lastElementChild;
        while (child) {
            list.removeChild(child);
            child = list.lastElementChild;
        }
        for (const [key,row] of Object.entries(table)){
            if (filterHomeValue.value === "null" || row.characterHome == filterHomeValue.value )  {
                filteredCharacters.push(row);
            }
        }
        const eventSort = (sortValue.value !== " ") ?  characterSort[sortValue.value]: characterSort["Created(Ascending)"];
        filteredCharacters.sort(eventSort);
        for ( const character of filteredCharacters) {
            list.append(character.element);
        }
    }

const characterList = {
    'click': {
        'Add': characterAdd,
        'Select': characterSelect
    },
    'change': {
        'FilterSort': characterFilterAndSort
    }
}

export {
    characterList
}
