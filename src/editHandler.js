

const listEdit = (socket, element) => {
    let newInput = document.createElement('input');
    let spanElement = element.querySelector('[data-field]');
    newInput.type = "text";
    newInput.value = spanElement.textContent;
    newInput.id = element.id; 
    let id = element.id.split('/%/')
    let name = id[0];
    console.log("Name:" + name)
    let torder = id[1];
    console.log("order:" +torder )
    newInput.dataset.field = 'listText';
    spanElement.replaceWith(newInput);
    newInput.addEventListener( 'change', (e)=> {
        socket.emit(e.target.value == "" ? 'delete': 'update', {
            table: 'lists',
            name: name,
            order: torder, 
            text: e.target.value
        })
    })
}




const edit = {
    'lists': listEdit
}



const startEditing = (socket, element, table)=> {
    edit[table](socket,element);
}



export {startEditing};
