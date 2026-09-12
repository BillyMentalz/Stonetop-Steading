import {characterCard, characterCardForm, characterLoading} from 'root/injects/characters.js'
import {socket , addBoxTemplate, filehelper} from 'root/document.js'
import { getHomeId } from 'root/dataHandler/data/homesHandler.js'

const datalist = document.getElementById('homesFilter')
const characterEdit = (element, event) => {
        const thing = event.currentTarget.firstChild; 
        const info = thing.__rowReference;
        const characterForm = characterCardForm(info);
        thing.replaceWith(characterForm);
        characterForm.__rowReference = info;
}

const characterUpdate = (element, event) =>  {
    const characterForm = event.currentTarget.firstChild;
    const thing = characterLoading();
    characterForm.replaceWith(thing) 
    const emitCharacterUpdate = (eventualUrl) => {
        socket.emit('update', {
            table:'characters',
            characterName: characterForm.querySelector('input[name="characterName"]').value,
            characterHome: getHomeId(characterForm.querySelector('input[name="characterHome"]').value),
            characterPronouns: characterForm.querySelector('input[name="characterPronouns"]').value,
            characterProfession: characterForm.querySelector('input[name="characterProfession"]').value,
            characterTraits: characterForm.querySelector('input[name="characterTraits"]').value,
            characterInfo: characterForm.querySelector('textarea[class="characterInfo"]').value,
            characterImage: eventualUrl,
            characterId: characterForm.__rowReference.characterId,
        })
    }
    const fileInput = characterForm.querySelector('input[type="file"]');
    if (fileInput.dataset.value == characterForm.__rowReference.characterImage) {
        emitCharacterUpdate(characterForm.__rowReference.characterImage)
    }
    else {
        filehelper('characters', characterForm.__rowReference.characterId, fileInput, emitCharacterUpdate );
    }
}

const characterImageChange = (element, event) => {
    const image = event.currentTarget.querySelector('img');
    const [file] = element.files;
    if (file) {
        image.src = URL.createObjectURL(file);
        element.dataset.value = file.name;
        if (file.size > 5 * 1024 * 1024) {
            window.alert("This file is too large for actual upload. Please keep the size of the image >5mb to actually update this.");
        }
    }
}

const characterDelete = (element,event) => {
    const info = event.currentTarget.firstChild.__rowReference;
    if (!window.confirm("Delete Character?")) {
        return;
    }
    console.log(info);
    socket.emit('delete', {
        table:'characters',
        characterId: info.characterId
    });
}

const isValueInDatalist = (value) => {
    const trimmedValue = value.trim().toLowerCase()
    const options = datalist.querySelectorAll('option');
    return Array.from(options).find(option => option.value.trim().toLowerCase() === trimmedValue) ;
}

const characterHomeChange  = (element, event) => {
    const finalInput = isValueInDatalist(element.value);
    if (finalInput !== undefined) element.value = finalInput.value;
    else {
        if (!window.confirm("Add Area? \n If you cannot provide a map of the area, features may not be working")){
                element.value = "At World's End";
        }
        else {
            socket.emit('create', {
                table: 'homes',
                homeName: element.value
            })
        }
    }
}

const characterForm = {
    'click': {
        'Edit': characterEdit,
        'Update': characterUpdate,
        'Delete': characterDelete
    },
    'change': {
        'Image': characterImageChange,
        'Homes': characterHomeChange
    }
}

export {
    characterForm,
}
