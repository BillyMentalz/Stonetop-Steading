const listsOperator = (key, value )=>{
    const listIndex = key.split('/%/');
    const parent = document.querySelector(`ul#${listIndex[0]}`)
    let  listElement = document.createElement("li");
    let  spanElement  = document.createElement("span")
    spanElement.textContent = value.listText;
    spanElement.dataset.field = 'listText' ;
    listElement.append(spanElement);
    listElement.dataset.index = listIndex[1];
    listElement.dataset.editable = 'lists';
    listElement.id = key;
    parent.append(listElement);
    return listElement;
}

const listsUpdateOperator = (key, value)=> {
    const listIndex = key.split('/%/');
    const listElement = document.getElementById(key);
    let para = listElement.querySelector('[data-field]');
    let  spanElement  = document.createElement("span")
    spanElement.textContent = value.listText;
    spanElement.dataset.field = 'listText' ;
    para.replaceWith(spanElement);
    return listElement;
}

const listsDeleteOperator = (key) => {
    const listElement = document.getElementById(key);
    console.log(listElement)
    listElement.remove();
}

export {
    listsOperator,
    listsUpdateOperator,
    listsDeleteOperator
}
