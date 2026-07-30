const locationsLoader = (payload)=> {
    for (const [key, value] of Object.entries(payload)){
        locationsOperator(key, value);
    }
}
const locationsOperator = (key, value )=>{
    let parent = document.createElement('div');
    const locationIndex = key.split('/%/');
    parent  = document.querySelector(`ul#${locationIndex[0]}`)
    let  locationElement = document.createElement("li");
    locationElement.dataset.index = locationIndex[1];
    locationElement.innerHTML = value.locationText;
    parent.append(locationElement);


}

const locationsUpdateOperator = (key, value)=> {
    const locationElement = document.querySelector(`p#${1} [data-index='${[1]}']`)
    locationElement.textContent = value.locationText;

}


export {
    locationsLoader,
    locationsOperator,
    locationsUpdateOperator
}
