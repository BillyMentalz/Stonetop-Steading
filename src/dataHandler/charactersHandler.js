const charactersLoader = (payload)=> {
    for (const [key, value] of Object.entries(payload)){
        charactersOperator(key, value);
    }
}
const parent = document.querySelector('#charactertable')
const charactersOperator = (key, value )=>{
    let  characterElement = document.createElement("tr");
    characterElement.dataset.id = key;
    for ( const [head, data] of Object.entries(value)) {
        let tabdata = document.createElement("td");
        tabdata.dataset.head = head;
        tabdata.textContent = data;
        characterElement.append(tabdata);
    }
    parent.append(characterElement);


}

const charactersUpdateOperator = (key, value)=> {
    let  characterElement = document.querySelector(`tr#${key}`);
    characterElement.dataset.id = key;
    for ( const [head, data] of Object.entries(value)) {
        let tabdata = document.createElement("td");
        tabdata.dataset.head = head;
        tabdata.textContent = data;
        characterElement.append(tabdata);
    }
}


export {
    charactersLoader,
    charactersOperator,
    charactersUpdateOperator
}
