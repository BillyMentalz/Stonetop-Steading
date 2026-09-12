import { stringToHTML, stringToHTMLTable} from 'root/inject.js'
import { getHomeName } from 'root/dataHandler/data/homesHandler.js'
const characterRow = (row) => {
    const charRow = stringToHTMLTable(`
        <tr data-click="Select">
            <td>${row.characterName}</td>
            <td>${row.characterProfession}</td>
            <td>${row.characterTraits}</td>
        </tr>
    `);
    return charRow;
}

const characterCardForm = (row) => {
    return stringToHTML(`
<div class="characterCard">
    <div class="Infodeck">
        <label for="CharacterFileInput${row.characterId}">
        <img src="${row.characterImage}" alt="">
        </label>
        <input type='file' accept="image/*" class="characterImageInput" id="CharacterFileInput${row.characterId}" data-change="Image" data-value="${row.characterImage}"> <table>
            <tbody>
                <tr> <td>Name: </td> <td><input type="text" name="characterName" value="${row.characterName}"></td></tr>
                <tr> <td>Pronouns: </td> <td><input type="text" name="characterPronouns" value="${row.characterPronouns}"></td></tr>
                <tr> <td>Profession: </td> <td><input type="text" name="characterProfession" value="${row.characterProfession}"></td></tr>
                <tr> <td>Home: </td> <td><input data-change="Homes" data-homeName=${row.characterHome} type="text" list="homesFilter" name="characterHome" value="${getHomeName(row.characterHome)}"></td></tr>
                <tr> <td>Traits: </td> <td><input type="text" name="characterTraits" value="${row.characterTraits}"></td></tr>
            </tbody>
        </table>
    </div>
    <div class="CharacterInfo">
        <h2> History </h2>
        <textarea class="characterInfo">${row.characterInfo}</textarea>
        <button data-click="Update" type="button" name="Submit"> Submit </button>
        <button data-click="Delete" type="button" name="Delete"> Delete </button>
    </div>       
</div>`)
}
const characterCard = (row) => {
    return stringToHTML(`
<div class="characterCard">
    <div class="Infodeck">
        <img class="Portrait" src="${row.characterImage}" alt="">
        <div class="Headers">
            <h3>${row.characterName} </h3> 
            <div class="characterPronouns"> (${row.characterPronouns}) </div>
        </div>
        <table>
            <tbody>
                <tr> <td>Home: </td> <td data-homeName='${row.characterHome}'>${getHomeName(row.characterHome)}</td></tr>
                <tr> <td>Profession: </td> <td>${row.characterProfession}</td></tr>
                <tr> <td>Traits: </td> <td>${row.characterTraits}</td></tr>
            </tbody>
        </table>
    </div>
    <div class="characterNotes">
        <div class="Headers">
            <h2> History </h2>
            <h2 data-click="Edit" class="tabIcon">&#x270D</h2>
        </div>
        <div class="characterInfo">${row.characterInfo}</div>
    </div>       
</div>`)}

const characterLoading = ()=>{
    return stringToHTML(`
    <div class="CharacterCard">
        <div class="ColumnTitle">Sending... </div>
    </div>
    `)
}

export {
    characterRow,
    characterCard,
    characterCardForm,
    characterLoading
}
