import { maps } from '../document.js'
const homesOperator = (key, value )=>{
    const element = document.createElement("div")
    element.classList.add('S');
    element.textContent = key;
    element.id = key;
    maps.appendChild(element);
    return element;
}


const homesUpdateOperator = (key, value)=> {
    const element = maps.getElementById(key);
    element.textContent = key;
    return element;
}

const homesDeleteOperator = (key, value)=> {
    const element = maps.getElementById(key);
    console.log(element);
    element.remove();
}


export {
    homesOperator,
    homesUpdateOperator,
    homesDeleteOperator
}
