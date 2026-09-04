import { stringToHTML, stringToHTMLTable} from 'root/inject.js'
const characterRow = (row) => {
    const charRow = stringToHTMLTable(`
        <tr>
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
        <img class="Portrait" src="${row.characterImage}" alt="">
        <input type='file' accept="image/*" class="characterImageInput" data-action="Image" data-value="${row.characterImage}"> <table>
            <tbody>
                <tr> <td>Name: </td> <td><input type="text" name="characterName" value="${row.characterName}"></td></tr>
                <tr> <td>Pronouns: </td> <td><input type="text" name="characterPronouns" value="${row.characterPronouns}"></td></tr>
                <tr> <td>Profession: </td> <td><input type="text" name="characterProfession" value="${row.characterProfession}"></td></tr>
                <tr> <td>Home: </td> <td><input data-action="Homes" type="text" list="homesFilter" name="characterHome" value="${row.characterHome}"></td></tr>
                <tr> <td>Traits: </td> <td><input type="text" name="characterTraits" value="${row.characterTraits}"></td></tr>
            </tbody>
        </table>
    </div>
    <div class="CharacterInfo">
        <div class="columnTitle"> History </div>
        <textarea class="characterInfo">${row.characterInfo}</textarea>
        <button data-action="Update" type="button" name="Submit"> Submit </button>
        <button data-action="Delete" type="button" name="Delete"> Delete </button>
    </div>       
</div>`)
}
const characterCard = (row) => {
    return stringToHTML(`
<div class="characterCard">
    <div class="Infodeck">
        <img class="Portrait"src="${row.characterImage}" alt="">
        <div class="NameCard">
            <div class="characterName">${row.characterName} </div> 
            <div class="characterPronouns"> (${row.characterPronouns}) </div>
        </div>
        <table>
            <tbody>
                <tr> <td>Home: </td> <td>${row.characterHome}</td></tr>
                <tr> <td>Profession: </td> <td>${row.characterProfession}</td></tr>
                <tr> <td>Traits: </td> <td>${row.characterTraits}</td></tr>
            </tbody>
        </table>
    </div>
    <div class="characterNotes">
        <div class="tabHeaders">
            <div class="tabTitle">
                History
            </div>
            <div data-action="Edit" class="tabIcon fontMod">&#x270D</div>
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
