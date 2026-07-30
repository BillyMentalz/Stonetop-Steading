const homesOperator = (key, value )=>{
    const thing = document.getElementById('locationList');
    console.log(thing);
    return thing;
}


const homesUpdateOperator = (key, value)=> {
    console.log("Update",key);
    return document.getElementById('locationList');
}

const homesDeleteOperator = (key, value)=> {
    console.log("Delete", key);
}


export {
    homesOperator,
    homesUpdateOperator,
    homesDeleteOperator
}
