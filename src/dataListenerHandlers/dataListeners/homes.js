import {socket, filehelper} from 'root/document.js'
import {homeCard, homeCardForm } from 'root/injects/homes.js'
const homeCardLocation = document.querySelector('#extra');
const mapImage = document.querySelector('#map img');

const homeAdd = (element, event)=> {
    const last = event.currentTarget.querySelector('ul').lastElementChild;
    if (window.confirm("Add new site?")) {
        const result = {
            table:'homes',
            homeName: '...',
        }
        socket.emit('create', result);
    }
}

const homeSelect = (element, event) => {
    const parentData  = event.currentTarget.dataset;
    const info = element.__rowReference;
    info.card = homeCard(info);
    info.card.__rowReference = info;
    if (parentData.selected == info.homeId) {
        homeCardLocation.removeChild(homeCardLocation.firstChild);
        event.currentTarget.classList.remove("expanded");
        parentData.selected = "noneAtTheMoment"
    }
    else  {
        if (parentData.selected != "noneAtTheMoment"){
            homeCardLocation.removeChild(homeCardLocation.firstChild);
        } 
        event.currentTarget.classList.add("expanded");
        homeCardLocation.append(info.card);
        parentData.selected = info.homeId;
    }
}

const homeEdit = (element, event) => {
    const thing = homeCardLocation.firstChild;
    const info = thing.__rowReference;
    const homeForm = homeCardForm(info);
    thing.replaceWith(homeForm);
    homeForm.__rowReference = info;
}

const homeMapChange = (element,event) => {
    const image = homeCardLocation.querySelector('img');
    const [file] = element.files;
    if (file) {
        image.src = URL.createObjectURL(file);
        element.dataset.value = file.name;
        if (file.size > 5 * 1024 * 1024) {
            window.alert("This file is too large for actual upload. Please keep the size of the image >5mb to actually update this.");
        }
    }
}

const homeUpdate = (element,event) => {
    const homeForm = homeCardLocation.firstChild;
    const formGet = (name) => homeForm.querySelector(`input[name="${name}"]`).value
    const emitHomeUpdate = (eventualUrl) => {
        socket.emit('update', {
            table: 'homes',
            homeId:     homeForm.__rowReference.homeId,
            homeName:   formGet('homeName'),
            homeTagline:formGet('homeTagLine'),
            homeImage:  eventualUrl,
        })
    }
    const fileInput = homeForm.querySelector('input[type="file"]');
    if (fileInput.dataset.value == homeForm.__rowReference.homeImage) {
        emitHomeUpdate(homeForm.__rowReference.homeImage)
    }
    else {
        filehelper('maps', homeForm.__rowReference.homeId, fileInput, emitHomeUpdate);
    }

}

const homeDelete = (element, event)=> {
    const info = homeCardLocation.firstChild.__rowReference;
    if (!window.confirm("Delete Character?")) {
        return;
    }
    socket.emit('delete', {
        table:          'home',
        characterId:    info.homeId
    });
}

const homeGoTo = (element, event) => {
    const info = element.closest('.house').__rowReference;
    if (info.homeImage == "") {
        window.alert('There is no map to go to');
        return;
    }
    else {
        console.log(info.homeImage);
        mapImage.src = info.homeImage;
        //updateLocation();
        //updateMarkers();
    }
}

const homeForm = {
    'click': {
        'Add': homeAdd,
        'Edit': homeEdit,
        'Go': homeGoTo,
        'Select': homeSelect,
        'Update': homeUpdate,
        'Delete': homeDelete
    },
    'change': {
        'Image': homeMapChange 
    }
}

export {
   homeForm 
}
