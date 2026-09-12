import { stringToHTML } from 'root/inject.js'

const newHome = (row) => {
    return stringToHTML( `
    <li data-click="Select" id="${row.homeName}"> ${row.homeName}
    </li>
    `);
};

const newSelectionHome = (row)=> {
    return stringToHTML(`
        <option value="${row.homeId}">${row.homeName} </option>
        `
    )
}
const homeCardForm = (row) => {
    return stringToHTML(`
    <div class = "house">
        <div class="Headers">
            <h4> 
            <input type="text" name="homeName" value="${row.homeName}"> 
            </h4>
            <button data-click="Update" type="button" name="Submit"> Submit </button>
            <button data-click="Delete" type="button" name="Delete"> Delete </button>
        </div>
        <div class="mapCards">
            <label for="HomeFileInput">
            <img src="${row.homeImage}" alt="Oops">
            </label>
        </div>
        <input type="text" name="homeTagLine" value="${row.homeTagLine}">
        <input id="HomeFileInput"type='file' accept="image/*" class="characterImageInput" data-change="Image" data-value="${row.homeImage}">
        </div>
    </div>    
    `)
}
const homeCard = (row) => {
    return stringToHTML(`
    <div class="house">
        <div class="Headers">
            <h4>${row.homeName} </h4>
            <h4 data-click="Edit" class="tabIcon">&#x270D</h4>
        </div>
        <div class="mapCards">
            <img src="${row.homeImage}" alt="Oops"> 
            ${row.homeImage != "maps/Mystery.png" ? `<h4 data-click="Go" class="GoTo"> Go &#8608</h4>`: '' }
        </div>           
        <div class="homeTagLine">${row.homeTagLine} </div>
    </div>
    `)
} 

export {
    newHome,
    homeCard,
    homeCardForm,
    newSelectionHome
}
