import {stringToHTML} from '../inject.js'

const listsRow = ( index, text) => { // I decided that at this point that using Id kinda blows. So if you want to access element, the proper way would be to select element, index to access. If this is too much for you it's not trust me.
    const elementString = `
        <li data-index="${index}">  
            ${text}
        </li>`
    return stringToHTML(elementString);
}
const lists = (id, rows) => {
    const elementString = `
        <ul > 
            ${rows.map(row => `
            <li data-index="${row.index}">
                ${row.text} 
            </li>
            `).join('')} 
        </ul>` 
    return stringToHTML(elementString);
}

const defaultLists = ()=> {
    return `
        <ul class="w">
            <li> Add here.... </li>
        </ul>
    `
}


