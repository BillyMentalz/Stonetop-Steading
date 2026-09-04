import {characterCard, characterCardForm, characterLoading} from 'root/injects/characters.js'
import {socket , addBoxTemplate} from 'root/document.js'

const datalist = document.getElementById('homesFilter')
const characterEdit = (parent, element, event) => {
        const thing = parent.firstChild; 
        const info = thing.__rowReference;
        const characterForm = characterCardForm(info);
        thing.replaceWith(characterForm);
        characterForm.__rowReference = info;
}



const characterUpdate = (parent, element, event) =>  {
        const characterForm = parent.firstChild;
        const thing = characterLoading();
        characterForm.replaceWith(thing) 
        const emitCharacterUpdate = (eventualUrl) => {
            socket.emit('update', {
                table:'characters',
                name: characterForm.querySelector('input[name="characterName"]').value,
                home: characterForm.querySelector('input[name="characterHome"]').value,
                pronouns: characterForm.querySelector('input[name="characterPronouns"]').value,
                profession: characterForm.querySelector('input[name="characterProfession"]').value,
                traits: characterForm.querySelector('input[name="characterTraits"]').value,
                info: characterForm.querySelector('textarea[class="characterInfo"]').value,
                image: eventualUrl,
                id: characterForm.__rowReference.characterId,
            })
        }
        const fileInput = characterForm.querySelector('input[type="file"]');
        if (fileInput.dataset.value == characterForm.__rowReference.characterImage) {
            emitCharacterUpdate(characterForm.__rowReference.characterImage)
        }
        else {
            const reader = new FileReader();
            reader.onload = (e)=> {
                const base64String = e.target.result; 
                fetch('/api/upload', {
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        image: base64String, characterId: characterForm.__rowReference.characterId
                    })     
                }).then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else {
                        throw new Error(`Upload Failed with Response Code ${response.status}`)
                    }
                }
                ).then(data => {
                    const character = "characters/" + data.fileName;
                    emitCharacterUpdate(character);
                }).catch(error => {
                        console.error('Upload Error' , error)
                    })
            }
            const [file] = fileInput.files
            reader.readAsDataURL(file);
        }
    }

const characterImageChange = (parent, element, event) => {
        const image = parent.querySelector('img');
        const [file] = element.files;
        if (file) {
            image.src = URL.createObjectURL(file);
            element.dataset.value = file.name;
        }
    }

const characterDelete = (parent,element,event) => {
    const info = parent.firstChild.__rowReference;
    if (!window.confirm("Delete Character?")) {
        return;
    }
    socket.emit('delete', {
        table:'characters',
        id: info.characterId
    });
}

const isValueInDatalist = (value) => {
    const trimmedValue = value.trim().toLowerCase()
    const options = datalist.querySelectorAll('option');
    return Array.from(options).find(option => option.value.trim().toLowerCase() === trimmedValue) ;
}

const characterHomeChange  = (parent, element, event) => {
    const finalInput = isValueInDatalist(element.value);
    if (finalInput !== undefined) element.value = finalInput.value;
    else {
        if (!window.confirm("Add Area? \n If you cannot provide a map of the area, features may not be working")){
                element.value = "At World's End";
        }
        else {
            socket.emit('create', {
                    table: 'homes',
                    name: element.value
            })
        }
    }
}



const characterFormClicker ={
    eventName: 'click',
    actions: {
        'Edit': characterEdit,
        'Update': characterUpdate,
        'Delete': characterDelete
    }
} 

const characterFormChanger = {
    eventName: 'change',
    actions: {
        'Image': characterImageChange,
        'Homes': characterHomeChange
    }
}

export {
    characterFormChanger,
    characterFormClicker
}
